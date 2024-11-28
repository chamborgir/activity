import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//texture loader
const textureLoader = new THREE.TextureLoader();
//FLOOR textures
const floorTexture = textureLoader.load("./floor/wood_floor_diff_4k.jpg");
const floorDispTexture = textureLoader.load("./floor/wood_floor_disp_4k.png");
const floorNorTexture = textureLoader.load("./floor/wood_floor_nor_gl_4k.exr");
const floorRogTexture = textureLoader.load("wood_floor_rough_4k.exr");
// STAGE textures
const stageTexture = textureLoader.load("./stage/oak_veneer_01_diff_4k.jpg");
const stageAoTexture = textureLoader.load("./stage/oak_veneer_01_ao_4k.jpg");
const stageDispTexture = textureLoader.load(
    "./stage/oak_veneer_01_disp_4k.png"
);
const stageNorTexture = textureLoader.load(
    "./stage/oak_veneer_01_nor_gl_4k.exr"
);
const stageRogTexture = textureLoader.load(
    "./stage/oak_veneer_01_rough_4k.exr"
);
// STAIRS Texture
const stairsTexture = textureLoader.load("./stairs/plywood_diff_4k.jpg");
const stairsNorTexture = textureLoader.load("./stairs/plywood_nor_gl_4k.exr");
const stairsRogTexture = textureLoader.load("./stairs/plywood_rough_4k.exr");

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

//scene
const scene = new THREE.Scene();

// objects
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

//ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5, 2, 2),
    new THREE.MeshStandardMaterial({
        map: floorTexture,
        displacementMap: floorDispTexture,
        displacementScale: 0.1,
        normalMap: floorNorTexture,
        roughnessMap: floorRogTexture,
    })
);
scene.add(ground);
ground.rotation.x = -Math.PI * 0.5;
ground.position.y = -0.5;
ground.receiveShadow = true;

//low stage
const stage = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.3, 3),
    new THREE.MeshStandardMaterial({
        map: stageTexture,
    })
);
stage.position.z = -1;
stage.position.y = -0.35;
stage.receiveShadow = true;
scene.add(stage);

//stairs
const stairs1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.15, 1),
    new THREE.MeshStandardMaterial({
        map: stairsTexture,
        normalMap: stairsNorTexture,
        roughnessMap: stairsRogTexture,
    })
);
stairs1.position.set(-2, -0.425, 0.35);
stairs1.castShadow = true;

const stairs2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.15, 1),
    new THREE.MeshStandardMaterial({
        map: stairsTexture,
        normalMap: stairsNorTexture,
        roughnessMap: stairsRogTexture,
    })
);
stairs2.position.set(2, -0.425, 0.35);
stairs2.castShadow = true;

scene.add(stairs1, stairs2);

// microphone
const micRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 1.75),
    material
);

const micBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.15, 0.05),
    material
);
micBase.position.y = -0.175;

const micBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.025, 0.15),
    material
);
micBody.rotateX(2);
micBody.position.y = 0.875;

const micHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 32, 32),
    material
);
micHead.position.y = 0.9;
micHead.position.z = -0.05;

micRod.castShadow = true;
micBase.castShadow = true;
micBody.castShadow = true;
micHead.castShadow = true;
scene.add(micRod, micBase, micBody, micHead);

//LIGHT
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
// scene.add(directionalLight);
// directionalLight.position.set(1, 0.25, 0);

const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
scene.add(ambientLight, moonLight);

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

const spotlight = new THREE.SpotLight(0xffff00, 10, 20, Math.PI * 0.05, 0.5, 1);
spotlight.castShadow = true;
spotlight.position.z = 4;
spotlight.position.y = 5;
spotlight.position.x = 2;
spotlight.castShadow = true;
scene.add(spotlight);

const spotLightHelper = new THREE.SpotLightHelper(spotlight);
// scene.add(spotLightHelper);

const rectAreaLight1 = new THREE.RectAreaLight(0x4e00ff, 2, 0.75, 1);
const rectAreaLight2 = new THREE.RectAreaLight(0x4e00ff, 2, 0.75, 1);

rectAreaLight1.position.set(-2, 0, 0.825);
rectAreaLight2.position.set(2, 0, 0.825);
scene.add(rectAreaLight1, rectAreaLight2);

//camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
); // Add near and far clipping planes
camera.position.set(1.5, 1, 2);
scene.add(camera);

// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high-DPI displays
renderer.shadowMap.enabled = true;

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Resize Handling
window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera aspect ratio
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
const animate = () => {
    // Update controls for smooth damping
    controls.update();

    // Render the scene
    renderer.render(scene, camera);

    // Request the next frame
    requestAnimationFrame(animate);
};

// Start animation loop
animate();
