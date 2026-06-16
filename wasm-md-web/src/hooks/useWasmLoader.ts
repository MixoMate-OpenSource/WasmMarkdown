'use client';

import { useState, useEffect } from 'react';
import init, { render_markdown_to_html } from '@/wasm/wasm_md_core';

export function useWasmLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    async function loadWasm() {
      try {
        // Initialize WASM module using static asset route
        await init('/wasm/wasm_md_core_bg.wasm');
        if (active) {
          setIsLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load WASM module:', err);
        if (active) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    }

    loadWasm();

    return () => {
      active = false;
    };
  }, []);

  const renderMarkdown = (markdown: string): string => {
    if (!isLoaded) {
      return '';
    }
    try {
      return render_markdown_to_html(markdown);
    } catch (err) {
      console.error('Error rendering markdown via Wasm:', err);
      return `<div style="color: #ef4444; padding: 1rem; border: 1px solid #ef4444; border-radius: 0.375rem; background-color: rgba(239, 68, 68, 0.1);">Error rendering Markdown: ${String(err)}</div>`;
    }
  };

  return { isLoaded, error, renderMarkdown };
}
