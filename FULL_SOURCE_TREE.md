# Complete Co-Agent source snapshot

Latest source: Co-Agent 8.8.0 Polished UI/UX.

The complete local source tree contains 1,270 reproducible source/config/documentation files.

Intentionally excluded from a normal source repository:
- node_modules/ (installed dependencies)
- release/ (generated installers/build output)
- .git/ metadata
- assets/runtime/ffmpeg/ downloaded Windows binaries

Build:
```
npm install
npm run build
npm run dist:win
```

The latest full source archive is the ChatGPT artifact `Co-Agent-8.8.0-Polished-UI-UX.zip`.

Core source areas:
- dist/main/
- dist/renderer/
- scripts/
- assets/
- vendor/
- licenses/
- benchmarks/
- package.json
- package-lock.json
- electron-builder.yml
- project documentation and patch notes
