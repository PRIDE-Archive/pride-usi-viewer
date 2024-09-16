import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/pride/archive/usi-viewer/',
  resolve: {
    // https://cn.vitejs.dev/config/#resolve-alias
    alias: {
      // 
      '~': path.resolve(__dirname, './'),
      // 
      '@': path.resolve(__dirname, './src')
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  plugins: [vue()],

})
