import init, { Renderer } from '../pkg/kov_ray_wasm';

self.onmessage = async (event) => {
  await init();
  const { rendererJsons, id, numWorkers } = event.data;
  const [worldJson, configJson, cameraJson] = rendererJsons;
  const renderer = Renderer.fromJSON(worldJson, configJson, cameraJson);

  const rowsPerWorker = Math.floor(renderer.getHeight() / numWorkers);
  const surplus = renderer.getHeight() % numWorkers;
  const extraRows = id < surplus ? 1 : 0;

  for (let _row = 0; _row < rowsPerWorker + extraRows; _row++) {
    const row = _row * numWorkers + id;
    const rowData = renderer.renderRow(row);
    self.postMessage({ row, rowData });
  }
};
