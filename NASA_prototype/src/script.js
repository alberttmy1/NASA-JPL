import './style.css'
//import * as THREE from "../node_modules/three/build/three.module.js"
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import SceneInit from "./lib/SceneInit";
import Planet from "./lib/Planet";
import Rotation from "./lib/Rotation";

//imports images
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

//test spice function
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

//ajax call for all planet data
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

//loads images
const images = importAll(require.context('./assets', false, /\.(png|jpe?g|svg)$/));

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
let test = new SceneInit();
test.initScene();
test.animate();

// Objects

//SUN
const sunGeometry = new THREE.SphereGeometry(0.00465047);
//scaled up sun for visiblity
//const sunGeometry = new THREE.SphereGeometry(0.265047);
const sunTexture = new THREE.TextureLoader().load(images['sun.jpg'].default);
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

//adds planets to solar system
// add_planet("MERCURY");
// add_planet("VENUS");
// add_planet("EARTH");
// add_planet("MARS");
// add_planet("SATURN");

//add_planet("JUPITER");
//shows list of planets
console.log(planets);