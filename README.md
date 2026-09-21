# ⚡ Co-Agent

> **A local-first AI desktop agent that can see your screen, reason about what to do, and operate your computer.**

Co-Agent combines a local reasoning model with a dedicated **UI-TARS computer-use specialist** to turn natural-language requests into real desktop actions — while keeping the core AI workflow local.

<p align="center">
  <b>🧠 Local Brain</b> · <b>👁️ Screen Understanding</b> · <b>🖱️ Computer Use</b> · <b>🖥️ Multi-Monitor</b> · <b>💬 Chat-First UI</b>
</p>

---

## ✨ What it does

Co-Agent is designed around a simple idea:

**You describe the task → the local brain plans → UI-TARS operates the GUI → Co-Agent verifies and continues.**

### 🧠 Local AI orchestration
- **Gemma 4 E2B Q4_K_M** configured as the primary local reasoning/planning model.
- **UI-TARS 2B Q4_K_M** configured as the dedicated GUI/computer-use specialist.
- Optional **Qwen3 4B Q4_K_M** fallback profile.
- Ollama-based local model management.
- One-heavy-model-at-a-time orchestration to reduce RAM pressure.

### 👁️ Computer use
UI-TARS can work from screenshots and produce GUI actions such as:

- Click
- Double-click
- Right-click
- Drag
- Type
- Hotkeys
- Scroll
- Wait
- Finished

Native desktop execution handles the resulting actions.

### 🖥️ Multi-monitor support
- Select the monitor you want the agent to work with.
- Preview the selected screen.
- Translate UI-TARS coordinates into the Windows virtual desktop correctly.
- Designed for multi-display desktop workflows rather than assuming a single screen.

### 💬 Chat-first overlay
The desktop interface is intentionally focused on the conversation and the screen:

- Simple floating assistant
- Live selected-screen preview
- Minimal controls
- No unnecessary RAM dashboards or task-flow clutter
- Natural-language task entry

### 🧰 Local tools
The project also includes local tooling for workflows that need more than GUI interaction, including media processing/runtime support through bundled or provisioned FFmpeg/FFprobe and browser automation infrastructure.

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      User Chat       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Co-Agent Brain     │
                         │ Gemma 4 E2B Q4_K_M   │
                         └──────────┬───────────┘
                                    │
                         Plan / decide / delegate
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      UI-TARS         │
                         │    GUI specialist    │
                         └──────────┬───────────┘
                                    │
                           screenshot → action
                                    │
                                    ▼
              ┌────────────────────────────────────────┐
              │       Native Windows Action Layer      │
              │ click · type · drag · hotkey · scroll │
              └───────────────────┬────────────────────┘
                                  │
                                  ▼
                         ┌──────────────────────┐
                         │   User's Desktop     │
                         │   + multiple screens │
                         └──────────────────────┘
```

### Resource strategy

Co-Agent is configured so the reasoning model and GUI specialist do not need to remain loaded as two large models simultaneously. UI-TARS can be invoked with a short `keep_alive` window so it can be unloaded after GUI work.

> **Important:** The configured model names are profiles/configuration. Model weights are not bundled in this repository.

---

## 🚀 Quick start

### Requirements

- Windows desktop
- Node.js + npm
- Ollama
- Sufficient RAM/storage for the selected local models
- Git, if cloning the repository

### Install

```bash
git clone https://github.com/null-nalla/Co-Agent.git
cd Co-Agent
npm install
```

### Build / verify

```bash
npm run build
```

### Create the Windows installer

```bash
npm run dist:win
```

The Windows installer is produced in the `release/` directory.

---

## 🤖 Models

The current project profiles include:

| Model | Role | Approx. RAM profile |
|---|---|---:|
| `gemma4:e2b-it-q4_K_M` | Primary reasoning / planning / coding / multimodal | ~2.85 GB |
| `ui-tars-2b-q4_K_M` | GUI / computer-use specialist | ~2.2 GB |
| `qwen3:4b-q4_K_M` | Optional text/coding fallback | ~2.3 GB |

These are configuration profiles; exact runtime memory depends on Ollama, context length, OS state, and hardware.

### First-run setup

Co-Agent includes a local setup/installer flow intended to detect missing components and install only what is required.

If a model is already installed, the runtime is designed to avoid unnecessarily reinstalling it.

---

## 🧩 Browser & media tooling

Co-Agent includes infrastructure for:

- Playwright/Chromium lazy installation
- FFmpeg / FFprobe provisioning
- Local media-processing workflows
- Runtime dependency checks

The build pipeline provisions/verifies the required FFmpeg runtime before packaging.

---

## 📁 Project layout

```text
Co-Agent/
├── assets/                 # Application assets and runtime resources
├── dist/
│   ├── main/               # Electron main-process application code
│   ├── renderer/           # Renderer/UI code
│   └── shared/             # Shared application modules
├── licenses/               # Third-party license notices
├── scripts/                # Build and verification scripts
├── vendor/                 # Project vendor/runtime support files
├── electron-builder.yml    # Windows packaging configuration
├── package.json            # Node/Electron scripts and dependencies
└── README.md
```

---

## 🛠️ Useful commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run build` | Provision/check build runtime and verify project |
| `npm run dist:win` | Build the Windows NSIS installer |

There is intentionally no `npm run package` command in the current project; use `npm run dist:win` for the Windows installer.

---

## 🔧 Troubleshooting

### Ollama / model issues

Check that Ollama is installed and available to the application. Then verify that the configured model is actually available in your Ollama environment.

The UI-TARS profile may require importing the appropriate UI-TARS GGUF/model definition into Ollama rather than assuming a public tag exists with the exact configured name.

### Build issues

Try a clean dependency installation:

```bash
rm -rf node_modules
npm install
npm run build
npm run dist:win
```

On Windows Command Prompt, use:

```bat
rmdir /s /q node_modules
npm install
npm run build
npm run dist:win
```

### Windows packaging

The Electron Builder configuration intentionally quotes the FFmpeg exclusion pattern:

```yaml
"!assets/runtime/ffmpeg/**"
```

This avoids YAML parsing problems with the `!` character.

---

## 🔐 Privacy & security

Co-Agent is designed around a **local-first** workflow.

That means the core AI/model workflow can run through your local Ollama installation rather than requiring a hosted AI API.

However, the application can still interact with external services when you explicitly use features that require them — for example, downloading dependencies or using web/browser functionality.

**Do not treat local execution as a guarantee that every network connection is disabled.** Review the application's tools, dependencies, and network permissions before using it with sensitive information.

---

## 🗺️ Direction

The project is being developed toward a practical local desktop co-agent with:

- Faster local inference
- More reliable GUI grounding
- Better multi-monitor workflows
- Stronger task verification
- Lower RAM overhead
- A cleaner chat-first experience
- More useful local tools

---

## 🤝 Contributing

Issues, improvements, bug reports, and focused pull requests are welcome.

When reporting a problem, include:

1. Windows version
2. Node.js version
3. Ollama version
4. Model/profile being used
5. Relevant logs or error messages
6. Steps to reproduce

---

## 📜 License

See the repository's `licenses/` directory and the project's package/dependency metadata for applicable license information.

---

<p align="center">
  <b>⚡ Co-Agent — local AI, real desktop control.</b>
</p>
