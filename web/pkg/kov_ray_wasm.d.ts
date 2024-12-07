/* tslint:disable */
/* eslint-disable */
export function canCompile(input: string): void;
export class Renderer {
  free(): void;
  constructor(input: string);
  serializeRenderer(): (string)[];
  static fromJSON(world_json: string, config_json: string, camera_json: string): Renderer;
  getHeight(): number;
  getWidth(): number;
  renderRow(row: number): Uint8Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_renderer_free: (a: number, b: number) => void;
  readonly renderer_new: (a: number, b: number) => number;
  readonly renderer_serializeRenderer: (a: number, b: number) => void;
  readonly renderer_fromJSON: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly renderer_getHeight: (a: number) => number;
  readonly renderer_getWidth: (a: number) => number;
  readonly renderer_renderRow: (a: number, b: number, c: number) => void;
  readonly canCompile: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
