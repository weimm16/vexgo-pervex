import ReactMarkdown from 'react-markdown';

// Markdown渲染组件
const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose dark:prose-invert max-w-none"
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-primary">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold mb-3 text-primary">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-bold mb-2 text-primary">{children}</h3>,
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
          <code className="bg-gray-100 dark:bg-dark/80 px-1 py-0.5 rounded text-primary">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto my-4">
            {children}
          </pre>
        ),
      }}
    >
      {content || ''}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
