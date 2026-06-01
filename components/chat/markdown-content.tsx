'use client'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // 简单的 Markdown 渲染器 - 不使用外部库
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // 标题 (# ## ###)
      if (line.startsWith('###')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-sm font-semibold mt-3 mb-2">
            {line.replace(/^#+\s/, '')}
          </h3>
        )
      } else if (line.startsWith('##')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-base font-bold mt-4 mb-2">
            {line.replace(/^#+\s/, '')}
          </h2>
        )
      } else if (line.startsWith('#')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-lg font-bold mt-4 mb-2">
            {line.replace(/^#+\s/, '')}
          </h1>
        )
      }
      // 列表
      else if (line.startsWith('- ')) {
        elements.push(
          <ul key={`ul-${i}`} className="list-disc list-inside mb-2 space-y-1">
            {lines
              .slice(i)
              .filter(l => l.startsWith('- '))
              .map((l, idx) => (
                <li key={`li-${i}-${idx}`} className="text-sm">
                  {l.replace(/^- /, '')}
                </li>
              ))}
          </ul>
        )
        i += lines.slice(i).filter(l => l.startsWith('- ')).length - 1
      }
      // 引用
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`bq-${i}`}
            className="border-l-4 border-muted-foreground pl-3 py-1 my-2 text-muted-foreground italic"
          >
            {line.replace(/^> /, '')}
          </blockquote>
        )
      }
      // 普通段落（包含格式化）
      else if (line.trim()) {
        const formattedLine = formatInlineText(line)
        elements.push(
          <p key={`p-${i}`} className="text-sm mb-2 leading-relaxed">
            {formattedLine}
          </p>
        )
      }
      // 空行
      else {
        elements.push(<div key={`spacer-${i}`} className="h-2" />)
      }

      i++
    }

    return elements
  }

  // 处理内联格式 (加粗、斜体等)
  const formatInlineText = (text: string) => {
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0

    // 匹配加粗 **text**
    const boldRegex = /\*\*(.*?)\*\*/g
    let match
    const boldMatches = []
    while ((match = boldRegex.exec(text)) !== null) {
      boldMatches.push({ start: match.index, end: match.index + match[0].length, text: match[1] })
    }

    // 应用加粗格式
    boldMatches.forEach(({ start, end, text }) => {
      if (lastIndex < start) {
        parts.push(text.substring(lastIndex, start))
      }
      parts.push(
        <strong key={`bold-${start}`} className="font-semibold">
          {text}
        </strong>
      )
      lastIndex = end
    })

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  return <div className="space-y-2">{parseMarkdown(content)}</div>
}
