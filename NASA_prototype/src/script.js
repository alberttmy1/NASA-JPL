import './style.css'
//import * as THREE from "../node_modules/three/build/three.module.js"
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import SceneInit from "./lib/SceneInit";
import Planet from "./lib/Planet";
import Rotation from "./lib/Rotation";
import {addButtons} from "./functions.js";

//imports images
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}


function uploadFile(form)
{
    const formData = new FormData(form);
    //var oOutput = document.getElementById("static_file_response");
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "https://spice-api.herokuapp.com/upload_static_file", true);
    oReq.onload = function(oEvent) {
        if (oReq.status == 200) {
            //oOutput.innerHTML = "Uploaded!";
            console.log(oReq.response);
        }
        else {
            oOutput.innerHTML = "Error occurred when trying to upload your file.<br \/>";
        }
    };
    //oOutput.innerHTML = "Sending file!";
    console.log("Sending file!")
    oReq.send(formData);
 }
 window.uploadFile = uploadFile;


//makes an ajax call to ask for planet data
//includes a promise so that the next function waits for data
function ajax_call(target,time){
  // var data;
  return new Promise((resolve,reject) => {
    $.ajax({
      url:'https://spice-api.herokuapp.com/pos?planet='+target+'&utc='+time,
      type: 'GET',
      dataType:'JSON',
      crossDomain: true,
      planet:target,
      utc:time,
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

function mission_ajax(mission, utc, len){
  return new Promise((resolve,reject) => {
    $.ajax({
      url:'https://spice-api.herokuapp.com/mission_pos?mission=' + mission + '&utc='+utc+'&length='+len,
      type: 'GET',
      dataType:'JSON',
      crossDomain: true,
      success:function(data){
        resolve(data)
        //alert(data.x + " "+ data.y + " "+ data.z);
      },
      error:function(xhr,status,error){
        var errorMessage = xhr.status + ':' + xhr.statusText
        alert('Error - ' + errorMessage);
      }
    })
  })
}
window.mission_data = mission_data;

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

// Listen for changes to the checkbox
var envBodyCheckbox = document.getElementById('env_body');
envBodyCheckbox.addEventListener('change', function() {
  if (this.checked) {
    // Set the background to an image if the checkbox is checked
    test.scene.background = starTexture;
  } else {
    // Set the background color to black if the checkbox is unchecked
    test.scene.clearColor = new THREE.Color(0x000000);
    test.scene.background = null;
  }
});

var envGradCheckbox = document.getElementById('env_grad');
envGradCheckbox.addEventListener('change', function() {
  for(let i=0; i<planets.length; i++){
    planets[i].update('grad');
  }
});

var envTragCheckbox = document.getElementById('env_traj');
envTragCheckbox.addEventListener('change', function() {
  for(let i=0; i<planets.length; i++){
    planets[i].update('trag');
  }
});

//array of all planet objects
const planets = [];
//this date changes planets+orbits
let date =new Date().toISOString();
//let date = '2020-04-13T03:39:06.747Z';
//planets
function add_planet(name,time){
  //makes ajax call with planet name
  ajax_call(name,time)
  //if data received then adds planet
    .then((data) => {
      //used default radius need to add dynamically
      //creates new planet object
      var planet = new Planet(data.r, data.x, data.y, data.z,name,test,time,false);
      planets.push(planet);

      // Listen for changes to the show/hide body checkbox
      var objBodyCheckbox = document.getElementById(name + '_body');
      objBodyCheckbox.addEventListener('change', function() {
        planet.update('body');
      });

      // Listen for changes to the show/hide trajectory checkbox
      var objTrajCheckbox = document.getElementById(name + '_traj');
      objTrajCheckbox.addEventListener('change', function() {
          planet.update('trag');
      });
      
      // Listen for changes to the show/hide trajectory checkbox
      var objGradCheckbox = document.getElementById(name + '_grad');
      objGradCheckbox.addEventListener('change', function() {
          planet.update('grad');
      });
    })
    .catch((error) => {
      console.log(error)
    })
}

//console.log(mission_data("APOLLO"));

(async () => {
  var objects = [];
  var temp = await(ajax_planets());
  //console.log(temp);
  // gets rid of baycenter
  for(let i = 0; i < temp.length; i++) {
      if(temp[i].search("BARYCENTER") >= 0 && temp[i] != "SUN"){
          objects.push(temp[i]);
      }
    }

  //add planets 
  for(let x = 0; x < objects.length; x++){
    add_planet(objects[x],date);
  }

  // call function to add buttons to collapsible
  addButtons(objects, "object_library", "pinned_objects", planets);
})();

function mission_data(mission,utc,len){
  let time = new Date().toISOString();
  //let time = '2005-02-13T03:39:06.747Z';
  mission_ajax(mission,time,len)
    .then((data) =>{
      console.log("yep",mission);
      var planet = new Planet(5000, data.x, data.y, data.z,mission,test,time,true);
    })
}
// get mission names from backend 
var missions_back = [];

var missions = ["APOLLO", "BEPICOLOMBO", "CASSINI","CHANDRA", 
"CLEMENTINE","CONTOUR","DART","DAWN","DEEPIMPACT","DS1","EUROPACLIPPER","EXOMARS2016","FIDO","GIOTTO","GLL","GNS","GRAIL",
"HAYABUSA", "HELIOS", "HST","INSIGHT","IUE","JUNO","JWST","LADEE","LPM","LRO","LUCY","LUNARORBITER",
"M01", "M10",  "M2", "M9", "MARS2020", "MAVEN", "MCO", "MER", "MESSENGER", "MEX", "MGN", "MGS", "MPF", "MPL", "MRO", 
"MSL", "MSR", "NEAR", "NEWHORIZONS", "NOZOMI", "ORX", "PHOBOS88", "PHOENIX", "PHSRM", "PIONEER10", "PIONEER11", "PIONEER12", 
"PIONEER6", "PIONEER8", "PSYCHE", "ROCKY7", "ROSETTA", "SDU", "SELENE", "SIRTF", "SMAP", "SMART1", "SPP", "STEREO", "TDRSS", 
"THEMIS", "ULYSSES", "VEGA", "VEX", "VIKING", "VOYAGER"]; 

addButtons(missions, "mission_library", "pinned_missions");