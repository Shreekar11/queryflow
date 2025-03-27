import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-monokai";

import { useTheme } from "../context/theme-context";

interface QueryInputProps {
  query: string;
  queryError: string | null;
  onChange: (value: string) => void;
}

const QueryInput = ({ query, queryError, onChange }: QueryInputProps) => {
  const { mode } = useTheme();

  return (
    <div>
      <AceEditor
        placeholder="Write your SQL query here..."
        mode="mysql"
        theme={mode === "light" ? "textmate" : "monokai"}
        name="query-editor"
        onChange={onChange}
        fontSize={14}
        lineHeight={19}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={query}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          enableMobileMenu: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{
          width: "100%",
          height: "150px",
          border: queryError ? "1px solid red" : "1px solid #e0e0e0",
          borderRadius: "4px",
        }}
      />
      {queryError && (
        <div style={{ color: "red", marginTop: "8px" }}>{queryError}</div>
      )}
    </div>
  );
};

export default QueryInput;
