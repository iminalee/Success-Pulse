/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // tailwind.config.js
      animation: {
        // 기존 애니메이션들...
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // [신규] 순간적으로 강력하게 번쩍이는 플래시
        'flash-impact': 'flash 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        // [신규] 밖으로 퍼져나가는 충격파
        'shockwave-expand': 'shockwave 0.8s ease-out forwards',
         // 순식간에 번쩍이는 강력한 플래시 효과
        'flash': 'flash 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        // 기존 펄스보다 더 느리고 웅장한 효과 (선택 사항)
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        // 기존 키프레임들...
        // [신규] 플래시 키프레임
        flash: {
          '0%, 100%': { opacity: '0' },
          '10%': { opacity: '1' }, // 시작 직후 가장 밝게 빛남
        },
        
        // [신규] 충격파 키프레임
        shockwave: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '20%': { opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
      // ▼▼▼ 여기에 새 애니메이션 추가 ▼▼▼
      
      keyframes: {
        // 플래시 키프레임 정의
        flash: {
          '0%, 100%': { opacity: '0' },
          '10%': { opacity: '1' }, // 시작 직후 가장 밝게 빛남
        },
      },
      
    },
  },
  plugins: [],
}