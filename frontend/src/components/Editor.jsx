import React, { useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

const MONACO_LANGUAGE_MAP = {
  javascript: 'javascript',
  python:     'python',
  java:       'java',
  c:          'c',
  cpp:        'cpp',
  typescript: 'typescript',
  go:         'go',
  php:        'php',
  ruby:       'ruby',
};

const CodeEditor = ({ code, setCode, language, theme, fontSize }) => {
  const editorRef = useRef(null);

  const handleMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  // When language changes, update editor model language
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [language]);

  return (
    <div className="editor-pane" style={{ flex: 1 }}>
      {/* Pane Header */}
      <div className="pane-header">
        <div className="pane-title">
          <span className="dot" />
          Editor
        </div>
        <span className="pane-badge">{language.toUpperCase()}</span>
      </div>

      {/* Monaco Editor */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <MonacoEditor
          height="100%"
          language={MONACO_LANGUAGE_MAP[language] || 'plaintext'}
          value={code}
          onChange={(val) => setCode(val ?? '')}
          theme={theme || 'vs-dark'}
          onMount={handleMount}
          options={{
            fontSize: fontSize || 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            renderLineHighlight: 'gutter',
            smoothScrolling: true,
            cursorBlinking: 'expand',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            formatOnType: false,
            suggest: { showKeywords: true, showSnippets: true },
            quickSuggestions: { other: true, comments: false, strings: false },
            parameterHints: { enabled: true },
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            padding: { top: 12, bottom: 12 },
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            renderWhitespace: 'none',
            glyphMargin: false,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
