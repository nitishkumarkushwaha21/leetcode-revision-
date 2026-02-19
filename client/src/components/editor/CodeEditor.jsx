import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, language = 'javascript', onChange }) => {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      defaultLanguage={language}
      value={code}
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
