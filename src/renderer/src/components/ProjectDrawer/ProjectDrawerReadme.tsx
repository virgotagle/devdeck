import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Copy, Check } from 'lucide-react'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import Mermaid from '../Mermaid'

interface ProjectDrawerReadmeProps {
  readme?: string
}

const ProjectDrawerReadme: React.FC<ProjectDrawerReadmeProps> = ({ readme }) => {
  const { isCopied, copy } = useCopyToClipboard()

  const handleCopy = (): void => {
    if (readme) {
      copy(readme)
    }
  }

  return (
    <div className="pt-6 border-t border-slate-800/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">Readme</h3>
        {readme && (
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-2 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            title="Copy generic markdown"
          >
            {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>
        )}
      </div>
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
            h2: ({ children }) => (
              <h2 className="text-lg font-bold mt-6 mb-3 text-indigo-300">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-bold mt-4 mb-2 text-slate-200">{children}</h3>
            ),
            p: ({ children }) => <p className="text-slate-400 mb-4 leading-relaxed">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc pl-4 mb-4 text-slate-400">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-4 mb-4 text-slate-400">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ children, className }) => {
              const match = /language-(\w+)/.exec(className || '')
              const isMermaid = match && match[1] === 'mermaid'

              if (isMermaid) {
                return <Mermaid chart={String(children).replace(/\n$/, '')} />
              }

              return (
                <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-200 font-mono text-xs">
                  {children}
                </code>
              )
            },
            pre: ({ children }) => (
              <pre className="bg-slate-950 p-3 rounded-lg overflow-x-auto mb-4 border border-slate-800">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded inline-block"
                loading="lazy"
              />
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-500/50 pl-4 py-1 my-4 bg-indigo-500/10 rounded-r">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 border border-slate-800 rounded-lg">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-slate-900/50">{children}</thead>,
            tbody: ({ children }) => (
              <tbody className="divide-y divide-slate-800">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-slate-800/30 transition-colors">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 font-semibold text-slate-200 whitespace-nowrap">
                {children}
              </th>
            ),
            td: ({ children }) => <td className="px-4 py-3 text-slate-400">{children}</td>
          }}
        >
          {readme || '*No README.md found*'}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default ProjectDrawerReadme
