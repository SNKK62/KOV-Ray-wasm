export const BEAUTIFUL_BALLS_SCRIPT = `\
Camera {
    lookfrom: <13, 2, 3>,
    lookat: <0, 0, 0>,
    dist_to_focus: 10,
    angle: 20,
}

WIDTH = 512;
ASPECT_RATIO = 9 / 16;

Config {
    width: WIDTH,
    height: WIDTH * ASPECT_RATIO,
    samples_per_pixel: 50,
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
        center = <a + 0.9 * rand(), 0.2, b + 0.9 * rand()>;
        temp_vec = <4, 0.2, 0>;

        // distance between (4, 0.2, 0) and center
        length = len(center - temp_vec);

        if length > 0.9 {
            if choose_mat < 0.7 {
                ALBEDO = <255 * rand(), 255 * rand(), 255 * rand()>;
                Sphere {
                    center: center,
                    radius: radius,
                    material: Lambertian(Solid(ALBEDO)),
                }
            } else if choose_mat < 0.85 {
                ALBEDO = <255 * (0.5 + rand() / 2), 255 * (0.5 + rand() / 2), 255 * (0.5 + rand() / 2)>;
                fuzz = rand() / 2;
                Sphere {
                    center: center,
                    radius: radius,
                    material: Metal(ALBEDO, fuzz),
                }
            } else {
                Sphere {
                    center: center,
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
}
`;
