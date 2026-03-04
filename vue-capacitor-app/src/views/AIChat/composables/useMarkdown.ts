/**
 * @file composables/useMarkdown.ts
 * @description Markdown 渲染工具
 * 使用 marked 解析 + highlight.js 代码高亮 + DOMPurify XSS 清洗
 */

import { marked } from 'marked'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

// 配置 marked：使用 highlight.js 做代码块语法高亮
marked.setOptions({
  breaks: true, // 单个换行符转为 <br>
  gfm: true, // 启用 GitHub Flavored Markdown
})

// 自定义 renderer：代码块高亮
const renderer = new marked.Renderer()
renderer.code = ({ text, lang }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = hljs.highlight(text, { language }).value
  return `<pre class="hljs-pre"><code class="hljs language-${language}">${highlighted}</code></pre>`
}
marked.use({ renderer })

/**
 * 将 Markdown 文本渲染为安全的 HTML 字符串
 * 经过 DOMPurify 清洗，防止 XSS
 */
export const renderMarkdown = (text: string): string => {
  if (!text) return ''
  const raw = marked.parse(text) as string
  return DOMPurify.sanitize(raw, {
    // 允许 hljs 用到的 class，以及常见 HTML 标签
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'del',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'hr',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'a',
      'img',
      'span',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel'],
  })
}
