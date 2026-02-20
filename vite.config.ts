import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'WhiteboardEditor',
      fileName: 'whiteboard-editor',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'pinia', 'vue-router'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'vue-router': 'VueRouter',
        },
        exports: 'named',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
})
