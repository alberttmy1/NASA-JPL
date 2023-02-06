import './style.css'
import * as THREE from "../node_modules/three/build/three.module.js"
//import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import SceneInit from "./lib/SceneInit.js";
import Planet from "./lib/Planet.js";
import Rotation from "./lib/Rotation.js";

//app.use('/assets', express.static(path.join(__dirname, './assets')));

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("button");
  c = div.getElementsByTagName("div");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
      c[i].style.display = "";
    } else {
      a[i].style.display = "none";
      c[i].style.display = "none";
    }
  }
}

function filterFunction2() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput2");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown2");
  a = div.getElementsByTagName("button");
  c = div.getElementsByTagName("div");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
      c[i].style.display = "";
    } else {
      a[i].style.display = "none";
      c[i].style.display = "none";
    }
  }
}

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
//const scene = new THREE.Scene()
let test = new SceneInit();
test.initScene();
test.animate();

// Objects

// Radius,Hight, width
const sunGeometry = new THREE.SphereGeometry(8);
//TODO fix these shitty textures
const sunTexture = new THREE.TextureLoader().load('./sun.jpeg');

// const sunGeometry = new THREE.BoxGeometry(8,8,8)

// Materials

// const sunMaterial = new THREE.MeshStandardMaterial();
const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
// const sunMaterial = new THREE.MeshBasicMaterial();
// sunMaterial.color = new THREE.Color(0xff0000);


// Mesh

// const sunMesh = new THREE.Mesh(sunGeometry,sunMaterial)
const sunMesh = new THREE.Mesh(sunGeometry,sunMaterial);
const solarSystem = new THREE.Group();
solarSystem.add(sunMesh);
test.scene.add(solarSystem);


//planets
const mercury = new Planet(2, 16, "mercury.png");
const mercuryMesh = mercury.getMesh();
let mercurySystem = new THREE.Group();
mercurySystem.add(mercuryMesh);

const venus = new Planet(3, 32, "venus.jpeg");
const venusMesh = venus.getMesh();
let venusSystem = new THREE.Group();
venusSystem.add(venusMesh);

const earth = new Planet(4, 48, "earth.jpeg");
const earthMesh = earth.getMesh();
let earthSystem = new THREE.Group();
earthSystem.add(earthMesh);

const mars = new Planet(3, 64, "mars.jpeg");
const marsMesh = mars.getMesh();
let marsSystem = new THREE.Group();
marsSystem.add(marsMesh);
//add all planaets to solarsystem
solarSystem.add(mercurySystem,venusSystem, earthSystem, marsSystem);
//solarSystem.add(mercurySystem);

const mercuryRotation = new Rotation(mercuryMesh);
const mercuryRotationMesh = mercuryRotation.getMesh();
mercurySystem.add(mercuryRotationMesh);
const venusRotation = new Rotation(venusMesh);
const venusRotationMesh = venusRotation.getMesh();
venusSystem.add(venusRotationMesh);
const earthRotation = new Rotation(earthMesh);
const earthRotationMesh = earthRotation.getMesh();
earthSystem.add(earthRotationMesh);
const marsRotation = new Rotation(marsMesh);
const marsRotationMesh = marsRotation.getMesh();
marsSystem.add(marsRotationMesh);

// NOTE: Add solar system mesh GUI.
//await initGui();
const solarSystemGui = gui.addFolder("solar system");
solarSystemGui.add(mercuryRotationMesh, "visible").name("mercury").listen();
solarSystemGui.add(venusRotationMesh, "visible").name("venus").listen();
solarSystemGui.add(earthRotationMesh, "visible").name("earth").listen();
solarSystemGui.add(marsRotationMesh, "visible").name("mars").listen();

// NOTE: Animate solar system at 60fps.
const EARTH_YEAR = 2 * Math.PI * (1 / 60) * (1 / 60);
const animate = () => {
  sunMesh.rotation.y += 0.001;
  mercurySystem.rotation.y += EARTH_YEAR * 4;
  venusSystem.rotation.y += EARTH_YEAR * 2;
  earthSystem.rotation.y += EARTH_YEAR;
  marsSystem.rotation.y += EARTH_YEAR * 0.5;
  requestAnimationFrame(animate);
};
animate();

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
