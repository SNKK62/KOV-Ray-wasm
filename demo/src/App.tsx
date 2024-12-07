import { useState, useCallback, useRef, useEffect } from 'react';
import CodeMirror, { ViewUpdate } from '@uiw/react-codemirror';
import init, { Renderer, canCompile } from '../pkg/kov_ray_wasm';

import { Button, LoadingButton } from '@/components/ui/button';
import { CORNELL_BOX_SCRIPT, BEAUTIFUL_BALLS_SCRIPT } from './scripts';
import { ArrowDownToLine } from 'lucide-react';

const NUM_WORKERS = 20;
function App() {
  const [value, setValue] = useState(BEAUTIFUL_BALLS_SCRIPT);
  const [errorMsg, setErrorMsg] = useState('');
  const [wasmInitialized, setWasmInitialized] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [alreadyRendered, setAlreadyRendered] = useState(false);
  const [neverRendered, setNeverRendered] = useState(true);

  const updateValue = (val: string) => {
    setValue(val);
  };

  const loadScript = (script: 'cornell_box' | 'beautiful_balls') => {
    if (script === 'cornell_box') {
      updateValue(CORNELL_BOX_SCRIPT);
    } else if (script === 'beautiful_balls') {
      updateValue(BEAUTIFUL_BALLS_SCRIPT);
    }
  };

  const onChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (val: string, _viewUpdate: ViewUpdate) => {
      updateValue(val);
      if (!wasmInitialized) return;
      try {
        canCompile(val);
        setErrorMsg('');
      } catch (error) {
        setErrorMsg(String(error));
      }
    },
    [wasmInitialized],
  );

  useEffect(() => {
    init().then(() => {
      setWasmInitialized(true);
    });
  }, []);

  const [workers, setWorkers] = useState<Worker[]>([]);

  const prepareWorkers = useCallback((): Worker[] => {
    const tempWorkers = [];
    for (let i = 0; i < NUM_WORKERS; i++) {
      tempWorkers.push(new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }));
    }
    return tempWorkers;
  }, []);

  useEffect(() => {
    setWorkers(prepareWorkers());
  }, [prepareWorkers]);

  const handleCancel = () => {
    workers.forEach((worker) => {
      worker.terminate();
    });
    setWorkers(prepareWorkers());
    setIsRendering(false);
  };

  const handleRender = () => {
    if (!wasmInitialized || !previewRef.current || !previewWrapperRef.current) return;
    const canvas = previewRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setNeverRendered(false);
    setIsRendering(true);
    setAlreadyRendered(false);
    let currentRow = 0;
    const start = performance.now();

    const renderer = new Renderer(value);
    const imageWidth = renderer.getWidth();
    const imageHeight = renderer.getHeight();
    const aspectRatio = imageWidth / imageHeight;

    const preview = previewRef.current!;
    const width = preview.offsetWidth;
    const height = preview.offsetHeight;
    preview.width = width;
    preview.height = height;

    const rendererJsons = renderer.serializeRenderer();
    for (let id = 0; id < NUM_WORKERS; id++) {
      const worker = workers[id];
      worker.postMessage({ rendererJsons, id, numWorkers: NUM_WORKERS });
      worker.onmessage = function (event) {
        const { row, rowData } = event.data;
        if (width >= imageWidth) {
          const imageData = ctx.createImageData(imageWidth, 1);
          const previewHeight = Math.floor(imageWidth / aspectRatio);
          for (let i = 0; i < imageWidth; i++) {
            const idx = i * 4;
            imageData.data[idx] = rowData[3 * i]; // red
            imageData.data[idx + 1] = rowData[3 * i + 1]; // green
            imageData.data[idx + 2] = rowData[3 * i + 2]; // blue
            imageData.data[idx + 3] = 255; // alpha
          }
          const wOffset = Math.floor((width - imageWidth) / 2);
          const hOffset = Math.floor((height - previewHeight) / 2);
          ctx.putImageData(imageData, wOffset, hOffset + row);
        } else {
          const imageData = ctx.createImageData(width, 1);
          const previewHeight = Math.floor(width / aspectRatio);
          const rowRatio = imageHeight / previewHeight;
          for (let i = 0; i < width; i++) {
            const idx = i * 4;
            const offset = Math.floor((imageWidth * i) / width);
            imageData.data[idx] = rowData[3 * offset]; // red
            imageData.data[idx + 1] = rowData[3 * offset + 1]; // green
            imageData.data[idx + 2] = rowData[3 * offset + 2]; // blue
            imageData.data[idx + 3] = 255; // alpha
          }
          const quotient = Math.floor(row / rowRatio);
          const hOffset = (height - previewHeight) / 2;
          if (rowRatio <= 1) {
            ctx.putImageData(imageData, 0, hOffset + row);
          } else if (Math.floor(rowRatio * quotient) === row) {
            ctx.putImageData(imageData, 0, hOffset + quotient);
          } else if (Math.floor(rowRatio * (quotient + 1)) === row) {
            ctx.putImageData(imageData, 0, hOffset + quotient + 1);
          }
        }
        currentRow++;
        if (currentRow >= imageHeight) {
          const end = performance.now();
          console.log(`Rendering time: ${end - start}ms`);
          console.log('Rendering completed');
          setIsRendering(false);
          setAlreadyRendered(true);
        }
      };
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] grid grid-rows-[3rem_1fr]">
      <div className="h-12 px-4 grid grid-cols-3 border-b-2 border-gray-400">
        <div></div>
        <div>
          <div className="h-12 flex items-center justify-center font-extrabold">
            KOV-Ray Play Ground
          </div>
        </div>
        <div className="flex justify-end items-center gap-2">
          <Button size="icon" variant="outline" disabled={alreadyRendered}>
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

      <div className="flex">
        <div className="h-[100%] w-[50%] border-r-2 border-gray-400 box-border">
          <div className="h-8 border-gray-400 border-b-2 grid grid-cols-[5rem_1fr] box-border">
            <div className="text-right pl-8 flex items-center">Source</div>
            <div className=" px-1 h-8">
              {errorMsg && (
                <div className="text-red-600 h-8 flex items-center justify-end">{errorMsg}</div>
              )}
            </div>
          </div>
          <div className="h-12 flex items-center gap-4 px-4 border-b-2 border-gray-400">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadScript('beautiful_balls');
              }}
            >
              Beautiful Balls
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadScript('cornell_box');
              }}
            >
              Cornell Box
            </Button>
          </div>
          <div className="overflow-hidden">
            <CodeMirror
              height="calc(100vh - 8rem)"
              width="50vw"
              value={value}
              // extensions={[javascript({ jsx: true })]}
              onChange={onChange}
              // theme="dark"
            />
          </div>
        </div>
        <div ref={previewWrapperRef} className="relative text-center w-[50%]">
          {neverRendered && (
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-0">
              Image Preview Here
            </div>
          )}
          <canvas
            ref={previewRef}
            className="m-[1rem] h-[calc(100%-2rem)] w-[calc(100%-2rem)] z-10"
          ></canvas>
        </div>
      </div>
      <canvas className="hidden"></canvas>
    </div>
  );
}

export default App;
