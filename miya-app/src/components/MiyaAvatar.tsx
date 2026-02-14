import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { MoodType } from '../types';
import { MOOD_CONFIGS } from '../utils/moodConfig';

interface MiyaAvatarProps {
  mood: MoodType;
  isTyping: boolean;
  size?: number;
}

export default function MiyaAvatar({ mood, isTyping, size = 280 }: MiyaAvatarProps) {
  const config = MOOD_CONFIGS[mood];
  const expr = useMemo(() => getExpression(mood), [mood]);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size * 1.4 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Ambient glow behind character */}
      <motion.div
        className="absolute"
        style={{
          width: size * 1.1,
          height: size * 1.3,
          top: '5%',
          background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${config.color}15, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg
        viewBox="0 0 500 700"
        width={size}
        height={size * 1.4}
        className="relative z-10"
        style={{ filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }}
      >
        <defs>
          {/* Hair gradients */}
          <linearGradient id="hairMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB8D9" />
            <stop offset="35%" stopColor="#FF8EC4" />
            <stop offset="70%" stopColor="#FF6AB0" />
            <stop offset="100%" stopColor="#E8559E" />
          </linearGradient>
          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD6EB" />
            <stop offset="100%" stopColor="#FFB0D4" />
          </linearGradient>
          <linearGradient id="hairShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8559E" />
            <stop offset="100%" stopColor="#CC3D85" />
          </linearGradient>
          <linearGradient id="hairShine" x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#FFF0F7" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#FFD6EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFB8D9" stopOpacity="0" />
          </linearGradient>

          {/* Skin */}
          <linearGradient id="skinBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFEBD6" />
            <stop offset="50%" stopColor="#FFE0C8" />
            <stop offset="100%" stopColor="#FFD4B8" />
          </linearGradient>
          <linearGradient id="skinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD4B8" />
            <stop offset="100%" stopColor="#F0C0A0" />
          </linearGradient>

          {/* Eyes */}
          <linearGradient id="eyeWhite" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F0EEF5" />
          </linearGradient>
          <radialGradient id="irisGrad" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#D8A0FF" />
            <stop offset="30%" stopColor="#B060E8" />
            <stop offset="60%" stopColor="#8B40D0" />
            <stop offset="100%" stopColor="#5A1E99" />
          </radialGradient>
          <radialGradient id="irisInner" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#C880F0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6A28A8" stopOpacity="0" />
          </radialGradient>

          {/* Blush */}
          <radialGradient id="blushL" cx="50%" cy="55%">
            <stop offset="0%" stopColor="#FF8FAA" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#FF8FAA" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF8FAA" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blushR" cx="50%" cy="55%">
            <stop offset="0%" stopColor="#FF8FAA" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#FF8FAA" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF8FAA" stopOpacity="0" />
          </radialGradient>

          {/* Clothing */}
          <linearGradient id="clothMain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E53935" />
            <stop offset="50%" stopColor="#D32F2F" />
            <stop offset="100%" stopColor="#B71C1C" />
          </linearGradient>
          <linearGradient id="clothHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6659" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E53935" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="clothShadowGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B71C1C" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D32F2F" stopOpacity="0" />
          </linearGradient>

          {/* Mood glow */}
          <radialGradient id="moodAura">
            <stop offset="0%" stopColor={config.color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={config.color} stopOpacity="0" />
          </radialGradient>

          {/* Lip */}
          <linearGradient id="lipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8808A" />
            <stop offset="100%" stopColor="#D06070" />
          </linearGradient>
        </defs>

        {/* === Mood aura === */}
        <ellipse cx="250" cy="350" rx="220" ry="280" fill="url(#moodAura)" opacity="0.5">
          <animate attributeName="rx" values="210;230;210" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* ========= BACK HAIR ========= */}
        <g className="animate-hair-sway" style={{ transformOrigin: '250px 180px' }}>
          <path
            d="M100,210 Q80,300 85,450 Q90,530 120,570 Q140,590 150,575 Q130,520 125,420 Q120,320 140,240
               L250,195
               L360,240 Q380,320 375,420 Q370,520 350,575 Q360,590 380,570 Q410,530 415,450 Q420,300 400,210
               Q380,160 250,125 Q120,160 100,210Z"
            fill="url(#hairMain)"
          />
          <path
            d="M110,250 Q95,340 100,460 Q105,520 125,555 Q120,480 115,400 Q112,320 125,260Z"
            fill="url(#hairShadow)" opacity="0.5"
          />
          <path
            d="M390,250 Q405,340 400,460 Q395,520 375,555 Q380,480 385,400 Q388,320 375,260Z"
            fill="url(#hairShadow)" opacity="0.5"
          />
          <path d="M100,400 Q90,450 95,530 Q100,545 108,540 Q105,470 108,410Z" fill="#E8559E" opacity="0.4" />
          <path d="M400,400 Q410,450 405,530 Q400,545 392,540 Q395,470 392,410Z" fill="#E8559E" opacity="0.4" />
        </g>

        {/* ========= BODY / SHOULDERS ========= */}
        <g>
          {/* Neck */}
          <path
            d="M225,400 Q225,420 222,450 Q228,460 250,462 Q272,460 278,450 Q275,420 275,400Z"
            fill="url(#skinBase)"
          />
          <path
            d="M230,430 Q240,438 250,440 Q260,438 270,430 Q265,445 250,448 Q235,445 230,430Z"
            fill="url(#skinShadow)" opacity="0.5"
          />

          {/* Shoulders and upper body */}
          <path
            d="M120,530 Q130,480 170,462 Q200,450 250,448 Q300,450 330,462 Q370,480 380,530
               L395,600 Q390,640 370,660 L130,660 Q110,640 105,600Z"
            fill="url(#clothMain)"
          />
          <path
            d="M140,490 Q165,470 200,460 Q220,455 250,452 Q230,462 200,472 Q170,485 150,505Z"
            fill="url(#clothHighlight)"
          />
          <path
            d="M360,490 Q335,470 300,460 Q280,455 250,452 Q270,462 300,472 Q330,485 350,505Z"
            fill="url(#clothShadowGrad)"
          />
          {/* Collar / neckline */}
          <path
            d="M205,460 Q215,450 230,448 Q250,445 270,448 Q285,450 295,460
               Q280,470 270,475 Q260,478 250,480 Q240,478 230,475 Q220,470 205,460Z"
            fill="url(#clothMain)" stroke="#C62828" strokeWidth="1"
          />
          <path
            d="M215,458 Q230,450 250,448 Q270,450 285,458
               Q275,465 265,470 Q255,473 250,474 Q245,473 235,470 Q225,465 215,458Z"
            fill="url(#skinShadow)" opacity="0.4"
          />
          {/* Cloth folds */}
          <path d="M180,500 Q185,530 190,570" fill="none" stroke="#B71C1C" strokeWidth="1.5" opacity="0.3" />
          <path d="M320,500 Q315,530 310,570" fill="none" stroke="#B71C1C" strokeWidth="1.5" opacity="0.3" />
          <path d="M250,480 Q248,520 250,570" fill="none" stroke="#B71C1C" strokeWidth="1" opacity="0.2" />
          {/* Star emblem on shirt */}
          <g transform="translate(250, 520)">
            <polygon points="0,-12 3,-4 12,-4 5,2 7,10 0,5 -7,10 -5,2 -12,-4 -3,-4" fill="#FF8A80" opacity="0.5" />
          </g>
        </g>

        {/* ========= FACE ========= */}
        <path
          d="M160,210 Q160,155 200,140 Q230,130 250,128 Q270,130 300,140 Q340,155 340,210
             L340,300 Q340,355 310,385 Q285,405 270,412 Q258,418 250,420 Q242,418 230,412
             Q215,405 190,385 Q160,355 160,300Z"
          fill="url(#skinBase)"
        />
        {/* Jaw shadow */}
        <path
          d="M168,310 Q168,355 195,382 Q215,398 235,410 Q245,415 250,416
             Q255,415 265,410 Q285,398 305,382 Q332,355 332,310
             Q330,345 310,370 Q290,390 265,405 Q255,410 250,412
             Q245,410 235,405 Q210,390 190,370 Q170,345 168,310Z"
          fill="url(#skinShadow)" opacity="0.35"
        />
        {/* Cheek highlights */}
        <ellipse cx="185" cy="280" rx="22" ry="15" fill="white" opacity="0.08" />
        <ellipse cx="315" cy="280" rx="22" ry="15" fill="white" opacity="0.08" />

        {/* ======== EYES ======== */}
        <g>
          {/* Left eye */}
          <g transform={`translate(195, ${280 + expr.eyeYOffset})`}>
            <ellipse cx="0" cy="-3" rx="30" ry="22" fill="#F0D0C0" opacity="0.2" />
            <ellipse cx="0" cy="0" rx="26" ry={expr.eyeH} fill="url(#eyeWhite)" />
            {expr.eyeH > 6 && (
              <>
                <ellipse cx={expr.eyeOffsetX} cy={2 + expr.irisYOffset} rx="17" ry={Math.min(17, expr.eyeH - 2)} fill="url(#irisGrad)" />
                <ellipse cx={expr.eyeOffsetX} cy={2 + expr.irisYOffset} rx="12" ry={Math.min(12, expr.eyeH - 4)} fill="url(#irisInner)" />
                <ellipse cx={expr.eyeOffsetX} cy={3 + expr.irisYOffset} rx="7" ry={Math.min(7, expr.eyeH - 6)} fill="#1A0530" />
                <ellipse cx={expr.eyeOffsetX - 7} cy={-5 + expr.irisYOffset} rx="5.5" ry="4.5" fill="white" opacity="0.95" />
                <circle cx={expr.eyeOffsetX + 5} cy={6 + expr.irisYOffset} r="3" fill="white" opacity="0.6" />
                <circle cx={expr.eyeOffsetX - 3} cy={8 + expr.irisYOffset} r="1.5" fill="white" opacity="0.4" />
              </>
            )}
            {/* Eyelid & lashes */}
            <path d={`M-27,${-expr.eyeH + 1} Q-15,${-expr.eyeH - 7} 0,${-expr.eyeH - 5} Q15,${-expr.eyeH - 7} 27,${-expr.eyeH + 1}`} fill="none" stroke="#3D1A5E" strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M-26,${-expr.eyeH + 1} Q-30,${-expr.eyeH - 8} -28,${-expr.eyeH - 14}`} fill="none" stroke="#3D1A5E" strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M-20,${-expr.eyeH - 2} Q-24,${-expr.eyeH - 10} -20,${-expr.eyeH - 16}`} fill="none" stroke="#3D1A5E" strokeWidth="2" strokeLinecap="round" />
            <path d={`M-12,${-expr.eyeH - 4} Q-14,${-expr.eyeH - 12} -10,${-expr.eyeH - 17}`} fill="none" stroke="#3D1A5E" strokeWidth="1.8" strokeLinecap="round" />
            <path d={`M-20,${expr.eyeH - 2} Q0,${expr.eyeH + 1} 20,${expr.eyeH - 2}`} fill="none" stroke="#B090C0" strokeWidth="1" opacity="0.4" />
          </g>

          {/* Right eye */}
          <g transform={`translate(305, ${280 + expr.eyeYOffset})`}>
            <ellipse cx="0" cy="-3" rx="30" ry="22" fill="#F0D0C0" opacity="0.2" />
            <ellipse cx="0" cy="0" rx="26" ry={expr.eyeH} fill="url(#eyeWhite)" />
            {expr.eyeH > 6 && (
              <>
                <ellipse cx={expr.eyeOffsetX} cy={2 + expr.irisYOffset} rx="17" ry={Math.min(17, expr.eyeH - 2)} fill="url(#irisGrad)" />
                <ellipse cx={expr.eyeOffsetX} cy={2 + expr.irisYOffset} rx="12" ry={Math.min(12, expr.eyeH - 4)} fill="url(#irisInner)" />
                <ellipse cx={expr.eyeOffsetX} cy={3 + expr.irisYOffset} rx="7" ry={Math.min(7, expr.eyeH - 6)} fill="#1A0530" />
                <ellipse cx={expr.eyeOffsetX - 7} cy={-5 + expr.irisYOffset} rx="5.5" ry="4.5" fill="white" opacity="0.95" />
                <circle cx={expr.eyeOffsetX + 5} cy={6 + expr.irisYOffset} r="3" fill="white" opacity="0.6" />
                <circle cx={expr.eyeOffsetX - 3} cy={8 + expr.irisYOffset} r="1.5" fill="white" opacity="0.4" />
              </>
            )}
            <path d={`M-27,${-expr.eyeH + 1} Q-15,${-expr.eyeH - 7} 0,${-expr.eyeH - 5} Q15,${-expr.eyeH - 7} 27,${-expr.eyeH + 1}`} fill="none" stroke="#3D1A5E" strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M26,${-expr.eyeH + 1} Q30,${-expr.eyeH - 8} 28,${-expr.eyeH - 14}`} fill="none" stroke="#3D1A5E" strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M20,${-expr.eyeH - 2} Q24,${-expr.eyeH - 10} 20,${-expr.eyeH - 16}`} fill="none" stroke="#3D1A5E" strokeWidth="2" strokeLinecap="round" />
            <path d={`M12,${-expr.eyeH - 4} Q14,${-expr.eyeH - 12} 10,${-expr.eyeH - 17}`} fill="none" stroke="#3D1A5E" strokeWidth="1.8" strokeLinecap="round" />
            <path d={`M-20,${expr.eyeH - 2} Q0,${expr.eyeH + 1} 20,${expr.eyeH - 2}`} fill="none" stroke="#B090C0" strokeWidth="1" opacity="0.4" />
          </g>

          {/* Special eye effects */}
          {expr.heartEyes && (
            <>
              <text x="195" y="290" fontSize="24" textAnchor="middle" opacity="0.85">💖</text>
              <text x="305" y="290" fontSize="24" textAnchor="middle" opacity="0.85">💖</text>
            </>
          )}
          {expr.sparkleEyes && (
            <>
              <text x="220" y="268" fontSize="14" textAnchor="middle" opacity="0.8">✨</text>
              <text x="330" y="268" fontSize="14" textAnchor="middle" opacity="0.8">✨</text>
            </>
          )}
        </g>

        {/* ======== EYEBROWS ======== */}
        <path d={expr.leftBrow} fill="none" stroke="#5A2D82" strokeWidth="3" strokeLinecap="round" />
        <path d={expr.rightBrow} fill="none" stroke="#5A2D82" strokeWidth="3" strokeLinecap="round" />

        {/* ======== BLUSH ======== */}
        {expr.showBlush && (
          <>
            <ellipse cx="175" cy="315" rx="28" ry="14" fill="url(#blushL)">
              <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="325" cy="315" rx="28" ry="14" fill="url(#blushR)">
              <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.5s" repeatCount="indefinite" />
            </ellipse>
            <g opacity="0.25">
              <line x1="160" y1="312" x2="168" y2="312" stroke="#FF6B8A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="163" y1="316" x2="170" y2="316" stroke="#FF6B8A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="330" y1="312" x2="338" y2="312" stroke="#FF6B8A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="327" y1="316" x2="335" y2="316" stroke="#FF6B8A" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </>
        )}

        {/* ======== NOSE ======== */}
        <path d="M248,335 L246,348 Q250,351 254,348" fill="none" stroke="#E8A888" strokeWidth="1.8" strokeLinecap="round" />

        {/* ======== MOUTH ======== */}
        <g>
          <path d={expr.mouth} fill={expr.mouthFill} stroke="#D06070" strokeWidth="2" strokeLinecap="round" />
          {expr.mouthFill !== 'none' && (
            <ellipse cx="250" cy={expr.mouthY - 2} rx="6" ry="2" fill="white" opacity="0.25" />
          )}
          {isTyping && (
            <ellipse cx="250" cy={expr.mouthY + 2} rx="10" ry="6" fill="url(#lipGrad)" opacity="0.6">
              <animate attributeName="ry" values="6;10;6" dur="0.6s" repeatCount="indefinite" />
            </ellipse>
          )}
        </g>

        {/* ========= FRONT HAIR ========= */}
        <g className="animate-hair-sway" style={{ transformOrigin: '250px 180px' }}>
          {/* Top volume */}
          <path
            d="M110,215 Q105,170 135,135 Q165,108 200,98 Q235,90 250,88 Q265,90 300,98
               Q335,108 365,135 Q395,170 390,215
               Q375,165 330,140 Q290,120 250,115 Q210,120 170,140 Q125,165 110,215Z"
            fill="url(#hairMain)"
          />
          <path
            d="M180,110 Q210,95 250,92 Q290,95 310,105 Q285,100 250,97 Q215,100 190,108Z"
            fill="url(#hairShine)"
          />

          {/* Center bangs */}
          <path d="M195,140 Q210,125 230,122 Q240,130 245,165 Q240,200 238,230 Q230,210 225,180 Q220,155 195,140Z" fill="url(#hairMain)" />
          <path d="M230,122 Q245,118 255,118 Q265,122 270,140 Q265,170 260,210 Q255,230 252,240 Q250,220 248,190 Q245,155 230,122Z" fill="url(#hairMain)" />
          <path d="M255,118 Q275,120 290,130 Q305,142 305,165 Q300,200 292,220 Q290,195 285,170 Q278,148 255,118Z" fill="url(#hairMain)" />

          {/* Left framing bangs */}
          <path
            d="M115,210 Q120,165 150,138 Q170,125 190,122
               Q175,145 168,170 Q162,200 158,245 Q155,265 150,280
               Q145,265 142,240 Q135,210 115,210Z"
            fill="url(#hairMain)"
          />
          {/* Right framing bangs */}
          <path
            d="M385,210 Q380,165 350,138 Q330,125 310,122
               Q325,145 332,170 Q338,200 342,245 Q345,265 350,280
               Q355,265 358,240 Q365,210 385,210Z"
            fill="url(#hairMain)"
          />

          {/* Hair shine streaks */}
          <path d="M220,130 Q230,125 240,130" fill="none" stroke="#FFE8F3" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          <path d="M265,125 Q278,128 288,135" fill="none" stroke="#FFE8F3" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
          <path d="M150,160 Q158,150 170,145" fill="none" stroke="#FFE8F3" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />

          {/* Left side hair */}
          <path
            d="M112,220 Q105,260 100,320 Q95,380 95,420 Q92,460 100,480
               Q108,465 110,430 Q112,380 118,310 Q122,260 120,220Z"
            fill="url(#hairMain)"
          />
          <path
            d="M120,230 Q115,270 110,340 Q108,400 112,450
               Q118,440 120,390 Q122,330 128,270 Q130,240 125,230Z"
            fill="url(#hairHighlight)" opacity="0.4"
          />

          {/* Right side hair */}
          <path
            d="M388,220 Q395,260 400,320 Q405,380 405,420 Q408,460 400,480
               Q392,465 390,430 Q388,380 382,310 Q378,260 380,220Z"
            fill="url(#hairMain)"
          />
          <path
            d="M380,230 Q385,270 390,340 Q392,400 388,450
               Q382,440 380,390 Q378,330 372,270 Q370,240 375,230Z"
            fill="url(#hairHighlight)" opacity="0.4"
          />
        </g>

        {/* ========= HAIR ACCESSORIES ========= */}
        {/* Crystal clip */}
        <g transform="translate(250, 155) rotate(-5)">
          <polygon points="0,-14 8,0 0,14 -8,0" fill="#B8E8FF" opacity="0.8" />
          <polygon points="0,-14 8,0 0,14 -8,0" fill="none" stroke="#80D0F0" strokeWidth="1.5" />
          <polygon points="0,-8 4,0 0,8 -4,0" fill="white" opacity="0.5" />
          <circle cx="0" cy="-14" r="2" fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Flower hairpin */}
        <g transform="translate(340, 170) rotate(20)">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx={Math.cos((angle * Math.PI) / 180) * 10}
              cy={Math.sin((angle * Math.PI) / 180) * 10}
              rx="7" ry="5"
              fill="#FFD0E0" opacity="0.85"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="5" fill="#FFD700" />
          <circle cx="-2" cy="-2" r="2" fill="#FFE44D" opacity="0.7" />
        </g>

        {/* ========= MOOD DECORATIONS ========= */}
        {mood === 'pyaar' && (
          <g opacity="0.7">
            <text x="100" y="200" fontSize="20">💕</text>
            <text x="380" y="220" fontSize="18">💗</text>
            <text x="420" y="170" fontSize="14">💖</text>
          </g>
        )}
        {mood === 'utsahit' && (
          <g opacity="0.7">
            <text x="95" y="200" fontSize="18">✨</text>
            <text x="390" y="185" fontSize="20">⭐</text>
            <text x="115" y="160" fontSize="14">🌟</text>
          </g>
        )}
        {mood === 'ruthi' && (
          <g>
            <text x="200" y="235" fontSize="18" opacity="0.7">💢</text>
            <text x="290" y="220" fontSize="12" opacity="0.5">💢</text>
          </g>
        )}
        {mood === 'chanchal' && (
          <text x="350" y="240" fontSize="20" opacity="0.6">😜</text>
        )}
        {mood === 'khush' && (
          <g opacity="0.6">
            <text x="100" y="190" fontSize="14">🌸</text>
            <text x="380" y="200" fontSize="16">🌸</text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}

/* ============ Expression System ============ */
interface ExpressionParts {
  eyeH: number;
  eyeOffsetX: number;
  eyeYOffset: number;
  irisYOffset: number;
  leftBrow: string;
  rightBrow: string;
  mouth: string;
  mouthFill: string;
  mouthY: number;
  showBlush: boolean;
  heartEyes: boolean;
  sparkleEyes: boolean;
}

function getExpression(mood: MoodType): ExpressionParts {
  const base: ExpressionParts = {
    eyeH: 20,
    eyeOffsetX: 0,
    eyeYOffset: 0,
    irisYOffset: 0,
    leftBrow: 'M165,248 Q180,240 210,244',
    rightBrow: 'M290,244 Q320,240 335,248',
    mouth: 'M232,370 Q242,380 250,382 Q258,380 268,370',
    mouthFill: 'none',
    mouthY: 375,
    showBlush: false,
    heartEyes: false,
    sparkleEyes: false,
  };

  switch (mood) {
    case 'khush':
      return {
        ...base,
        eyeH: 18,
        leftBrow: 'M165,245 Q178,237 210,240',
        rightBrow: 'M290,240 Q322,237 335,245',
        mouth: 'M225,368 Q235,382 250,386 Q265,382 275,368 Q265,378 250,380 Q235,378 225,368Z',
        mouthFill: '#F5A0A0',
        mouthY: 374,
        showBlush: true,
      };
    case 'pyaar':
      return {
        ...base,
        eyeH: 19,
        irisYOffset: -1,
        mouth: 'M230,370 Q240,382 250,385 Q260,382 270,370',
        mouthY: 376,
        showBlush: true,
        heartEyes: true,
      };
    case 'sharmili':
      return {
        ...base,
        eyeH: 14,
        eyeOffsetX: -4,
        eyeYOffset: 2,
        leftBrow: 'M168,248 Q180,252 210,254',
        rightBrow: 'M290,254 Q320,252 332,248',
        mouth: 'M238,372 Q250,378 262,372',
        mouthY: 375,
        showBlush: true,
      };
    case 'chintit':
      return {
        ...base,
        eyeH: 22,
        irisYOffset: 2,
        leftBrow: 'M168,242 Q180,250 210,254',
        rightBrow: 'M290,254 Q320,250 332,242',
        mouth: 'M232,380 Q250,372 268,380',
        mouthY: 376,
      };
    case 'utsahit':
      return {
        ...base,
        eyeH: 24,
        irisYOffset: -2,
        leftBrow: 'M162,242 Q178,232 212,238',
        rightBrow: 'M288,238 Q322,232 338,242',
        mouth: 'M220,366 Q235,388 250,392 Q265,388 280,366 Q268,382 250,386 Q232,382 220,366Z',
        mouthFill: '#F5A0A0',
        mouthY: 376,
        showBlush: true,
        sparkleEyes: true,
      };
    case 'shant':
      return {
        ...base,
        eyeH: 14,
        irisYOffset: 1,
        leftBrow: 'M168,248 Q180,244 210,247',
        rightBrow: 'M290,247 Q320,244 332,248',
        mouth: 'M235,374 Q250,380 265,374',
        mouthY: 377,
      };
    case 'chanchal':
      return {
        ...base,
        eyeH: 19,
        eyeOffsetX: 3,
        leftBrow: 'M165,246 Q178,240 210,244',
        rightBrow: 'M290,238 Q322,234 335,244',
        mouth: 'M228,368 Q242,384 250,382 Q262,380 272,366',
        mouthY: 374,
        showBlush: true,
      };
    case 'ruthi':
      return {
        ...base,
        eyeH: 15,
        eyeYOffset: 1,
        leftBrow: 'M170,256 Q182,245 210,242',
        rightBrow: 'M290,242 Q318,245 330,256',
        mouth: 'M232,382 Q250,374 268,382',
        mouthY: 378,
        showBlush: true,
      };
    default:
      return base;
  }
}
