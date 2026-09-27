import {defineConfig} from 'vite';
import canvasCommons from '@canvas-commons/vite-plugin';
import webcodecs from '@canvas-commons/webcodecs';

export default defineConfig({
  plugins: [
    canvasCommons(),
    webcodecs(),
  ],
});
