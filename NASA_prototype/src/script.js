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
function add_sun(){
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
}
const starTexture = new THREE.TextureLoader().load(images['2k_stars_milky_way.jpg'].default);
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

const slider = document.getElementById("myRange");
slider.oninput = function(){
  let ind = planets[0].pos.length - this.value - 1;
  let temp = new Date(currentDate.getTime());
  temp.setDate(temp.getDate()-(ind));
  let middleLabel = document.getElementById("middleScroll");
  middleLabel.innerHTML = temp.toUTCString();
  for(let i=0; i<planets.length; i++){
    planets[i].system.children[0].position.x = planets[i].pos[ind][0];
    planets[i].system.children[0].position.y = planets[i].pos[ind][1];
    planets[i].system.children[0].position.z = planets[i].pos[ind][2];
    planets[i].system.children[2].position.x = planets[i].pos[ind][0];
    planets[i].system.children[2].position.y = planets[i].pos[ind][1];
    planets[i].system.children[2].position.z = planets[i].pos[ind][2];
  } 
}


function update_slider(min,max,date){
  //updates slider to new dates
  let temp = new Date(date.getTime());
  temp.setDate(temp.getDate()-(max-min));
  slider.min = min;
  slider.max = max;
  slider.value = max;
  let leftLabel = document.getElementById("leftScroll");
  leftLabel.innerHTML = temp.toUTCString();
  let rightLabel = document.getElementById("rightScroll");
  rightLabel.innerHTML = date.toUTCString();
  let middleLabel = document.getElementById("middleScroll");
  middleLabel.innerHTML = date.toUTCString();
}

//planets
function add_planet(name,time,len){
  //makes ajax call with planet name
  ajax_call(name,time)
  //if data received then adds planet
    .then((data) => {
      //used default radius need to add dynamically
      //creates new planet object
      var planet = new Planet(data.r, data.x, data.y, data.z,name,test,time,false,len);
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
      
      // Listen for changes to the show/hide gradient checkbox
      var objGradCheckbox = document.getElementById(name + '_grad');
      objGradCheckbox.addEventListener('change', function() {
          planet.update('grad');
      });

      var planetNamesCheckbox = document.getElementById('planet_names');
      planetNamesCheckbox.addEventListener('change', function() {
        planet.planetLabel.visible = planetNamesCheckbox.checked;
      });

    })
    .catch((error) => {
      console.log(error)
    })
}

//loads in planets
function load_system(start,len){
  // create a tooltip element
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.zIndex = '1';
  tooltip.style.visibility = 'hidden';
  tooltip.style.backgroundColor = 'white';
  tooltip.style.padding = '5px';

  // add the tooltip element to the document body
  document.body.appendChild(tooltip);

  add_sun();
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
      add_planet(objects[x],start,len);
    }

    // call function to add buttons to collapsible
    addButtons(objects, "object_library", "pinned_objects", planets);
  })();
}
//removes planets
function clean_system(){
  test.scene.remove.apply(test.scene, test.scene.children);
  while(planets.length > 0){
    planets.pop();
  }

  const labels = document.querySelectorAll('#planet_label');
  labels.forEach(element => element.remove());

}

//loads in new mission
function mission_data(mission,utc,len){
  currentDate = new Date(utc);

  mission_ajax(mission,utc,len)
    .then((data) =>{
      console.log("yep",mission);
      var planet = new Planet(20000, data.x, data.y, data.z,mission,test,utc,true,len);
      clean_system();
      load_system(utc,len);
      planets.push(planet);
      update_slider(0,len,new Date(utc));
    })
}


//array of all planet objects
const planets = [];
//this date changes planets+orbits
let date =new Date();
var currentDate = date;
//let date = '2020-04-13T03:39:06.747Z';
update_slider(0,10000,date);
load_system(date.toISOString(),10000);
// get mission names from backend 
var missions_back = [];

var missions_all = ["APOLLO", "BEPICOLOMBO", "CASSINI","CHANDRA", 
"CLEMENTINE","CONTOUR","DART","DAWN","DEEPIMPACT","DS1","EUROPACLIPPER","EXOMARS2016","FIDO","GIOTTO","GLL","GNS","GRAIL",
"HAYABUSA", "HELIOS", "HST","INSIGHT","IUE","JUNO","JWST","LADEE","LPM","LRO","LUCY","LUNARORBITER",
"M01", "M10",  "M2", "M9", "MARS2020", "MAVEN", "MCO", "MER", "MESSENGER", "MEX", "MGN", "MGS", "MPF", "MPL", "MRO", 
"MSL", "MSR", "NEAR", "NEWHORIZONS", "NOZOMI", "ORX", "PHOBOS88", "PHOENIX", "PHSRM", "PIONEER10", "PIONEER11", "PIONEER12", 
"PIONEER6", "PIONEER8", "PSYCHE", "ROCKY7", "ROSETTA", "SDU", "SELENE", "SIRTF", "SMAP", "SMART1", "SPP", "STEREO", "TDRSS", 
"THEMIS", "ULYSSES", "VEGA", "VEX", "VIKING", "VOYAGER"]; 


//addButtons(missions_current, "mission_library", "pinned_missions");

// Mission Trajectories Checkboxs 
var voyagerTrajCheckbox = document.getElementById('Voyager_1_traj');
voyagerTrajCheckbox.addEventListener('change', function() {
  if (voyagerTrajCheckbox.checked){
    mission_data('VOYAGER 1', '2030-12-31T00:00:00.000Z','19475');
  }else{
    clean_system();
    load_system(date.toISOString(),10000);
  }
});

var ladeeTrajCheckbox = document.getElementById('Ladee_1_traj');
ladeeTrajCheckbox.addEventListener('change', function() {
  if (ladeeTrajCheckbox.checked){
    mission_data('LADEE', '2014-04-07T00:00:00.000Z','100');
  }else{
    clean_system();
    load_system(date.toISOString(),10000);
  }
});

var heliosTrajCheckbox = document.getElementById('Helios_1_traj');
heliosTrajCheckbox.addEventListener('change', function() {
  if (heliosTrajCheckbox.checked){
    mission_data('HELIOS 1', '1974-09-29T00:00:00.000Z','10');
  }else{
    clean_system();
    load_system(date.toISOString(),10000);
  }
});

// Mission Gradients Checkboxs 
var voyagerGradCheckbox = document.getElementById('Voyager_1_grad');
voyagerGradCheckbox.addEventListener('change', function() {
  if (voyagerGradCheckbox.checked){
    // TODO
  }else{
    // TODO 
  }
});

var ladeeGradCheckbox = document.getElementById('Ladee_1_grad');
ladeeGradCheckbox.addEventListener('change', function() {
  if (ladeeGradCheckbox.checked){
    // TODO
  }else{
    // TODO
  }
});

var heliosGradCheckbox = document.getElementById('Helios_1_grad');
heliosGradCheckbox.addEventListener('change', function() {
  if (heliosGradCheckbox.checked){
    // TODO
  }else{
    // TODO
  }
});