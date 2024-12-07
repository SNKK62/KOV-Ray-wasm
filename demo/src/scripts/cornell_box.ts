export const CORNELL_BOX_SCRIPT = `Camera {
    lookfrom: <278, 278, -800>,
    lookat: <278, 278, 0>,
    dist_to_focus: 10,
    angle: 40,
}

RED = <165.75, 12.75, 12.75>;
GRAY = <186.15, 186.15, 186.15>;
GREEN = <30.60, 114.75, 38.25>;
WHITE = 255 * <1, 1, 1>;
BLACK = <0, 0, 0>;

Config {
    width: 400,
    height: 400,
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
`;
