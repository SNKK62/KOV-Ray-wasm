use kov_ray_wasm::{can_compile, Renderer};

fn main() {
    let input = r"
Camera {
    lookfrom: <13, 2, 3>,
    lookat: <0, 0, 0>,
    dist_to_focus: 10,
    angle: 20,
}

Config {
    width: 512,
    height: 512 * 9 / 16,
    samples_per_pixel: 10,
    max_depth: 100,
    background: <255 * 0.5, 255 * 0.7, 255>,
}

GRAY = <127.5, 127.5, 127.5>;
// Ground
Sphere {
    center: <0.0, -1000.0, 0.0>,
    radius: 1000,
    material: Lambertian(Solid(GRAY)),
}

a = -11;
b = -11;

while a < 11 {
    b = -11; // init b
    while b < 11 {
        choose_mat = rand();
        radius = 0.2;
        center_x = a + 0.9 * rand();
        center_y = 0.2;
        center_z = b + 0.9 * rand();

        // distance between (4, 0.2, 0) and center
        length = sqrt(pow((center_x - 4), 2) + pow((center_y - radius), 2) + pow(center_z, 2));

        if length > 0.9 {
            if choose_mat < 0.7 {
                ALBEDO = <255 * rand(), 255 * rand(), 255 * rand()>;
                Sphere {
                    center: <center_x, center_y, center_z>,
                    radius: radius,
                    material: Lambertian(Solid(ALBEDO)),
                }
            } else if choose_mat < 0.85 {
                ALBEDO = <255 * (0.5 + rand() / 2), 255 * (0.5 + rand() / 2), 255 * (0.5 + rand() / 2)>;
                fuzz = rand() / 2;
                Sphere {
                    center: <center_x, center_y, center_z>,
                    radius: radius,
                    material: Metal(ALBEDO, fuzz),
                }
            } else {
                Sphere {
                    center: <center_x, center_y, center_z>,
                    radius: radius,
                    material: Dielectric(1.5),
                }
            }
        }
        b = b + 1;
    }
    a = a + 1;
}

Sphere {
    center: <0, 1, 0>,
    radius: 1,
    material: Dielectric(1.5),
}

Sphere {
    center: <-4.0, 1.0, 0>,
    radius: 1,
    material: Lambertian(Solid(<255 * 0.4, 255 * 0.2, 255 * 0.1>)),
}

Sphere {
    center: <4.0, 1.0, 0.0>,
    radius: 1,
    material: Metal(<255 * 0.7, 255 * 0.6, 255 * 0.5>, 0),

    ";
    if can_compile(input).is_err() {
        println!("Failed to parse input");
        return;
    }
    let renderer = Renderer::new(input);
    let jsons = renderer.serialize_renderer();
    let world_json = jsons[0].as_str();
    let config_json = jsons[1].as_str();
    let camera_json = jsons[2].as_str();
    let mut renderer = Renderer::deserialize_renderer(world_json, config_json, camera_json);
    println!("P3");
    println!("{} {}", renderer.get_width(), renderer.get_height());
    println!("255");

    for row in 0..renderer.get_height() {
        let res = renderer.render_row(row);

        for i in 0..renderer.get_width() {
            print!("{} ", res[i as usize * 3]);
            print!("{} ", res[i as usize * 3 + 1]);
            println!("{}", res[i as usize * 3 + 2]);
        }
    }
}
