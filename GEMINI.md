# Gemini Directives for Fantasy Realms Simulator

This document provides context and directives for understanding and modifying the "Fantasy Realms Simulator" application. Please adhere to these guidelines to maintain project integrity.

## Project Structure & Build Process

This project is configured for a dual-environment setup:

1.  **Live Prototyping Environment (e.g., Google AI Studio):**
    *   Relies on an `importmap` within `index.html` to load ES modules like React, D3, and `@google/genai` directly from a CDN (esm.sh).
    *   Uses a **Tailwind CSS CDN script** (`<script src="https://cdn.tailwindcss.com"></script>`) in `index.html` for styling. This script **must remain** in `index.html` to ensure styles render correctly in the live preview environment.
    *   The entry point is `<script type="module" src="/index.tsx"></script>`, which is handled by the prototyping environment's runtime.

2.  **Local Development & Production Build (Vite):**
    *   When the project is downloaded, it is a standard Vite + React + TypeScript application.
    *   Run `npm install` to install all dependencies listed in `package.json`.
    *   Run `npm run dev` for a local development server with Hot Module Replacement (HMR).
    *   Run `npm run build` to generate a production-ready, optimized build in the `/dist` directory.

## Key Configuration Files

*   **`vite.config.ts`**: Configures the Vite build tool. It includes the `@vitejs/plugin-react` plugin, which is essential for transpiling JSX.
*   **`tailwind.config.js` & `postcss.config.js`**: Configures Tailwind CSS for the build process. During `npm run build`, Tailwind scans all source files for utility classes and generates an optimized CSS file.
*   **`package.json`**: Defines all dependencies and scripts. This is the source of truth for local setup.
*   **`index.html`**: This file is intentionally structured to work in *both* environments. Do not remove the Tailwind CDN script or the importmap, as they are crucial for the live prototyping experience. Vite is smart enough to correctly inject its own bundled CSS during the build process, even with the CDN script present.

## Deployment to GitHub Pages

1.  After downloading the project archive, run `npm install`.
2.  Run `npm run build`.
3.  Deploy the contents of the generated **`/dist`** folder to your GitHub Pages repository. **Do not** deploy the root project files.

## Directive Summary

-   **DO NOT** remove the Tailwind CSS CDN script from `index.html`.
-   **DO NOT** remove the `importmap` from `index.html`.
-   Recognize that `index.css` (with `@tailwind` directives) and `tailwind.config.js` are used by the **Vite build process**, not the live preview.
-   Any changes must be compatible with both the live preview (CDN-based) and the local Vite build.
