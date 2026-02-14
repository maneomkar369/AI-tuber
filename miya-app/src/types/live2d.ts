// ===== Live2D Types =====

export interface Live2DModelConfig {
  /** Path to the .model3.json file */
  modelPath: string;
  /** Display scale factor */
  scale: number;
  /** X position offset */
  offsetX: number;
  /** Y position offset */
  offsetY: number;
  /** Expression parameter mapping */
  expressions: Live2DExpressionMap;
  /** Motion groups available */
  motionGroups: string[];
}

export interface Live2DExpressionMap {
  happy: Live2DExpressionParams;
  loving: Live2DExpressionParams;
  shy: Live2DExpressionParams;
  worried: Live2DExpressionParams;
  excited: Live2DExpressionParams;
  calm: Live2DExpressionParams;
  playful: Live2DExpressionParams;
  pouty: Live2DExpressionParams;
  idle: Live2DExpressionParams;
}

export interface Live2DExpressionParams {
  /** Expression file name (e.g., "happy.exp3.json") or null for parameter-based */
  expressionFile?: string;
  /** Direct parameter overrides */
  params?: Record<string, number>;
  /** Motion to play with this expression */
  motion?: string;
}

export interface Live2DModelState {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  currentExpression: string;
  isSpeaking: boolean;
  isLipSyncing: boolean;
}

export interface Live2DCanvasOptions {
  width: number;
  height: number;
  transparent: boolean;
  autoResize: boolean;
}

/** Lip sync audio data */
export interface LipSyncData {
  volume: number;     // 0-1
  frequency: number;  // dominant frequency
}
