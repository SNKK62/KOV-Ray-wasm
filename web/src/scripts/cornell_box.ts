export const CORNELL_BOX_SCRIPT = `LOOK_FROM = <278, 278, -800>;
LOOK_AT = <278, 278, 0>;

Camera {
    lookfrom: LOOK_FROM, // camera position
    lookat: LOOK_AT,
    dist_to_focus: 10,
    angle: 40,
}

RED = 255 * (<0.05, 0.05, 0.05> + <0.6, 0, 0>);
GRAY = <186.15, 186.15, 186.15>;
GREEN = <30.60, 114.75, 38.25>;
WHITE = <255, 255, 255>;
BLACK = <0, 0, 0>;

Config {
    width: 512,
    height: 512,
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
