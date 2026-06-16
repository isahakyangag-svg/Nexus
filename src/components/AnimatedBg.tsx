import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function AnimatedBg() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normal position between -0.5 and 0.5
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate some persistent ambient spots
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden bg-[#020205]">
      {/* 8K Radial Ambient Gradients */}
      <motion.div
        animate={{
          x: mousePos.x * 50,
          y: mousePos.y * 50,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 1 }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full filter blur-[120px] opacity-[0.15] bg-radial from-[#8b5cf6] to-transparent"
      />

      <motion.div
        animate={{
          x: mousePos.x * -70,
          y: mousePos.y * -70,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 1.2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full filter blur-[150px] opacity-[0.12] bg-radial from-[#6d28d9] to-transparent"
      />

      <div className="absolute top-[30%] left-[40%] w-[50vw] h-[50vw] rounded-full filter blur-[180px] opacity-[0.08] bg-radial from-[#c084fc] to-transparent animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Cybernetic Grid Overlay with subtle opacity and fade-in */}
      <div 
        className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(139,92,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.3)_1px,transparent_1px)]" 
        style={{ backgroundSize: '64px 64px' }}
      />

      {/* Radial fall-off so grid is brighter near the center and fades out */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#020205]/40 to-[#020205]" />

      {/* Animated tiny glowing particles floating around like digital ambient neon light */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const duration = Math.random() * 20 + 20;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-violet-400 opacity-20 blur-[1px]"
              style={{
                width: size,
                height: size,
                left: `${startX}%`,
                top: `${startY}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 30, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
