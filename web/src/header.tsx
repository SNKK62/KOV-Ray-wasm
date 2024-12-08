import { ArrowDownToLine } from 'lucide-react';
import { Button, LoadingButton } from '@/components/ui/button';

type HeaderProps = {
  handleRender: () => void;
  handleCancel: () => void;
  handleDownload: () => void;
  isRendering: boolean;
  alreadyRendered: boolean;
};
export const Header = ({
  handleRender,
  handleCancel,
  handleDownload,
  isRendering,
  alreadyRendered,
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
        <Button size="icon" variant="outline" disabled={!alreadyRendered} onClick={handleDownload}>
          <ArrowDownToLine />
        </Button>
        <Button variant="destructive" disabled={!isRendering} onClick={handleCancel}>
          Cancel
        </Button>
        <LoadingButton loading={isRendering} disabled={isRendering} onClick={handleRender}>
          Render
        </LoadingButton>
      </div>
    </div>
  );
};
