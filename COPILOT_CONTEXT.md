# Co-Agent — Copilot Context

This is a local-first Electron desktop AI agent. The latest build integrates:

- Electron 42.11.3 / electron-builder 26.15.3
- Local Ollama model orchestration
- Gemma 4 E2B Q4_K_M as the brain/planner
- UI-TARS 2B Q4_K_M as a dedicated computer-use specialist
- UI-TARS actions: click, double-click, right-click, drag, hotkey, type, scroll, wait, finished
- One-heavy-model-at-a-time behavior; UI-TARS defaults to keep_alive 0s
- Multi-monitor desktop capture and selected-display targeting
- Simple floating chat overlay with live screen preview
- First-run local model/tool installer that skips already-installed components
- Playwright Chromium lazy installation with installChromium exported from runtime dependencies
- Bundled LGPL FFmpeg/FFprobe with release verification
- Media editing/runtime support

Important build commands:
```
npm install
npm run build
npm run dist:win
```

Windows installer output:
`release/Co-Agent-8.7.0-win-x64.exe`

Important packaging fix:
Electron Builder requires the FFmpeg exclusion to be quoted:
`"!assets/runtime/ffmpeg/**"`

Architecture:
Brain model plans and selects tools. UI-TARS is invoked only for GUI perception/action loops. Native screenshot capture and nut.js execute actions. The selected monitor's local screenshot coordinates are translated to Windows virtual-desktop coordinates.

Model setup:
Weights are not bundled. The model installer checks local Ollama state and skips existing models. UI-TARS can be configured with CO_AGENT_UI_TARS_MODEL.

UI direction:
Keep the application calm and chat-first. Avoid persistent RAM dashboards, agent-team cards, decorative task-flow widgets, and cluttered overlay controls. The overlay should primarily show a live screen preview, selected screen, conversation, task input, and stop/close controls.

Testing:
The project previously passed its structural verification (JS files/tool specs/registry cases) and Windows electron-builder packaging successfully after the YAML fix.
