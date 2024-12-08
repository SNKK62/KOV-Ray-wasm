import { ArrowDownToLine } from 'lucide-react';
import { Button, LoadingButton } from '@/components/ui/button';
import { ThemeSwitch } from './themeSwitch';

type HeaderProps = {
  handleRender: () => void;
  handleCancel: () => void;
  handleDownload: () => void;
  canRender: boolean;
  canCancel: boolean;
  canDownload: boolean;
};
export const Header = ({
  handleRender,
  handleCancel,
  handleDownload,
  canRender,
  canCancel,
  canDownload,
}: HeaderProps) => {
  return (
    <div className="h-12 px-4 grid grid-cols-3 border-b-2 border-gray-400">
      <div></div>
      <div>
        <div className="h-12 flex items-center justify-center font-extrabold">
          KOV-Ray Play Ground
        </div>
      </div>
      <div className="flex justify-end items-center gap-2">
        <ThemeSwitch />
        <Button size="icon" variant="outline" disabled={!canDownload} onClick={handleDownload}>
          <ArrowDownToLine />
        </Button>
        <Button variant="destructive" disabled={!canCancel} onClick={handleCancel}>
          Cancel
        </Button>
        <LoadingButton loading={canCancel} disabled={!canRender} onClick={handleRender}>
          Render
        </LoadingButton>
      </div>
    </div>
  );
};
