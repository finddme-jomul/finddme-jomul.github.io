import { defineConfig } from 'vite';
import { mainGalleryPlugin } from './scripts/main-gallery.mjs';
export default defineConfig({ plugins: [mainGalleryPlugin()], build: { rollupOptions: { input: { main: 'index.html', mainV2: 'main-v2.html', list: 'list.html', glassStudy: 'glass-study.html' } } }, server: { host: '0.0.0.0', port: 5173, strictPort: true, fs: { deny: ['.env', '.env.*', '**/.git/**', '**/docs/**'] } } });
