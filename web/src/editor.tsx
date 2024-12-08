import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';

type EditorProps = {
  value: string;
  onChange: (val: string) => void;
};

export const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <div className="overflow-hidden">
      <CodeMirror
        height="calc(100vh - 8.25rem)"
        width="50vw"
        value={value}
        // extensions={[javascript({ jsx: true })]}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onChange={(val: string, _viewUpdate: ViewUpdate) => {
          onChange(val);
        }}
        // theme="dark"
      />
    </div>
  );
};
