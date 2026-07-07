/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard",
          "Pretendard Variable",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // 순간적으로 강력하게 번쩍이는 플래시
        'flash-impact': 'flash 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        // 밖으로 퍼져나가는 충격파
        'shockwave-expand': 'shockwave 0.8s ease-out forwards',
        'flash': 'flash 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      // keyframes 키가 두 번 정의되어 shockwave가 유실되던 문제를 병합으로 해결
      keyframes: {
        flash: {
          '0%, 100%': { opacity: '0' },
          '10%': { opacity: '1' }, // 시작 직후 가장 밝게 빛남
        },
        shockwave: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '20%': { opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
