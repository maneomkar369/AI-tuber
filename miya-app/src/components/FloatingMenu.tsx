import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingMenuProps {
  onChatOpen: () => void;
  onSettingsOpen: () => void;
  onProfileOpen: () => void;
}

export default function FloatingMenu({ onChatOpen, onSettingsOpen, onProfileOpen }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: '👤', label: 'Profile', onClick: onProfileOpen, color: 'cyber' },
    { icon: '💬', label: 'Chat', onClick: onChatOpen, color: 'teal' },
    { icon: '⚙️', label: 'Settings', onClick: onSettingsOpen, color: 'cyan' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: -(70 * (index + 1)),
              transition: { 
                delay: index * 0.06,
                type: 'spring',
                stiffness: 400,
                damping: 20
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0,
              transition: { delay: (menuItems.length - 1 - index) * 0.05 }
            }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              item.onClick();
              setIsOpen(false);
            }}
            className="absolute bottom-0 right-0 w-14 h-14 rounded-full glass-strong cursor-pointer group"
            style={{
              boxShadow: '0 4px 20px rgba(0, 184, 255, 0.2)',
            }}
          >
            {/* Glow ring */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle, ${
                  item.color === 'cyber' ? 'rgba(0, 184, 255, 0.2)' :
                  item.color === 'teal' ? 'rgba(0, 255, 204, 0.2)' :
                  'rgba(77, 210, 255, 0.2)'
                }, transparent 70%)`,
                filter: 'blur(8px)',
              }}
            />
            <span className="relative text-xl">{item.icon}</span>
            
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 glass rounded-lg px-3 py-1.5 whitespace-nowrap pointer-events-none"
            >
              <span className="text-xs font-medium text-miya-text">{item.label}</span>
            </motion.div>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={toggleMenu}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 rounded-full glass-strong cursor-pointer relative overflow-hidden"
        style={{
          boxShadow: '0 4px 30px rgba(0, 184, 255, 0.3), 0 0 60px rgba(0, 255, 204, 0.1)',
        }}
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-500/20 to-teal-500/20 animate-breathe" />
        
        {/* Border glow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 184, 255, 0.3), rgba(0, 255, 204, 0.3))',
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="relative z-10 flex items-center justify-center h-full"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-cyber-300"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.div>

        {/* Pulse ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyber-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>
    </div>
  );
}
