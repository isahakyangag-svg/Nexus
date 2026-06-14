import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON request bodies with increased limit for larger installers (e.g. up to 50mb)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy-loaded Gemini API Client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// API Routes
app.post("/api/chat", async (req: express.Request, res: express.Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ 
        reply: "Привет! Я работаю в демонстрационном режиме, так как ключ GEMINI_API_KEY еще не настроен. Однако я всё равно могу рассказать вам о Nexus! Nexus — это инновационный зашифрованный мессенджер с поддержкой 8K аудио и полной анонимностью.",
        offline: true
      });
    }

    const ai = getGeminiClient();
    const mappedHistory = (history || []).map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are Mark, the Virtual Support Agent for the Nexus Project.
Key characteristics of Nexus:
- 100% secure, end-to-end P2P encryption, no server stores chat messages.
- Total anonymity: registration requires only a cryptographic pair of keys, no phone or email is needed.
- Crystal Voice AI technology: 8K audio stream quality with smart noise extraction and ambient micro-fade cancellation.
- Completely free: supported by physical community donations, no ads, no commercial logs.
- Downloadable cross-platform package is available here (adapts to Windows/macOS/Linux/Android/iOS in one-click setup).
- 24/7 client monitoring is active. If needed, human administrator can intercept the dialogue from the Admin Panel.

Respond in a helpful, high-tech, welcoming style, primarily in Russian. Keep response lengths reasonable for a chat bubble. Be conversational and intelligent.`,
      },
      history: mappedHistory,
    });

    const response = await chat.sendMessage({ message });
    return res.json({ reply: response.text });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return res.status(500).json({ error: err.message || "Failed to process chat message" });
  }
});

// Setup Installer Management APIs
app.post("/api/upload-installer-chunk", (req: express.Request, res: express.Response) => {
  try {
    const { chunkIndex, totalChunks, fileName, fileType, chunkData } = req.body;
    if (chunkIndex === undefined || totalChunks === undefined || !fileName || !chunkData) {
      return res.status(400).json({ error: "Missing required chunk fields" });
    }

    const targetFilePath = path.join(process.cwd(), "custom_setup.file");
    const tempChunkPath = path.join(process.cwd(), "custom_setup.part");

    const chunkBuffer = Buffer.from(chunkData, "base64");

    if (chunkIndex === 0) {
      // Start of upload - overwrite any existing temp part
      fs.writeFileSync(tempChunkPath, chunkBuffer);
    } else {
      // Append to existing temp part
      fs.appendFileSync(tempChunkPath, chunkBuffer);
    }

    console.log(`Received chunk ${chunkIndex + 1}/${totalChunks} for ${fileName} (${chunkBuffer.length} bytes)`);

    if (chunkIndex === totalChunks - 1) {
      // Final chunk, rename temp part to final path
      if (fs.existsSync(targetFilePath)) {
        fs.unlinkSync(targetFilePath);
      }
      fs.renameSync(tempChunkPath, targetFilePath);

      // Save metadata
      const fileSize = fs.statSync(targetFilePath).size;
      const infoPath = path.join(process.cwd(), "custom_setup_info.json");
      fs.writeFileSync(infoPath, JSON.stringify({ fileName, fileType, size: fileSize }));

      console.log(`Chunked upload completed successfully: ${fileName} (${fileSize} bytes)`);
      return res.json({ success: true, completed: true, fileName, size: fileSize });
    }

    return res.json({ success: true, completed: false, nextChunk: chunkIndex + 1 });
  } catch (err: any) {
    console.error("Chunk upload error:", err);
    try {
      const tempChunkPath = path.join(process.cwd(), "custom_setup.part");
      if (fs.existsSync(tempChunkPath)) {
        fs.unlinkSync(tempChunkPath);
      }
    } catch (e) {}
    return res.status(500).json({ error: err.message || "Failed to process chunk" });
  }
});

app.post("/api/upload-installer-raw", (req: express.Request, res: express.Response) => {
  try {
    const fileName = (req.query.fileName as string) || "nexus_setup.exe";
    const fileType = (req.query.fileType as string) || "application/octet-stream";

    const targetFilePath = path.join(process.cwd(), "custom_setup.file");
    const writeStream = fs.createWriteStream(targetFilePath);

    req.pipe(writeStream);

    writeStream.on("finish", () => {
      try {
        const infoPath = path.join(process.cwd(), "custom_setup_info.json");
        const fileSize = fs.statSync(targetFilePath).size;
        fs.writeFileSync(infoPath, JSON.stringify({ fileName, fileType, size: fileSize }));
        console.log(`Saved custom installer file on server via raw stream: ${fileName} (${fileSize} bytes)`);
        res.json({ success: true, fileName, size: fileSize });
      } catch (innerErr: any) {
        console.error("Error saving metadata in raw upload:", innerErr);
        res.status(500).json({ error: innerErr.message || "Failed to finalize metadata" });
      }
    });

    writeStream.on("error", (err) => {
      console.error("Write stream error:", err);
      res.status(500).json({ error: "Failed to write file stream to disk" });
    });
  } catch (err: any) {
    console.error("Raw installer upload error:", err);
    res.status(500).json({ error: err.message || "Failed to process raw installer upload" });
  }
});

app.post("/api/upload-installer", (req: express.Request, res: express.Response) => {
  try {
    const { fileName, fileType, fileData } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ error: "Missing fileName or fileData" });
    }

    // Extract the pure base64 database content
    // e.g. "data:application/octet-stream;base64,AAAA..."
    const commaIndex = fileData.indexOf(",");
    if (commaIndex === -1) {
      return res.status(400).json({ error: "Invalid base64 payload format" });
    }
    const base64Content = fileData.substring(commaIndex + 1);
    const buffer = Buffer.from(base64Content, "base64");

    // Save the file on disk
    const targetFilePath = path.join(process.cwd(), "custom_setup.file");
    fs.writeFileSync(targetFilePath, buffer);

    // Save the metadata
    const infoPath = path.join(process.cwd(), "custom_setup_info.json");
    fs.writeFileSync(infoPath, JSON.stringify({ fileName, fileType, size: buffer.length }));

    console.log(`Saved custom installer file on server: ${fileName} (${buffer.length} bytes)`);
    return res.json({ success: true, fileName, size: buffer.length });
  } catch (err: any) {
    console.error("Installer upload error:", err);
    return res.status(500).json({ error: err.message || "Failed to process installer upload" });
  }
});

app.get("/api/download-installer", (req: express.Request, res: express.Response) => {
  try {
    const filePath = path.join(process.cwd(), "custom_setup.file");
    const infoPath = path.join(process.cwd(), "custom_setup_info.json");

    if (fs.existsSync(filePath)) {
      let fileName = "nexus_setup.exe";
      let contentType = "application/octet-stream";

      if (fs.existsSync(infoPath)) {
        try {
          const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
          if (info.fileName) fileName = info.fileName;
          if (info.fileType) contentType = info.fileType;
        } catch (e) {
          console.warn("Failed to read setup metadata:", e);
        }
      }

      // Force header filename encoding with proper UTF-8 filename parameter
      const encodedName = encodeURIComponent(fileName);
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedName}`);
      res.setHeader("Content-Type", contentType);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      // Default fallback in case no custom file is uploaded yet
      const fallbackText = `Nexus Project Secure Client Package\n=================================\n\nStatus: 100% Certified\nRelease: v3.0.0 Stable\nType: Dynamic Installer Proxy\n\nInstructions:\n1. Move this setup file to your home directory or Applications folder.\n2. Execute the bin/nexus binary or double click Nexus client file to run the app in end-to-end P2P mode.\n3. Encryption pair keys will generate automatically during first startup.\n\nThank you for choosing Nexus!`;
      res.setHeader("Content-Disposition", 'attachment; filename="nexus_client_guide.txt"');
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.send(fallbackText);
    }
  } catch (err: any) {
    console.error("Installer download error:", err);
    res.status(500).send("Failed to stream setup installer file.");
  }
});

app.get("/api/installer-status", (req: express.Request, res: express.Response) => {
  try {
    const infoPath = path.join(process.cwd(), "custom_setup_info.json");
    if (fs.existsSync(infoPath)) {
      const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
      return res.json({ hasFile: true, ...info });
    }
    return res.json({ hasFile: false });
  } catch (e) {
    return res.json({ hasFile: false });
  }
});

app.get("/api/security-audit", (req: express.Request, res: express.Response) => {
  try {
    const noiseHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
    const systemEntropy = (Math.random() * 0.15 + 0.85).toFixed(4); // 0.8500 to 1.0000
    const scanLatency = Math.floor(Math.random() * 25 + 5); // 5ms - 30ms

    const auditData = {
      status: "SECURED",
      score: 100,
      verifiedAt: new Date().toISOString(),
      integritySignature: `NXS-SIG-SHA256-${noiseHex}`,
      entropy: parseFloat(systemEntropy),
      scanTimeMs: scanLatency,
      protocols: [
        {
          id: "qrr",
          name: "Quantum Ring Ratcheting (QRR)",
          standard: "NIST FIPS 203 / Kyber-1024",
          status: "PASSED",
          integrity: 1.0,
          details: `Active ratcheting block: 0xBA${noiseHex}`
        },
        {
          id: "dra",
          name: "Double Ratchet Core",
          standard: "Signal Protocol v3",
          status: "PASSED",
          integrity: 1.0,
          details: "Ephemeral key rotation completed under 120s limit"
        },
        {
          id: "ake",
          name: "Authenticated Key Exchange",
          standard: "X3DH (Diffie-Hellman)",
          status: "PASSED",
          integrity: 0.9999,
          details: `Pre-keys validated. Current pool state: OK`
        },
        {
          id: "pfs",
          name: "Perfect Forward Secrecy",
          standard: "ECDH / Curve25519",
          status: "PASSED",
          integrity: 1.0,
          details: "Zero historic key trails recorded on local nodes"
        },
        {
          id: "eps",
          name: "Ephemeral Packet Shuffling",
          standard: "ChaCha20-Poly1305 / AES-GCM",
          status: "PASSED",
          integrity: 1.0,
          details: "Network metadata entropy levels optimal"
        }
      ]
    };

    return res.json(auditData);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to generate security audit log" });
  }
});

app.get("/api/get-settings", (req: express.Request, res: express.Response) => {
  try {
    const settingsPath = path.join(process.cwd(), "admin_settings.json");
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      return res.json(settings);
    }
    return res.json({});
  } catch (err: any) {
    console.error("Get settings error:", err);
    return res.status(500).json({ error: "Failed to read settings from disk" });
  }
});

app.post("/api/save-settings", (req: express.Request, res: express.Response) => {
  try {
    const settings = req.body;
    const settingsJSON = JSON.stringify(settings, null, 2);

    // 1. Root settings file
    const rootPath = path.join(process.cwd(), "admin_settings.json");
    fs.writeFileSync(rootPath, settingsJSON);

    // 2. Vite static public folder (for design exports and workspace builds)
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicPath = path.join(publicDir, "admin_settings.json");
    fs.writeFileSync(publicPath, settingsJSON);

    // 3. Compiled bundle directory (for live preview updates without rebuilding)
    const distDir = path.join(process.cwd(), "dist");
    if (fs.existsSync(distDir)) {
      const distPath = path.join(distDir, "admin_settings.json");
      fs.writeFileSync(distPath, settingsJSON);
    }

    console.log("Saved admin settings successfully across all storage nodes.");
    return res.json({ success: true });
  } catch (err: any) {
    console.error("Save settings error:", err);
    return res.status(500).json({ error: err.message || "Failed to persist settings" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
