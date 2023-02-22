import './style.css'
//import * as THREE from "../node_modules/three/build/three.module.js"
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import SceneInit from "./lib/SceneInit";
import Planet from "./lib/Planet";
import Rotation from "./lib/Rotation";

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}




function spice(){
    console.log("spice function entered")
    $.ajax({
      url:'http://127.0.0.1:5000/calc ',
      type: 'GET',
      dataType:'JSON',
      METAKR:'getsa.tm',
      target:'EARTH',
      obs:'CASSINI',
      utctim:'2004 jun 11 19:32:00',
      success:function(data){
        alert(data.x + " "+ data.y + " "+ data.z);
      },
      error:function(xhr,status,error){
        var errorMessage = xhr.status + ':' + xhr.statusText
        alert('Error - ' + errorMessage);
      }
    }); 
}
window.spice = spice;


const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

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

// function to add buttons to collapsible
function addButtons(objects, id) {
  var buttonsContainer = document.getElementById(id);
  objects.forEach(function(objects) {
    var button = document.createElement("button");
    button.innerHTML = objects;
    button.type = "button";
    button.classList.add("collapsible");

    // create content div
    var content = document.createElement("div");
    content.classList.add("content");

    // create pin checkbox
    var pinCheckbox = document.createElement("input");
    pinCheckbox.type = "checkbox";
    pinCheckbox.id = "pin_checkbox";
    pinCheckbox.checked = false;
    pinCheckbox.classList.add("pinCheckbox");
    pinCheckbox.addEventListener("click", function() {
      var parent = button.parentNode;
      var parent_content = content.parentNode;
      if (this.checked) {
        button.classList.add("pinned");
      } else {
        button.classList.remove("pinned");
      }
      if (this.checked){
        // send it to the top of the list 
        parent_content.removeChild(content);
        parent.removeChild(button);
        parent_content.insertBefore(content, parent_content.firstChild)
        parent.insertBefore(button, parent.firstChild);
      }else{
        // send it to the bottom of the list 
        parent_content.removeChild(content);
        parent.removeChild(button);
        parent.appendChild(button, parent.firstChild);
        parent_content.appendChild(content, parent_content.firstChild)
      }
    });
    var label = document.createElement("label");
    label.htmlFor = "pin_checkbox";
    label.innerHTML = " Pin";
    content.appendChild(pinCheckbox);
    content.appendChild(label);
    content.appendChild(document.createElement("br"));

    // add checkboxes to content div
    // BODY
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "env_body";
    checkbox.value = "Body";
    checkbox.name = "showBody";
    checkbox.checked = true;
    var label = document.createElement("label");
    label.htmlFor = "env_body";
    label.innerHTML = " Body";
    content.appendChild(checkbox);
    content.appendChild(label);
    content.appendChild(document.createElement("br"));
    
    // TRAJECTORY
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "env_traj";
    checkbox.value = "Trajectory";
    checkbox.name = "showTraj";
    checkbox.checked = true;
    var label = document.createElement("label");
    label.htmlFor = "env_traj";
    label.innerHTML = " Show Trajectory";
    content.appendChild(checkbox);
    content.appendChild(label);
    content.appendChild(document.createElement("br"));
    
    // SPEED GRADIENT
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "env_grad";
    checkbox.value = "Gradient";
    checkbox.name = "showGrab";
    checkbox.checked = true;
    var label = document.createElement("label");
    label.htmlFor = "env_grad";
    label.innerHTML = " Speed Gradient";
    content.appendChild(checkbox);
    content.appendChild(label);
    content.appendChild(document.createElement("br"));

    // add button and content to the document
    buttonsContainer.appendChild(button);
    buttonsContainer.appendChild(content);

      // add event listener to button
    button.addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  });
}

// example data for buttons
var objects = ["Earth", "Mars", "Jupyter", "Saturn", "Venus"];
var missions = ["Mars Mission", "Apollo I", "Apollo II"];

// call function to add buttons to collapsible
addButtons(objects, "objects");
addButtons(missions, "missions");

function filterObjects() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("objects");
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

//console tests
//console.log(images['sun.jpeg'].default);
//console.log(images);

// Scene
//const scene = new THREE.Scene()
let test = new SceneInit();
test.initScene();
test.animate();

// Objects

// Radius,Hight, width
const sunGeometry = new THREE.SphereGeometry(8);
//const sunTexture = new THREE.TextureLoader().load('./mercury.png');
const sunTexture = new THREE.TextureLoader().load(images['sun.jpg'].default);

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
const mercury = new Planet(2, 16, images['mercury.png'].default);
const mercuryMesh = mercury.getMesh();
let mercurySystem = new THREE.Group();
mercurySystem.add(mercuryMesh);

const venus = new Planet(3, 32, images['venus.jpg'].default);
const venusMesh = venus.getMesh();
let venusSystem = new THREE.Group();
venusSystem.add(venusMesh);

const earth = new Planet(4, 48, images['earth.jpg'].default);
const earthMesh = earth.getMesh();
let earthSystem = new THREE.Group();
earthSystem.add(earthMesh);

const mars = new Planet(3, 64, images['mars.jpg'].default);
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
