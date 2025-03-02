import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/use-chat"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn("flex items-start gap-4 rounded-lg p-4", message.role === "user" ? "bg-muted" : "bg-primary/10")}
    >
      <div
        className={cn(
          "rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium",
          message.role === "user"
            ? "bg-muted-foreground/20 text-foreground"
            : "bg-primary h-8 w-8 text-primary-foreground",
        )}
      >
        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              const language = match ? match[1] : "typescript" // Default to typescript

              return !inline ? (
                <div className="relative">
                  <div className="absolute right-2 top-2 text-xs text-muted-foreground">{language}</div>
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    PreTag="div"
                    className="rounded-md my-2 px-4 py-3 !bg-zinc-900"
                    showLineNumbers={true}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={cn("bg-muted px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
                  {children}
                </code>
              )
            },
            p({ children }) {
              return <p className="mb-2">{children}</p>
            },
            ul({ children }) {
              return <ul className="list-disc pl-6 mb-2">{children}</ul>
            },
            ol({ children }) {
              return <ol className="list-decimal pl-6 mb-2">{children}</ol>
            },
            li({ children }) {
              return <li className="mb-1">{children}</li>
            },
            h3({ children }) {
              return <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
            },
            h4({ children }) {
              return <h4 className="text-base font-semibold mt-3 mb-1">{children}</h4>
            },
            a({ node, href, children, ...props }) {
              return (
                <a
                  href={href}
                  className="text-primary underline hover:text-primary/80"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              )
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto my-4">
                  <table className="w-full border-collapse border border-border">{children}</table>
                </div>
              )
            },
            thead({ children }) {
              return <thead className="bg-muted">{children}</thead>
            },
            tbody({ children }) {
              return <tbody>{children}</tbody>
            },
            tr({ children }) {
              return <tr className="border-b border-border">{children}</tr>
            },
            th({ children }) {
              return <th className="px-4 py-2 text-left font-medium">{children}</th>
            },
            td({ children }) {
              return <td className="px-4 py-2">{children}</td>
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

