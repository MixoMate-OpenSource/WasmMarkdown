# ⚡ WasmMarkdown

> **Ultra-Fast, Offline-First Browser Markdown Editor Powered by Local Rust & WebAssembly.**

WasmMarkdown is a high-performance documentation workspace built to eliminate the typing lag, UI stutters, and main-thread freezes common to traditional JavaScript-based editors when editing large documents. By offloading Markdown parsing to a compiled WebAssembly binary written in Rust, it delivers instant, frame-accurate rendering directly in the browser sandbox.

---

## 🌟 Key Capabilities

*   🦀 **Native Rust Performance**: Leverages `pulldown-cmark` running inside a WebAssembly module to parse markdown at near-native speeds.
*   🚀 **Zero Main-Thread Lag**: Moves CPU-heavy parsing and HTML generation away from JavaScript execution threads, keeping the browser UI fluid and responsive at 60 FPS.
*   🔒 **100% Client-Side Privacy**: All parsing is executed locally. Your text never leaves your browser tab—completely offline, secure, and private.
*   📊 **Real-Time Parser Metrics**: Watch the Wasm engine compile documents in real time, with live performance speed metrics tracking parse times in fractions of a millisecond.
*   📦 **Dynamic Hydration**: Next.js 15 app architecture using client-only dynamic loading to fetch and initialize WebAssembly modules after the initial page layout loads.

---

## 🧠 System Architecture

The workspace splits rendering presentation and high-speed compilation:

```mermaid
graph LR
    A[User Inputs Markdown] -->|State Sync| B[Next.js Client Page]
    B -->|Text String| C[React useWasmLoader Hook]
    C -->|Progressive Load| D[Rust WASM Engine]
    D -->|Streaming Parse cmark| D
    D -->|HTML Output Buffer| C
    C -->|dangerouslySetInnerHTML| E[Live Preview Panel]
    style D fill:#a855f7,stroke:#a855f7,color:#fff
    style E fill:#10b981,stroke:#10b981,color:#fff
```

---

## 🛠️ Repository Layout

*   [wasm-md-core/](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-core): The native Rust library compiling to WebAssembly.
    *   [wasm-md-core/src/lib.rs](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-core/src/lib.rs): Rust entry point wrapping `pulldown-cmark`.
    *   [wasm-md-core/Cargo.toml](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-core/Cargo.toml): Cargo configuration defining WASM target dependencies.
*   [wasm-md-web/](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web): Next.js 15 Client workspace.
    *   [wasm-md-web/src/hooks/useWasmLoader.ts](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web/src/hooks/useWasmLoader.ts): Custom loader hook initializing the WASM engine in the browser.
    *   [wasm-md-web/src/app/page.tsx](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web/src/app/page.tsx): Premium split-screen dark-mode editor dashboard.
    *   [wasm-md-web/src/app/globals.css](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web/src/app/globals.css): Core Tailwind and custom styling rules for Markdown components.
*   [.github/workflows/deploy.yml](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/.github/workflows/deploy.yml): Automated CI/CD pipeline for GitHub Pages deployment.

---

## 🚀 Local Quickstart

### Prerequisites
*   [Rust & Cargo](https://www.rust-lang.org/tools/install)
*   [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) (`npm install -g wasm-pack` or via shell installers)
*   [Node.js (v18+) & npm](https://nodejs.org/)

### 1. Compile the WASM Core
Compile the Rust library to a target WebAssembly module:
```bash
cd wasm-md-core
wasm-pack build --target web --release
```

### 2. Copy WASM Assets to Next.js Workspace
Integrate the generated assets into your web app:
```bash
# From workspace root
mkdir -p wasm-md-web/src/wasm wasm-md-web/public/wasm
cp wasm-md-core/pkg/wasm_md_core.js wasm-md-web/src/wasm/
cp wasm-md-core/pkg/wasm_md_core.d.ts wasm-md-web/src/wasm/
cp wasm-md-core/pkg/wasm_md_core_bg.wasm wasm-md-web/public/wasm/
```

### 3. Launch the Web Workspace
Install dependencies and boot up the Next.js development server:
```bash
cd wasm-md-web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your local high-performance workspace.

---

## 🌐 Production Deployment

### GitHub Pages (Automated)
This repository includes a GitHub Actions configuration that automates compiles and deployments.
1. Push your code to your remote GitHub repository (`main` branch).
2. Go to your repository settings -> **Pages**.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. The workflow will automatically compile the Wasm binary, build Next.js, and host it live.

### Static Export Hosting (Vercel, Netlify, etc.)
This application utilizes a Next.js static export (`output: 'export'`). To deploy on other services, configure the framework build settings to run the following build script to compile the Wasm binaries:
```bash
cd wasm-md-core && curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh && wasm-pack build --target web --release && cd ../wasm-md-web && mkdir -p src/wasm public/wasm && cp ../wasm-md-core/pkg/wasm_md_core.js src/wasm/ && cp ../wasm-md-core/pkg/wasm_md_core.d.ts src/wasm/ && cp ../wasm-md-core/pkg/wasm_md_core_bg.wasm public/wasm/ && npm run build
```

---

## 🖥️ Desktop Application (Tauri)

WasmMarkdown can also run as a native desktop application. For maximum performance on the desktop, the app bypasses WebAssembly and invokes the Markdown core natively in Rust using Tauri's high-performance IPC bridge.

### System Prerequisites

Because Tauri compiles a native GUI binary, you must install the WebKitGTK and development libraries on your machine before compiling:

#### Debian / Ubuntu
```bash
sudo apt-get update && sudo apt-get install -y \
  libsoup-3.0-dev \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### Fedora
```bash
sudo dnf groupinstall -y "C Development Tools and Libraries"
sudo dnf install -y \
  libsoup3-devel \
  webkit2gtk4.1-devel \
  libappindicator-gtk3-devel \
  openssl-devel \
  librsvg2-devel
```

### Running the Desktop App

1. Navigate to the frontend directory:
   ```bash
   cd wasm-md-web
   ```
2. Start the application in development mode:
   ```bash
   npm run tauri dev
   ```
3. To package the application as a production-ready installer:
   ```bash
   npm run tauri build
   ```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
