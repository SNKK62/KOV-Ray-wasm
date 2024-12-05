use kov_ray_wasm::Renderer;

fn main() {
    let input = r"
        Camera {
        lookfrom: <278, 278, -800>,
        lookat: <278, 278, 0>,
        dist_to_focus: 10,
        angle: 40,
    }

    RED = <165.75, 12.75, 12.75>;
    GRAY = <186.15, 186.15, 186.15>;
    GREEN = <30.60, 114.75, 38.25>;
    WHITE = <255, 255, 255>;
    BLACK = <0, 0, 0>;

    Config {
        width: 200,
        height: 200,
        samples_per_pixel: 100,
        max_depth: 100,
    }

    // YZRect
    Plane {
        vertex: (<555, 0, 0>, <555, 555, 555>),
        material: Lambertian(Solid(GREEN)),
    }

    // YZRect
    Plane {
        vertex: (<0, 0, 0>, <0, 555, 555>),
        material: Lambertian(Solid(RED)),
    }

    // XZRect
    Plane {
        vertex: (<213, 554, 227>, <343, 554, 332>),
        material: Light(WHITE, 15),
    }

    // XZRect
    Plane {
        vertex: (<0, 0, 0>, <555, 0, 555>),
        material: Lambertian(Solid(GRAY)),
    }

    // XZRect
    Plane {
        vertex: (<0, 555, 0>, <555, 555, 555>),
        material: Lambertian(Solid(GRAY)),
    }

    // XYRect
    Plane {
        vertex: (<0, 0, 555>, <555, 555, 555>),
        material: Lambertian(Solid(GRAY)),
    }

    Box {
        vertex: (<0, 0, 0>, <165, 330, 165>),
        material: Lambertian(Solid(GRAY)),
        rotateY: 15,
        translate: <265, 0, 295>,
    }

    Box {
        vertex: (<0, 0, 0>, <165, 165, 165>),
        material: Lambertian(Solid(GRAY)),
        rotateY: -18,
        translate: <130, 0, 65>,
    }
    ";
    //     let input = r"
    //     Camera {
    //     lookfrom: <278, 278, -800>,
    //     lookat: <278, 278, 0>,
    //     dist_to_focus: 10,
    //     angle: 40,
    // }
    //
    // RED = <165.75, 12.75, 12.75>;
    // GRAY = <186.15, 186.15, 186.15>;
    // GREEN = <30.60, 114.75, 38.25>;
    // WHITE = <255, 255, 255>;
    // BLACK = <0, 0, 0>;
    //
    // Config {
    //     width: 200,
    //     height: 200,
    //     samples_per_pixel: 100,
    //     max_depth: 100,
    //     background: WHITE,
    // }
    //
    // Sphere {
    //     center: <278, 278, 0>,
    //     radius: 10,
    //     material: Lambertian(Solid(RED)),
    // }";
    let mut renderer = Renderer::new(input);
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
