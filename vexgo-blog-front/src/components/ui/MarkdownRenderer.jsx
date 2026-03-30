import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';
import gfm from 'remark-gfm';

// Markdown渲染组件
const MarkdownRenderer = ({ content, isExcerpt = false }) => {
  const renderedContent = content || '';

  return (
    <div className={isExcerpt ? 'text-gray-600 dark:text-gray-300 break-words' : 'prose dark:prose-invert max-w-none'}>
      <ReactMarkdown
        remarkPlugins={[breaks, gfm]}
        components={{
          h1: ({ children }) => isExcerpt ? <span className="font-bold">{children}</span> : <h1 className="text-3xl font-bold mb-4 text-primary">{children}</h1>,
          h2: ({ children }) => isExcerpt ? <span className="font-semibold">{children}</span> : <h2 className="text-2xl font-bold mb-3 text-primary">{children}</h2>,
          h3: ({ children }) => isExcerpt ? <span className="font-medium">{children}</span> : <h3 className="text-xl font-bold mb-2 text-primary">{children}</h3>,
          p: ({ children }) => (
            <p className={isExcerpt ? 'inline mb-0' : 'mb-4'}>{children}</p>
          ),
          br: () => <br />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 dark:bg-dark/80 px-1 py-0.5 rounded text-primary">{children}</code>
          ),
          pre: ({ children }) => isExcerpt ? <code className="bg-gray-100 dark:bg-dark/80 px-1 py-0.5 rounded text-primary">{children}</code> : <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto my-4">{children}</pre>,
          ul: ({ children }) => isExcerpt ? <span>{children}</span> : <ul className="list-disc list-inside mb-4">{children}</ul>,
          ol: ({ children }) => isExcerpt ? <span>{children}</span> : <ol className="list-decimal list-inside mb-4">{children}</ol>,
          li: ({ children }) => isExcerpt ? <span> • {children}</span> : <li className="mb-1">{children}</li>,
        }}
      >
        {renderedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
