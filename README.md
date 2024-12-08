# KOV-Ray-wasm (KOV-Ray Playground)

This is playground for [KOV-Ray](https://github.com/SNKK62/KOV-Ray) project.

In this project, KOV-Ray is compiled to WebAssembly and run in browser.

See [Playground](https://snkk62.github.io/KOV-Ray-wasm/).

## Build

```bash
wasm-pack build --release --target web --out-dir web/pkg

# remove .gitignore
rm web/pkg/.gitignore

# build react app
cd web
npm install
npm run build
```

## Run dev server

```bash
cd web
npm install
npm run dev
```
