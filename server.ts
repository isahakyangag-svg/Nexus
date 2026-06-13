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
