import { defineConfig } from 'vite';
import { projectCataloguePlugin } from './scripts/project-catalogue.mjs';
export default defineConfig({ plugins: [projectCataloguePlugin()], build: { rollupOptions: { input: { main: 'index.html', mainV2: 'main-v2.html', list: 'list.html', glassStudy: 'glass-study.html' } } }, server: { host: '0.0.0.0', port: 5173, strictPort: true, fs: { deny: ['.env', '.env.*', '**/.git/**', '**/docs/**'] } } });
