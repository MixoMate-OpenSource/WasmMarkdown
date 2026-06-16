This project, WasmMarkdown, is an ultra-fast, local-first browser-based documentation engine designed for instantaneous document rendering [images_api:image_search].
By moving the heavy processing of parsing Markdown text into a compiled WebAssembly (Wasm) binary written in Rust, it eliminates the typing lag, UI stutter, and main-thread freezing commonly found in traditional JavaScript-based editors [images_api:image_search].
------------------------------
## 🌟 Core Capabilities

* Near-Zero Latency Rendering: Shifting the text parsing from JavaScript to a compiled native Rust binary allows for immediate frame-accurate preview updates, even when processing massive multi-page documents [images_api:image_search].
* Main-Thread Liberation: The heavy computational overhead of breaking down syntax arrays and generating HTML layout trees happens entirely inside the isolated WebAssembly memory sandbox, keeping the browser UI fluid and responsive.
* Compile-Time Safety: Utilizing strong type configurations ensures data crossing the JavaScript-to-Wasm bridge is tightly validated, eliminating common web memory leaks.

------------------------------
## 🏗️ How the Components Work Together
The system divides responsibilities between high-speed system computation and modern rendering:
## 1. The High-Speed Compiler Layer (Rust + WebAssembly)

* The Parsing Core: Uses pulldown-cmark, a production-grade, streaming Markdown parser written in Rust known for its extreme speed and safety.
* Wasm Compiling: wasm-bindgen wraps the native Rust logic, generating standard .wasm bytecode binaries alongside a lightweight, typed JavaScript glue file.
* Zero-Copy Optimizations: The compiled function safely accesses the input text string directly inside the isolated memory space, generating and returning the finalized HTML string instantly.

## 2. The Interactive Workspace (Next.js 15 Client UI)

* Split-Screen Layout: Features a high-density, dark-mode text workspace with an input layout editor on the left and a live-updating rendered HTML canvas on the right [images_api:image_search].
* Asynchronous Hydration: Uses native Next.js 15 routing parameters combined with custom React hooks (useWasm) to load the heavy .wasm binary dynamically in the background after the initial page load.
* Real-Time Sync: Every keystroke inside the text area hooks into the local state loop, feeding the text payload into the Wasm instance and updating the DOM preview box on the fly.

------------------------------
## 🛠️ Open-Source AI Generation Prompts
To generate the codebase for this client-side web engine, use these two system-engineered developer prompts.
## 🦀 Prompt 1: The Rust WebAssembly Core Engine (wasm-md-core)

Act as a Principal Systems Engineer specializing in WebAssembly. Write a high-performance Markdown parsing utility in Rust designed to compile to a WASM target via 'wasm-bindgen'.

Create two files:
1. 'Cargo.toml': Configure a library container with a crate-type set to ["cdylib"]. Include dependencies for 'wasm-bindgen' and 'pulldown-cmark' (configured with standard tables and task-list extensions enabled).
2. 'src/lib.rs': Implement a single function 'render_markdown_to_html(input: &str) -> String' annotated with the #[wasm_bindgen] macro.

Technical Requirements:
- Use the streaming 'Parser' from 'pulldown-cmark' to transform the input text slice into structural events.
- Push these processed events cleanly into an allocated string buffer via 'html::push_html' and return the final HTML string.
- Keep execution paths optimized to avoid memory leakage or array thrashing across consecutive invocations. Do not use placeholders or shorthand comments.

## 🌐 Prompt 2: Next.js 15 Asynchronous Client Workspace (wasm-md-web)

Act as a Staff Frontend Architect. Build a Next.js 15 App Router page layout that asynchronously loads and maps a compiled local WebAssembly asset for real-time Markdown rendering.

Technical Requirements:
1. Write a self-contained client page file 'app/markdown/page.tsx' configured with TypeScript and Tailwind CSS.
2. Build a dark-mode split-screen layout viewport: The left pane must feature a clean monospaced raw textarea input, and the right pane must act as an HTML preview container.
3. Write a custom React hook 'useWasmLoader' to load the local compiled Wasm binding module dynamically and asynchronously on mount.
4. Implement a thread-safe rendering event loop. As the user types into the textarea, pass the text string directly into the loaded Wasm function 'render_markdown_to_html' and dump the string result into the preview wrapper using 'dangerouslySetInnerHTML'.
5. Ensure the interaction loop remains completely seamless, maintaining a zero-frame-lag experience on heavy input fields without lagging the browser event loop. Include strict TypeScript boundary interface typing.

------------------------------
## 📄 Repository Master README.md Template
Copy and paste this markdown file directly into the root directory of your GitHub repository.

# ⚡ WasmMarkdown> **Ultra-Fast, Offline-First Browser Markdown Editor Driven by Local WebAssembly & Rust.**  > Parse and render complex Markdown text streams instantly inside the browser sandbox with zero UI lag or main-thread freezing.
---## 🌟 Key Capabilities
*   🦀 **Native Rust Performance**: Leverages the streaming power of `pulldown-cmark` running inside a local Wasm module wrapper.*   🚀 **Zero Main-Thread Lag**: Offloads heavy text parsing from JavaScript arrays to high-speed compiled binary memory blocks.*   📦 **Dynamic Hydration**: Next.js 15 architecture utilizing background dynamic module compilation to optimize initial page loading.*   🔒 **100% Client-Side Privacy**: Your text never leaves your browser tab—zero network calls, zero servers, total offline safety.
---## 🚀 Quick Setup### 1. Compile the Wasm TargetEnsure you have the Rust toolchain and `wasm-pack` installed locally:```bash
cd wasm-md-core
wasm-pack build --target web --release
```
### 2. Boot the Next.js App WorkspaceCopy the compiled pkg assets into your web app directory, then launch the client:```bash
cd ../wasm-md-web
npm install
npm run dev
```
Open `http://localhost:3000` to interact with your high-performance workspace.
---## 📄 LicenseDistributed under the MIT License. See `LICENSE` for details.

------------------------------
To advance the development of WasmMarkdown, let me know how you would like to proceed:

* Should we configure the Webpack/Next.js configuration parameters to load .wasm files securely without compilation issues?
* Do you want to build the custom React hook to manage the asynchronous loading state of the WebAssembly module?
* Would you prefer to expand the Rust parser code to support custom markdown extensions like syntax highlighting for code blocks?


