/**
 * Expression Manager
 * Maps mood states to Live2D motions for the Ichika model.
 * Each mood triggers both a body motion and a face motion simultaneously.
 */

import type { MoodType, AvatarExpression } from '../types';
import type { Live2DModelConfig, Live2DExpressionMap } from '../types/live2d';

/** Map MoodType to AvatarExpression */
export const MOOD_TO_EXPRESSION: Record<MoodType, AvatarExpression> = {
  khush: 'happy',
  pyaar: 'loving',
  sharmili: 'shy',
  chintit: 'worried',
  utsahit: 'excited',
  shant: 'calm',
  chanchal: 'playful',
  ruthi: 'pouty',
};

/**
 * Expression map using actual Ichika model motion groups.
 * Each expression has a body motion group and a face motion group.
 * The motion group names correspond to groups in miya.model3.json.
 */
export const DEFAULT_EXPRESSION_MAP: Live2DExpressionMap = {
  happy: {
    motion: 'Happy',        // body: w-cute-glad, w-happy-glad
  },
  loving: {
    motion: 'Love',         // body: w-adult-blushed, w-normal-blushed
  },
  shy: {
    motion: 'Shy',          // body: w-cute-shy, w-animal-shy
  },
  worried: {
    motion: 'Worried',      // body: w-adult-trouble, w-cool-posesad
  },
  excited: {
    motion: 'Excited',      // body: w-cute-glad05/06, w-happy-piece/purpose
  },
  calm: {
    motion: 'Calm',         // body: w-normal-default, w-adult-relief
  },
  playful: {
    motion: 'Playful',      // body: w-cute-wink, w-cute-smug, w-cute-piece
  },
  pouty: {
    motion: 'Angry',        // body: w-cool-angry, w-cute-angry
  },
  idle: {
    motion: 'Idle',         // body: w-normal-default, face_normal
  },
};

/**
 * Face motion group names that correspond to each expression.
 * These are played simultaneously with body motions for full expression.
 */
export const FACE_MOTION_MAP: Record<string, string> = {
  happy: 'HappyFace',       // face_smile_*
  loving: 'LoveFace',       // face_smile_04/07, face_ncsmile
  shy: 'ShyFace',           // face_shy_*
  worried: 'WorriedFace',   // face_worry_*, face_trouble, face_sad
  excited: 'ExcitedFace',   // face_sparkling_*, face_surprise
  calm: 'CalmFace',         // face_breath, face_closeeye, face_sleepy
  playful: 'PlayfulFace',   // face_play_*, face_ncsparkling
  pouty: 'AngryFace',       // face_angry_*, face_hate
  idle: 'Idle',             // face_normal
};

/**
 * Get the default Miya/Ichika model configuration.
 */
export function getDefaultModelConfig(): Live2DModelConfig {
  return {
    modelPath: '/live2d/miya/miya.model3.json',
    scale: 0.25,
    offsetX: 0,
    offsetY: 100,
    expressions: DEFAULT_EXPRESSION_MAP,
    motionGroups: [
      'Idle', 'Happy', 'HappyFace', 'Love', 'LoveFace',
      'Shy', 'ShyFace', 'Worried', 'WorriedFace',
      'Excited', 'ExcitedFace', 'Calm', 'CalmFace',
      'Playful', 'PlayfulFace', 'Angry', 'AngryFace',
      'Nod', 'ShakeHead', 'Think', 'Greeting',
    ],
  };
}

/**
 * Get the AvatarExpression for a given mood
 */
export function getExpressionForMood(mood: MoodType): AvatarExpression {
  return MOOD_TO_EXPRESSION[mood] || 'happy';
}
