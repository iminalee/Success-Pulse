import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CRA(react-scripts)에서 마이그레이션.
// - 진입점은 루트 index.html → /src/index.js
// - public/ 자산(manifest.json 등)은 루트(/)로 서빙
// - 빌드 출력은 dist/ (Vite 기본값)
export default defineConfig({
  plugins: [react()],
  // CRA는 .js 파일에 JSX를 허용했으나 Vite/esbuild는 기본적으로 .jsx만 JSX로 파싱한다.
  // src의 .js 파일(App.js, index.js)에 든 JSX를 파싱하도록 esbuild 로더를 지정.
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
})
