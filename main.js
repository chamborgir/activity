import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
const ground = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 2, 2), material);
scene.add(ground);
ground.rotation.x = -Math.PI * 0.5;
ground.position.y = -0.5;

//low stage
const stage = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 2.75), material);
stage.position.z = -1;
stage.position.y = -0.35;
scene.add(stage);

//stairs 1
const stairs1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.15, 0.25),
    material
);
stairs1.position.set(-2, -0.425, 0.5);

const stairs2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.15, 0.25),
    material
);
stairs2.position.set(2, -0.425, 0.5);

scene.add(stairs1, stairs2);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);
directionalLight.position.set(1, 0.25, 0);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

const spotlight = new THREE.SpotLight(0xffff00, 5, 20, Math.PI * 0.05, 0.25, 1);
spotlight.castShadow = true;
spotlight.position.z = 2;
spotlight.position.y = 3;
scene.add(spotlight);

const spotLightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotLightHelper);

//camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
); // Add near and far clipping planes
camera.position.set(1, 1, 2);
scene.add(camera);

// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high-DPI displays

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
