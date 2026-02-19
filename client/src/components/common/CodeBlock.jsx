import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Copy, Check } from "lucide-react";

// Custom LeetCode-like theme
const leetCodeTheme = {
  'code[class*="language-"]': {
    color: "#d4d4d4",
    background: "none",
    fontFamily:
      '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
    fontSize: "0.875rem",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.6",
    tabSize: 2,
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: "#d4d4d4",
    background: "#1e1e1e",
    fontFamily:
      '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
    fontSize: "0.875rem",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.6",
    tabSize: 2,
    hyphens: "none",
    padding: "1.5rem",
    margin: 0,
    overflow: "auto",
    borderRadius: "0.75rem",
    border: "1px solid #2d2d2d",
  },
  ':not(pre) > code[class*="language-"]': {
    background: "#1e1e1e",
    padding: "0.1em",
    borderRadius: "0.3em",
    whiteSpace: "normal",
  },
  comment: {
    color: "#6a9955",
    fontStyle: "italic",
  },
  prolog: {
    color: "#6a9955",
  },
  doctype: {
    color: "#6a9955",
  },
  cdata: {
    color: "#6a9955",
  },
  punctuation: {
    color: "#d4d4d4",
  },
  ".namespace": {
    opacity: 0.7,
  },
  property: {
    color: "#9cdcfe",
  },
  tag: {
    color: "#569cd6",
  },
  boolean: {
    color: "#569cd6",
  },
  number: {
    color: "#b5cea8",
  },
  constant: {
    color: "#9cdcfe",
  },
  symbol: {
    color: "#f8f8f2",
  },
  deleted: {
    color: "#f92672",
  },
  selector: {
    color: "#a6e22a",
  },
  "attr-name": {
    color: "#a6e22a",
  },
  string: {
    color: "#ce9178",
  },
  char: {
    color: "#a6e22a",
  },
  builtin: {
    color: "#e6db74",
  },
  inserted: {
    color: "#a6e22a",
  },
  operator: {
    color: "#d4d4d4",
  },
  entity: {
    color: "#ffffb6",
    cursor: "help",
  },
  url: {
    color: "#f92672",
  },
  ".language-css .token.string": {
    color: "#87c3a2",
  },
  ".style .token.string": {
    color: "#87c3a2",
  },
  variable: {
    color: "#f8f8f2",
  },
  atrule: {
    color: "#c9c",
  },
  "attr-value": {
    color: "#a6e22a",
  },
  function: {
    color: "#dcdcaa",
  },
  "class-name": {
    color: "#4ec9b0",
  },
  keyword: {
    color: "#569cd6",
  },
  regex: {
    color: "#d16969",
  },
  important: {
    color: "#fd971f",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
};

export default function CodeBlock({ language, code }) {
  const [copied, setCopied] = React.useState(false);

  // Map language to Prism language
  const getLanguage = (lang) => {
    const languageMap = {
      javascript: "javascript",
      js: "javascript",
      python: "python",
      py: "python",
      java: "java",
      cpp: "cpp",
      "c++": "cpp",
      c: "c",
      typescript: "typescript",
      ts: "typescript",
      go: "go",
      rust: "rust",
      php: "php",
      ruby: "ruby",
      swift: "swift",
      kotlin: "kotlin",
      scala: "scala",
      csharp: "csharp",
      cs: "csharp",
      "c#": "csharp",
    };
    return languageMap[lang?.toLowerCase()] || "javascript";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative my-4 rounded-lg overflow-hidden">
      {/* Language Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 rounded border border-slate-700">
          {language?.toUpperCase() || "JAVASCRIPT"}
        </span>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 p-2 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded border border-slate-700 transition-all duration-200"
        title="Copy code"
      >
        {copied ? (
          <Check size={16} className="text-emerald-400" />
        ) : (
          <Copy size={16} />
        )}
      </button>

      {/* Syntax Highlighter */}
      <SyntaxHighlighter
        language={getLanguage(language)}
        style={leetCodeTheme}
        showLineNumbers={true}
        wrapLines={true}
        lineNumberStyle={{
          color: "#6b7280",
          fontSize: "0.75rem",
          paddingRight: "1rem",
          minWidth: "2.5rem",
          textAlign: "right",
          userSelect: "none",
        }}
        codeTagProps={{
          style: {
            fontFamily:
              '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
            fontSize: "0.875rem",
            lineHeight: "1.6",
          },
        }}
        lineProps={{
          style: {
            padding: "0 0.5rem",
            minHeight: "1.5rem",
          },
        }}
      >
        {String(code).trim()}
      </SyntaxHighlighter>
    </div>
  );
}
