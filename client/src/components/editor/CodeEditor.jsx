import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, language = "javascript", onChange }) => {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  const handleEditorMount = (editor, monaco) => {
    // Disable all JS/TS validation and red squiggly lines
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });
  };

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={language}
      value={code}
      onChange={handleEditorChange}
      onMount={handleEditorMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        wordWrap: "off",
        renderValidationDecorations: "off",
        overviewRulerLanes: 0,
      }}
    />
  );
};

export default CodeEditor;
