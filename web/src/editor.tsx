import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import { KOVRay } from 'codemirror-lang-kov-ray';
import { useActualTheme } from './theme.ts';

type EditorProps = {
  value: string;
  onChange: (val: string) => void;
};

export const Editor = ({ value, onChange }: EditorProps) => {
  const theme = useActualTheme();
  return (
    <div className="overflow-hidden">
      <CodeMirror
        height="calc(100vh - 8.25rem)"
        width="50vw"
        value={value}
        extensions={[KOVRay()]}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onChange={(val: string, _viewUpdate: ViewUpdate) => {
          onChange(val);
        }}
        theme={theme}
      />
    </div>
  );
};
