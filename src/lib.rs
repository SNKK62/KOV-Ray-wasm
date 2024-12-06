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
    buffer: Vec<u8>,
}

#[wasm_bindgen]
impl Renderer {
    #[wasm_bindgen(constructor)]
    pub fn new(input: &str) -> Renderer {
        let ast = parse(input);
        if ast.is_err() {
            panic!("Error parsing input: {:?}", ast.err());
        }
        eprintln!("{:#?}", ast);
        let (world, config, camera) = eval_ast(&ast.unwrap());
        let width = config.width.round() as u32;
        let height = config.height.round() as u32;
        Renderer {
            world,
            config,
            camera,
            buffer: vec![0; (width * height * 3) as usize],
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
            buffer: vec![],
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

    #[wasm_bindgen(js_name = "getBuffer")]
    pub fn get_buffer(&self) -> Vec<u8> {
        self.buffer.clone()
    }

    #[wasm_bindgen(js_name = "renderRow")]
    pub fn render_row(&mut self, row: u32) -> Vec<u8> {
        let width = self.config.width.round() as u32;
        let height = self.config.height.round() as u32;
        let samples_per_pixel = self.config.samples_per_pixel.round() as usize;
        let max_depth = self.config.max_depth.round() as usize;
        let background = self.config.background;

        let mut rng = rand::thread_rng();

        for i in 0..width {
            let mut pixel_color = Color::zero();
            for _ in 0..samples_per_pixel {
                let u = (i as f64 + rng.gen_range(0.0..1.0)) / (width - 1) as f64;
                let v = ((height - row - 1) as f64 + rng.gen_range(0.0..1.0)) / (height - 1) as f64;
                let ray = self.camera.get_ray(u, v);
                pixel_color += ray.color(&background, &self.world, max_depth);
            }
            let (r, g, b) = pixel_color.get_color(samples_per_pixel as i64);
            self.buffer[(row * width * 3 + i * 3) as usize] = r;
            self.buffer[(row * width * 3 + i * 3 + 1) as usize] = g;
            self.buffer[(row * width * 3 + i * 3 + 2) as usize] = b;
        }

        self.buffer[(row * width * 3) as usize..((row + 1) * width * 3) as usize].to_vec()
    }
}

#[wasm_bindgen(js_name = "canParse")]
pub fn can_parse(input: &str) -> bool {
    parse(input).is_ok()
}
