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

// $.ajaxSetup({
//   type: "GET",
//   data: {},
//   dataType: 'json',
//   xhrFields: {
//      withCredentials: true
//   },
//   crossDomain: true,
//   contentType: 'application/json; charset=utf-8'
// });


function spice(target_, obs_, utctim_ ){
    console.log("spice function entered")
    var newCoordinates = []; //new coordinates
    $.ajax({
      url:'https://spice-api.herokuapp.com/orbits',
      type: 'GET',
      dataType:'JSON',
      METAKR:'getsa.tm',
      target:'EARTH',
      obs:'CASSINI',
      utctim:'2004 jun 11 19:32:00',
      success:function(data){
        alert(data.x + " "+ data.y + " "+ data.z);
        newCoordinates[0] = data.x;
        newCoordinates[1] = data.y;
        newCoordinates[2] = data.z;
      },
      error:function(xhr,status,error){
        var errorMessage = xhr.status + ':' + xhr.statusText
        alert('Error - ' + errorMessage);
      }
    }); 
    return newCoordinates;
}
window.spice = spice;

//makes an ajax call to ask for planet data
//includes a promise so that the next function waits for data



function ajax_call(target){
  return new Promise((resolve,reject) => {
    $.ajax({
      url:'https://spice-api.herokuapp.com/orbits?planet='+target,
      type: 'GET',
      dataType:'JSON',
      crossDomain: true,
      planet:target,
      success:function(data){
        resolve(data);
      },
      error:function(xhr,status,error){
        var errorMessage = xhr.status + ':' + xhr.statusText
        reject(data);
        alert('Error - ' + errorMessage);
      }
    })
  })
}




//takes data from ajax call and returns the coordinates
function spice_orbit(data){
    console.log("spice orbit function entered")
    var newCoordinates = new Array(); //new coordinates
    newCoordinates = [data.x,data.y,data.z];
    console.log("Planet Coords",newCoordinates);
    return newCoordinates;
}
window.spice_orbit = spice_orbit;

function ajax_planets(){
  var bodlist;
  return new Promise((resolve,reject) => {
    $.ajax({
      url:'https://spice-api.herokuapp.com/get_body?kernels=kernels/981005_PLTEPH-DE405S.bsp',
      type: 'GET',
      dataType:'JSON',
      crossDomain: true,
      success:function(data){
        resolve(data);
      },
      error:function(xhr,status,error){
        var errorMessage = xhr.status + ':' + xhr.statusText
        reject(data);
        alert('Error - ' + errorMessage);
      }
    })
  })
}


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

// Scene
//const scene = new THREE.Scene()
let test = new SceneInit();
test.initScene();
test.animate();

// Objects

// Radius,Hight, width
const sunGeometry = new THREE.SphereGeometry(0.00465047);
//scaled up sun for visiblity
//const sunGeometry = new THREE.SphereGeometry(0.265047);
const sunTexture = new THREE.TextureLoader().load(images['sun.jpg'].default);
// Materials
const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});

//sun halo, uses code from planet class, can be cleaned up later
var resolution = 15 * 50; // segments in the line
var length = 360 / resolution;
var orbitLine = new THREE.BufferGeometry();
var material = new THREE.LineBasicMaterial({
  color: 'gold',
  linewidth: 1,
  fog: true
});
// Build the orbit line
const positions1 = [];
const positions2 = [];
for (var i = 0; i <= resolution; i++) {
  var segment = (i * length) * Math.PI / 180;
  var orbitAmplitude = 0.00465047 * 30;

  positions1.push(
      Math.cos(segment) * orbitAmplitude,
      0,
      Math.sin(segment) * orbitAmplitude
  );
  positions2.push(
    Math.cos(segment) * orbitAmplitude,
    Math.sin(segment) * orbitAmplitude,
    0
  );
}
const positions = positions1.concat(positions2);

orbitLine.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
//orbitLine.computeBoundingSphere();
var sunHalo = new THREE.Line(orbitLine, material);
sunHalo.position.set(0, 0, 0);

// Mesh

const sunMesh = new THREE.Mesh(sunGeometry,sunMaterial);
const solarSystem = new THREE.Group();
solarSystem.add(sunMesh);
solarSystem.add(sunHalo);
test.scene.add(solarSystem);

const starTexture = new THREE.TextureLoader().load(images['galaxy.jpg'].default);
test.scene.background = starTexture;

//array of all planet objects
const planets = [];
//planets
function add_planet(name){
  //makes ajax call with planet name
  ajax_call(name)
  //if data received then adds planet
    .then((data) => {
      console.log(name);
      var newCoordinates = spice_orbit(data)
      //used default radius need to add dynamically
      //creates new planet object
      var planet = new Planet(7000, newCoordinates[0], newCoordinates[1], newCoordinates[2],name);
      planets.push(planet);
      var planetMesh = planet.getMesh();
      var system = new THREE.Group();
      system.add(planetMesh);
      //system.add(planet.orbit);
      system.add(planet.halo);
      test.scene.add(system);
    })
    .catch((error) => {
      console.log(error)
    })
}
(async () => {
  var objects = [];
  var temp = await(ajax_planets());
  console.log(temp);
  // gets rid of baycenter
  for(let i = 0; i < temp.length; i++) {
      if(temp[i].search("BARYCENTER") < 0 && temp[i] != "SUN"){
          objects.push(temp[i]);
      }
    }
  console.log(objects);
  //add planets 
  for(let x = 0; x < objects.length; x++){
    add_planet(objects[x]);
  }
})();
// var objects = await(ajax_planets());


// for(let i = 0; i < objects.length; i++) {
//   add_planet(objects[i]);
// }
//adds planets to solar system

// add_planet("MERCURY");
// add_planet("VENUS");
// add_planet("EARTH");
// add_planet("MARS");
// add_planet("SATURN");



//add_planet("JUPITER");
//shows list of planets
console.log(planets);

//old shit, doesnt work
/*var newCoordinates = spice_orbit("MERCURY");
const mercury = new Planet(1516, newCoordinates[0], newCoordinates[1], newCoordinates[2], images['mercury.png'].default);
const mercuryMesh = mercury.getMesh();
let mercurySystem = new THREE.Group();
mercurySystem.add(mercuryMesh);
mercurySystem.add(mercury.orbit);
mercurySystem.add(mercury.halo);*/

//var newCoordinates = spice_orbit("VENUS");
/*const venus = new Planet(3760.4, newCoordinates[0], newCoordinates[1], newCoordinates[2], images['venus.jpg'].default);
const venusMesh = venus.getMesh();
let venusSystem = new THREE.Group();
venusSystem.add(venusMesh);
venusSystem.add(venus.orbit);
venusSystem.add(venus.halo);

//var newCoordinates = spice_orbit("EARTH");
const earth = new Planet(3958.8, newCoordinates[0],newCoordinates[1], newCoordinates[2], images['earth.jpg'].default);
console.log(newCoordinates);
const earthMesh = earth.getMesh();
let earthSystem = new THREE.Group();
earthSystem.add(earthMesh);
earthSystem.add(earth.orbit);
earthSystem.add(earth.halo);

//var newCoordinates = spice_orbit("MARS");
const mars = new Planet(2106.1, newCoordinates[0], newCoordinates[1], newCoordinates[2], images['mars.jpg'].default);
const marsMesh = mars.getMesh();
let marsSystem = new THREE.Group();
marsSystem.add(marsMesh);
marsSystem.add(mars.orbit);
marsSystem.add(mars.halo);

//var newCoordinates = spice_orbit("JUPITER");
const jupiter = new Planet(43441, newCoordinates[0], newCoordinates[1], newCoordinates[2], images['jupiter.jpg'].default);
const jupiterMesh = jupiter.getMesh();
let jupiterSystem = new THREE.Group();
jupiterSystem.add(jupiterMesh);
jupiterSystem.add(jupiter.orbit);
jupiterSystem.add(jupiter.halo);

//var newCoordinates = spice_orbit("SATURN");
const saturn = new Planet(36184, newCoordinates[0], newCoordinates[1], newCoordinates[2], images['saturn.jpg'].default);
const saturnMesh = saturn.getMesh();
let saturnSystem = new THREE.Group();
saturnSystem.add(saturnMesh);
saturnSystem.add(saturn.orbit);
saturnSystem.add(saturn.halo);

//var newCoordinates = spice_orbit("URANUS");
const uranus = new Planet(15759, newCoordinates[0], newCoordinates[1], newCoordinates[2], images['uranus.jpg'].default);
const uranusMesh = uranus.getMesh();
let uranusSystem = new THREE.Group();
uranusSystem.add(uranusMesh);
uranusSystem.add(uranus.orbit);
uranusSystem.add(uranus.halo);

//var newCoordinates = spice_orbit("NEPTUNE");
const neptune = new Planet(15299, newCoordinates[0], newCoordinates[1], newCoordinates[2], images['neptune.jpg'].default);
const neptuneMesh = neptune.getMesh();
let neptuneSystem = new THREE.Group();
neptuneSystem.add(neptuneMesh);
neptuneSystem.add(neptune.orbit);
neptuneSystem.add(neptune.halo);

//var newCoordinates = spice_orbit("PLUTO");
const pluto = new Planet(738.38, newCoordinates[0], newCoordinates[1], newCoordinates[2], images['pluto.jpg'].default);
const plutoMesh = pluto.getMesh();
let plutoSystem = new THREE.Group();
plutoSystem.add(plutoMesh);
plutoSystem.add(pluto.orbit);
plutoSystem.add(pluto.halo);

//add all planaets to solarsystem
solarSystem.add(mercurySystem,venusSystem, earthSystem, marsSystem, jupiterSystem, saturnSystem, uranusSystem, neptuneSystem, plutoSystem);
*/
//add all planaets to solarsystem
//solarSystem.add(mercurySystem);


/*const mercuryRotation = new Rotation(mercuryMesh);
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
const jupiterRotation = new Rotation(jupiterMesh);
const jupiterRotationMesh = jupiterRotation.getMesh();
jupiterSystem.add(jupiterRotationMesh);

const saturnRotation = new Rotation(saturnMesh);
const saturnRotationMesh = saturnRotation.getMesh();
saturnSystem.add(saturnRotationMesh);

const uranusRotation = new Rotation(uranusMesh);
const uranusRotationMesh = uranusRotation.getMesh();
uranusSystem.add(uranusRotationMesh);

const neptuneRotation = new Rotation(neptuneMesh);
const neptuneRotationMesh = neptuneRotation.getMesh();
neptuneSystem.add(neptuneRotationMesh);

const plutoRotation = new Rotation(plutoMesh);
const plutoRotationMesh = plutoRotation.getMesh();
plutoSystem.add(plutoRotationMesh);*/

// NOTE: Add solar system mesh GUI.
//await initGui();
/*const solarSystemGui = gui.addFolder("solar system");
solarSystemGui.add(mercuryRotationMesh, "visible").name("mercury").listen();
solarSystemGui.add(venusRotationMesh, "visible").name("venus").listen();
solarSystemGui.add(earthRotationMesh, "visible").name("earth").listen();
solarSystemGui.add(marsRotationMesh, "visible").name("mars").listen();
solarSystemGui.add(jupiterRotationMesh, "visible").name("jupiter").listen();
solarSystemGui.add(saturnRotationMesh, "visible").name("saturn").listen();
solarSystemGui.add(uranusRotationMesh, "visible").name("uranus").listen();
solarSystemGui.add(neptuneRotationMesh, "visible").name("neptune").listen();
solarSystemGui.add(plutoRotationMesh, "visible").name("pluto").listen();
// NOTE: Animate solar system at 60fps.
const EARTH_YEAR = 2 * Math.PI * (1 / 60) * (1 / 60);
const animate = () => {
  sunMesh.rotation.y += 0.001;
  mercurySystem.rotation.y += EARTH_YEAR * 4;
  venusSystem.rotation.y += EARTH_YEAR * 2;
  earthSystem.rotation.y += EARTH_YEAR;
  marsSystem.rotation.y += EARTH_YEAR * 0.5;
  jupiterSystem.rotation.y += EARTH_YEAR * .2;
  saturnSystem.rotation.y += EARTH_YEAR * .1;
  uranusSystem.rotation.y += EARTH_YEAR * .05;
  neptuneSystem.rotation.y += EARTH_YEAR * .025;
  plutoSystem.rotation.y += EARTH_YEAR * .025;
  requestAnimationFrame(animate);
};
animate();*/