import { defineConfig } from 'vite';
import canvasCommons from '@canvas-commons/vite-plugin';
import webcodecs from '@canvas-commons/webcodecs';

export default defineConfig({
    server: {
        port: 9000,
        // Allows Vite to accept traffic coming from localtunnel proxy URLs
        allowedHosts: true,
    },
    plugins: [
        canvasCommons(),
        webcodecs(),
    ],
});
