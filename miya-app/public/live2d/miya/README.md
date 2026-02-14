# Live2D Model Directory

## How to set up your Live2D model

Place your Cubism 3/4 model files here. The expected structure is:

```
public/live2d/miya/
├── miya.model3.json          ← Main model config (already created as template)
├── miya.moc3                 ← Your model binary file
├── miya.physics3.json        ← Physics simulation config
├── miya.cdi3.json            ← Display info
├── miya.4096/
│   └── texture_00.png        ← Model textures
├── expressions/
│   ├── happy.exp3.json
│   ├── loving.exp3.json
│   ├── shy.exp3.json
│   ├── worried.exp3.json
│   ├── excited.exp3.json
│   ├── calm.exp3.json
│   ├── playful.exp3.json
│   └── pouty.exp3.json
└── motions/
    ├── idle_01.motion3.json
    ├── happy_01.motion3.json
    ├── love_01.motion3.json
    ├── shy_01.motion3.json
    ├── worried_01.motion3.json
    ├── excited_01.motion3.json
    ├── playful_01.motion3.json
    └── angry_01.motion3.json
```

## Getting a model

### Option 1: Create with Live2D Cubism Editor
- Download [Live2D Cubism Editor](https://www.live2d.com/en/cubism/download/)
- Create or import an anime character model
- Export as `.moc3` format

### Option 2: Free sample models
- [Live2D Sample Models](https://www.live2d.com/en/learn/sample/)
- Download a sample, rename the .model3.json to `miya.model3.json`
- Update file references in the JSON to match your model's file names

### Option 3: VTuber model marketplace
- [nizima](https://nizima.com/) - Official Live2D marketplace
- [BOOTH](https://booth.pm/) - Japanese creator marketplace (search "Live2D model")

## Customizing expressions

Edit `miya.model3.json` → `FileReferences.Expressions` to point to your model's expression files.

If your model uses different parameter names, update the expression map in:
`src/services/expressionManager.ts` → `DEFAULT_EXPRESSION_MAP`

Common Cubism 3/4 parameter IDs:
- `ParamEyeLOpen` / `ParamEyeROpen` – Eye openness
- `ParamEyeBallX` / `ParamEyeBallY` – Eye direction
- `ParamBrowLY` / `ParamBrowRY` – Eyebrow position
- `ParamMouthOpenY` – Mouth open amount
- `ParamMouthForm` – Smile/frown
- `ParamAngleX/Y/Z` – Head rotation
- `ParamBodyAngleX/Y/Z` – Body rotation
- `ParamCheek` – Blush
- `ParamBreath` – Breathing animation

## Fallback behavior

If no Live2D model files are found, the app automatically falls back to the built-in SVG avatar. The SVG avatar still supports all mood expressions and animations.
