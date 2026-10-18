import { defineConfig } from 'vite';
export default defineConfig({ build: { rollupOptions: { input: { main: 'index.html', list: 'list.html', glassStudy: 'glass-study.html' } } }, server: { host: '0.0.0.0', port: 5173, strictPort: true, fs: { deny: ['.env', '.env.*', '**/.git/**', '**/docs/**'] } } });
