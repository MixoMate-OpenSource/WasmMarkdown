# WasmMarkdown: Project & Architecture Details

## 🧸 Explain Like I'm 5 (Beginner Overview)

Imagine you are writing a huge book in a special code called Markdown. Normally, when you type, the computer has to constantly translate your words into pretty pages (with bold text, titles, and lists). In most editors, the computer gets tired and starts lagging or freezing when the book gets very long because it has to translate everything using slow tools.

WasmMarkdown is like giving your computer a super-fast, pre-trained translator who speaks the computer's native language. We took a lightning-fast translator written in Rust, packed it into a tiny, high-speed capsule called WebAssembly, and put it right inside your web browser. 

Now, every time you press a key, the translator does the work in a fraction of a millisecond. Your screen updates instantly without a single stutter, and because the translator lives entirely inside your browser, none of your writing is ever sent to the internet—it remains 100% private and works completely offline!

---

## 🧠 Core Functionality: How It Works

WasmMarkdown splits processing and presentation into a high-performance Rust compiler and a responsive React frontend.

### 1. The High-Speed Compiler Layer (Rust + WebAssembly)
* **The Parser Core**: We use `pulldown-cmark`, a production-grade, streaming Markdown parser written in Rust. It utilizes a pull-based parsing model which is highly efficient, avoiding building massive intermediate syntax trees in memory.
* **WebAssembly Compilation**: Using `wasm-bindgen` and `wasm-pack`, we compile the Rust crate into a `.wasm` bytecode binary alongside a lightweight JavaScript wrapper.
* **The Rendering API**: The core exposes a single function, `render_markdown_to_html(input: &str) -> String`. It takes the raw string, streams the markdown events, pushes the generated HTML tags directly into a pre-allocated string buffer, and returns the result to JavaScript.

### 2. Next.js 15 Client Workspace
* **Asynchronous WebAssembly Loading**: Because `.wasm` binaries are heavy resources, loading them synchronously on the main thread would block page rendering. We use a custom React hook `useWasmLoader` to load the `.wasm` file asynchronously in the background once the client-side component has mounted.
* **Zero-Lag Event Loop**: Every keystroke in the raw Markdown textarea feeds the updated text into the initialized WebAssembly module. The returned HTML string is instantly pushed into the preview pane's DOM container via `dangerouslySetInnerHTML`.
* **State Sync**: React handles the component state, while WebAssembly does the heavy lifting of parsing. This separation of concerns ensures that the main thread remains free to handle typing input, resulting in zero input delay.

### 3. Styling & Presentation (Tailwind CSS v4)
* **Glassmorphism Design**: Frosted-glass editor headers and border layouts allow the workspace to blend beautifully with active desktop wallpapers.
* **Monospaced Typography**: A highly readable monospaced font family is used in the raw markdown editor pane, complete with line-number indicators.
* **Adaptive Dark Mode**: Tailored dark-mode color scheme reduces eye strain during long writing sessions.

---

## 🔍 Codebase Walkthrough

This section maps out the critical code segments implementing our high-performance rendering loop.

### 1. High-Performance Parser Engine (Rust)
The core markdown-to-HTML parsing is written in Rust to achieve maximum performance and memory efficiency.
* [src/lib.rs:L5-20](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-core/src/lib.rs#L5-L20) defines the Rust parsing function `render_markdown_to_html` exported via the `#[wasm_bindgen]` macro.
* [src/lib.rs:L6-12](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-core/src/lib.rs#L6-L12) configures the parsing options, enabling extensions like tables, task lists, and strikethroughs.
* [src/lib.rs:L14-17](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-core/src/lib.rs#L14-L17) instantiates the streaming parser and pushes the generated HTML directly into a pre-allocated string buffer, avoiding intermediate syntax tree allocations.

### 2. Client-Side WASM Initializer Hook (React)
The custom React hook manages the asynchronous loading state of the WebAssembly module safely on the client side.
* [useWasmLoader.ts:L6-48](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web/src/hooks/useWasmLoader.ts#L6-L48) implements the hook `useWasmLoader`.
* [useWasmLoader.ts:L10-33](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web/src/hooks/useWasmLoader.ts#L10-L33) utilizes a `useEffect` block to run when the component mounts in the browser. It asynchronously imports the WASM package from the static asset directory `/wasm/` via the ESM loader.
* [useWasmLoader.ts:L35-45](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web/src/hooks/useWasmLoader.ts#L35-L45) defines `renderMarkdown` which acts as a safe wrapper function. If the WASM binary is not loaded, it returns an empty string; if an error occurs during parsing, it gracefully handles the exception and returns styled error HTML.

### 3. Editor Reactive Event Loop (Next.js)
The React page links the raw editor input to the WebAssembly parser and updates the DOM, profiling performance on every keystroke.
* [page.tsx:L68-74](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web/src/app/page.tsx#L68-L74) declares component states for tracking the document markdown string, the generated HTML, and the parsing duration. It also sets up React's `useTransition` to optimize the input state changes.
* [page.tsx:L77-86](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web/src/app/page.tsx#L77-L86) implements the react effect hook that triggers on changes to `markdown` or `isLoaded`. It uses the high-resolution timer `performance.now()` to measure the exact milliseconds required by the Wasm engine to parse and render the document.

---

## 🚀 Deployment Strategy

Since WasmMarkdown is designed as an offline-first, client-side application, it can be compiled into a static web bundle and hosted on any static hosting provider.

### 1. GitHub Pages (Automated via GitHub Actions)
We have configured a fully automated CI/CD pipeline in [.github/workflows/deploy.yml](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/.github/workflows/deploy.yml). 

When changes are pushed to the `main` branch, the GitHub Actions runner automatically:
1. Installs the Rust compiler toolchain and fetches `wasm-pack`.
2. Compiles the Rust workspace into the WebAssembly package via `wasm-pack build --target web --release`.
3. Copies the WebAssembly binaries and JS binders into the Next.js `src/wasm/` and `public/wasm/` folders.
4. Updates `next.config.ts` to output a static export (`output: 'export'`).
5. Runs `npm run build` to compile pages into static HTML/CSS/JS assets inside the `wasm-md-web/out` folder.
6. Deploys the `out` directory directly to GitHub Pages.

> [!NOTE]
> If deploying to a subdirectory page (like `https://<username>.github.io/WasmMarkdown`), make sure to configure `basePath` in [next.config.ts](file:///home/mixomate/work/Mixomate/opensource/WasmMarkdown/wasm-md-web/next.config.ts) to match the repository name (e.g., `basePath: '/WasmMarkdown'`).

### 2. Vercel, Netlify, or Cloudflare Pages
You can also connect your public GitHub repository to services like Vercel or Netlify. Since they need to compile the WASM binary from source, use the following build settings:

* **Framework Preset**: Next.js
* **Build Command**:
  ```bash
  cd wasm-md-core && curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh && wasm-pack build --target web --release && cd ../wasm-md-web && mkdir -p src/wasm public/wasm && cp ../wasm-md-core/pkg/wasm_md_core.js src/wasm/ && cp ../wasm-md-core/pkg/wasm_md_core.d.ts src/wasm/ && cp ../wasm-md-core/pkg/wasm_md_core_bg.wasm public/wasm/ && npm run build
  ```
* **Output Directory**: `wasm-md-web/out` (if using static export) or `wasm-md-web/.next` (default).

---

## 🎤 Technical Interview Q&A

**Q: Why choose Rust and WebAssembly over a JavaScript Markdown parser like `marked` or `markdown-it`?**
**A:** JavaScript-based parsers perform garbage collection, heavy string allocations, and array manipulation on the main thread. As a document grows to tens of thousands of lines, these operations block the browser's event loop, causing typing lag, frame drops, and freezing. Rust compiled to WebAssembly executes at near-native speed with manual memory management and zero garbage collection pauses. By streaming the parser events and pushing them into a single pre-allocated string buffer, we keep memory overhead minimal and performance stable regardless of file size.

**Q: How is the WebAssembly module loaded in Next.js 15 without causing server-side rendering (SSR) failures?**
**A:** Next.js compiles pages on the server where browser APIs like `window` or `fetch` (for local assets) are not available. To prevent compilation and execution errors during SSR, we isolate the WebAssembly compilation to client-only mounting. Our custom hook, `useWasmLoader`, runs inside a `useEffect` callback, ensuring it only executes on the client-side browser environment. We load the `.wasm` binary using `wasm-bindgen`'s `--target web` option, serving the bytecode directly from the `/public` folder and initializing it with a standard browser fetch.

**Q: How does the application prevent XSS (Cross-Site Scripting) attacks when rendering HTML using `dangerouslySetInnerHTML`?**
**A:** Rendering raw HTML from Markdown can expose users to XSS if malicious scripts are injected (e.g., `<script>` or event handlers). To make the workspace production-ready, we sanitize the HTML output on the client side using a lightweight sanitizer library like `DOMPurify` before injecting it into the DOM. This strips dangerous HTML elements and attributes while preserving clean layout tags.

**Q: How do you optimize the data transfer bridge between JavaScript and WebAssembly?**
**A:** Crossing the boundary between JS and WebAssembly (the "bridge") can be slow if large amounts of data are repeatedly copied. In `wasm-bindgen`, strings are passed by copying their bytes into the WebAssembly linear memory space. We optimize this by passing the text as a string slice (`&str`), allowing the Rust compiler to read the memory directly without additional nesting. We also ensure that we do not re-instantiate the module on every keystroke, keeping a single warm instance of the WebAssembly module active for the entire application lifecycle.
