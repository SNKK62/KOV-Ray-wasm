use kov_ray::{
    interpreter::{eval_ast, ConfigValue},
    parser::parse,
};
use ray_tracer_rs::{camera::Camera, hittable::HittableEnum, vec3::Color};
use wasm_bindgen::prelude::*;

use rand::Rng;

#[wasm_bindgen]
pub struct Renderer {
    world: HittableEnum,
    config: ConfigValue,
    camera: Camera,
}

#[wasm_bindgen]
impl Renderer {
    #[wasm_bindgen(constructor)]
    pub fn new(input: &str) -> Renderer {
        let ast = parse(input).unwrap();
        let (world, config, camera) = eval_ast(&ast).unwrap();
        Renderer {
            world,
            config,
            camera,
        }
    }

    #[wasm_bindgen(js_name = "serializeRenderer")]
    pub fn serialize_renderer(&self) -> Vec<String> {
        vec![
            serde_json::to_string(&self.world).unwrap(),
            serde_json::to_string(&self.config).unwrap(),
            serde_json::to_string(&self.camera).unwrap(),
        ]
    }

    #[wasm_bindgen(js_name = "fromJSON")]
    pub fn deserialize_renderer(
        world_json: &str,
        config_json: &str,
        camera_json: &str,
    ) -> Renderer {
        Renderer {
            world: serde_json::from_str(world_json).unwrap(),
            config: serde_json::from_str(config_json).unwrap(),
            camera: serde_json::from_str(camera_json).unwrap(),
        }
    }

    #[wasm_bindgen(js_name = "getHeight")]
    pub fn get_height(&self) -> u32 {
        self.config.height as u32
    }

    #[wasm_bindgen(js_name = "getWidth")]
    pub fn get_width(&self) -> u32 {
        self.config.width as u32
    }

    #[wasm_bindgen(js_name = "renderRow")]
    pub fn render_row(&mut self, row: u32) -> Vec<u8> {
        let width = self.config.width.round() as u32;
        let height = self.config.height.round() as u32;
        let samples_per_pixel = self.config.samples_per_pixel.round() as usize;
        let max_depth = self.config.max_depth.round() as usize;
        let background = self.config.background;

        let mut rng = rand::thread_rng();

        let mut buffer = vec![0; (width * 3) as usize];

        for i in 0..width {
            let mut pixel_color = Color::zero();
            for _ in 0..samples_per_pixel {
                let u = (i as f64 + rng.gen_range(0.0..1.0)) / (width - 1) as f64;
                let v = ((height - row - 1) as f64 + rng.gen_range(0.0..1.0)) / (height - 1) as f64;
                let ray = self.camera.get_ray(u, v);
                pixel_color += ray.color(&background, &self.world, max_depth);
            }
            let (r, g, b) = pixel_color.get_color(samples_per_pixel as i64);
            buffer[(i * 3) as usize] = r;
            buffer[(i * 3 + 1) as usize] = g;
            buffer[(i * 3 + 2) as usize] = b;
        }

        buffer.to_vec()
    }
}

#[wasm_bindgen(js_name = "canCompile")]
pub fn can_compile(input: &str) -> Result<(), JsValue> {
    let ast = parse(input);
    if let Err(e) = ast {
        return Err(JsValue::from_str(&format!(
            "L{}:Syntax error",
            e.input.location_line()
        )));
    }
    let ast = ast.unwrap();
    let res = eval_ast(&ast);
    if res.is_err() {
        let res = res.as_ref().err().unwrap();
        match res.span {
            Some(span) => {
                return Err(JsValue::from_str(&format!(
                    "L{}:Compile error: {}",
                    span.location_line(),
                    res.message
                )));
            }
            None => {
                return Err(JsValue::from_str(&format!(
                    "Compile error: {}",
                    res.message
                )));
            }
        }
    };
    Ok(())
}
