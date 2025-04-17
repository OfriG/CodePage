
import Editor from '@monaco-editor/react';  

export default function CodeEditor({ code, onCodeChange, onShowSolution, onReset, role }) {
    return (
      <div>
        <button className="custom-btn show" onClick={onShowSolution}>
          Show Solution
        </button>
        <button className="custom-btn reset" onClick={onReset}>
          Reset
        </button>
  
        <Editor
          height="400px"
          defaultLanguage="cpp"
          theme="vs-light"
          value={code}
          onChange={onCodeChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: "on",
            automaticLayout: true,
            readOnly: role === 'mentor',
          }}
        />
      </div>
    );
  }
  