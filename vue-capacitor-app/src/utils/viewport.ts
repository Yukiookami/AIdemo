/**
 * 动态计算真实视口高度，解决 iOS Safari / Capacitor WebView 中
 * 100vh / 100dvh 计算不准确的问题。
 *
 * 用法：在 main.ts 中 import './utils/viewport'
 * CSS 中使用：height: calc(var(--vh) * 100)
 */

function setViewportHeight(): void {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// 初始设置
setViewportHeight()

// 监听窗口大小变化（键盘弹出/收起等场景）
window.addEventListener('resize', setViewportHeight)

// 禁用双指缩放（防止 Capacitor WebView 内误触缩放）
document.addEventListener(
  'touchstart',
  (event: TouchEvent) => {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  },
  { passive: false },
)

document.addEventListener(
  'touchmove',
  (event: TouchEvent) => {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  },
  { passive: false },
)
