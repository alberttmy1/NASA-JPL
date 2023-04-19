import * as THREE from "three";
<<<<<<< HEAD
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// import { TextGeometry} from "three";
// import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
// import font_file from '../fonts/Bebas_Neue_Regular.json';
// import dro from 'three/examples/fonts/droid/droid_serif_regular.typeface.json';
=======
//import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
//import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
 //import { TextGeometry} from "three";
 //import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
//import font_file from '../fonts/Bebas_Neue_Regular.json';
//import dro from 'three/examples/fonts/droid/droid_serif_regular.typeface.json';
>>>>>>> 3059453241f6cd03b1083f36bb15b46ee5aea5c6
import SceneInit from "./SceneInit";

//pos is array of planet positions
//check if pos[0] is equal to current days planet position
//if not
//pos.pop() gets rid of last planet position
//pos.unshift([x,y,z]) adds new planet position to front

export default class Planet {
  constructor(radius, positionX, positionY, positionZ, name, screen, date/*, textureFile*/) {
    this.screen = screen;
    this.date = date;
    this.radius = this.toAU(radius);
    this.xPos = this.toAU(positionX);
    this.yPos = this.toAU(positionY);
    this.zPos = this.toAU(positionZ);
    this.pos = [];
    this.velocityVectors = [];
    this.velocities = [];
    //not using textures currently
    //this.textureFile = textureFile;
    this.name = name;
    //orbit shit
    this.orbit = undefined;
    this.halo = this.createHalo();
    // this.textName = this.displayName(name, this.toAU(positionX),this.toAU(positionY),this.toAU(positionZ));
    this.system = undefined;
    this.createOrbit();
  }

  toAU(km){
    return km * 6.6845871226706 * (10 ** -9);
  };
  
  getColors(velocities){
    let colors = [];
    //assigns colors to velocites
    for(let i=0; i<velocities.length;i++){
      //first two numbers can be changed for scale of velocities
        let scaled = this.scale(0.00000005,0.0000001,0,1020,velocities[i]);
        //scales from 0-1
        let update = this.scale(0,255,0,1,(scaled%255));
        let color = [0,0,0]
        if(scaled<=255){
            color = [0.0,update,1.0];
        }
        else if(scaled<=510){
            color = [0.0,1.0,1.0-update];
        }
        else if(scaled<=765){
            color = [update,1.0,0.0];
        }
        else{
            color = [1.0,1.0-update,0.0];
        }
        colors.push(color);
    }
    return colors
  };
  //scales numbers
  scale(rmin,rmax,tmin,tmax,m){
      return(((m-rmin)/(rmax-rmin))*(tmax-tmin)+tmin)
  };

  updateLine(){
    this.orbit.material.vertexColors = !this.orbit.material.vertexColors;
    this.orbit.material.needsUpdate = true;
  }

  getMesh() {
    if (this.mesh === undefined || this.mesh === null) {
      const geometry = new THREE.SphereGeometry(this.radius);
      //basic white texture for now
      //const texture = new THREE.TextureLoader().load(this.textureFile);
      //const material = new THREE.MeshBasicMaterial({ map: texture });
      const material = new THREE.MeshBasicMaterial();
      this.mesh = new THREE.Mesh(geometry, material);
      //adds current position to mesh
      //console.log(this.name,"pos",this.pos);
      this.mesh.position.x = this.xPos;
      this.mesh.position.y = this.yPos;
      this.mesh.position.z = this.zPos;

    }
    return this.mesh;
  }
  //ajax call
  ajax_call(target,time,len){
    return new Promise((resolve) => {
        $.ajax({
          url:'https://spice-api.herokuapp.com/orbits?planet='+target+'&utc='+time+'&length='+len,
          type: 'GET',
          dataType:'JSON',
          crossDomain: true,
          planet:target,
          utc:time,
          length:len
        })
          .then((data) => {
            resolve(data);
          });
    })
  };


  //not using orbits currently
  createOrbit() {
    //ajax call for orbit info
    //this is how many days long the orbit is
    let orbitlength = 10000;
    this.ajax_call(this.name,this.date,orbitlength)
      .then((data) => {
        //adds all positions and velocity vectors to arrays
        
        for(let i=0; i<data.length; i++){
          this.pos.push([this.toAU(data[i][0]),this.toAU(data[i][1]),this.toAU(data[i][2])]);
          this.velocityVectors.push([this.toAU(data[i][3]),this.toAU(data[i][4]),this.toAU(data[i][5])]);
        }
        //gets magnitude of velocity
        for(let i=0; i<this.velocityVectors.length; i++){
          this.velocities.push(Math.sqrt(Math.pow(this.velocityVectors[i][0],2)+Math.pow(this.velocityVectors[i][1],2)+Math.pow(this.velocityVectors[i][2],2)))
        }

        let colors = this.getColors(this.velocities);
        //creates line
        const orbitLine = new THREE.BufferGeometry();
        orbitLine.setAttribute( 'position', new THREE.Float32BufferAttribute( this.pos.flat(), 3 ) );
        orbitLine.setAttribute( 'color', new THREE.Float32BufferAttribute( colors.flat(), 3 ) );
        orbitLine.computeBoundingSphere();
        //attributes of line
        var material = new THREE.LineBasicMaterial({
          //color: 'darkred',
          vertexColors: true,
          linewidth: 5,
          fog: true
        });
        var line = new THREE.Line(orbitLine, material);
<<<<<<< HEAD
        // console.log("font:" + Object.values(font_file));
        // console.log("dro" + Object.values(dro));
=======
>>>>>>> 3059453241f6cd03b1083f36bb15b46ee5aea5c6
        line.position.set(0,0,0);
        line.name = this.name + "_orbit";
        this.orbit = line;
        //creates planet mesh, adds to solarsystems
        var planetMesh = this.getMesh();
        planetMesh.name = this.name + "_mesh";
        var system = new THREE.Group();
        system.add(planetMesh);
        system.add(this.orbit);
        system.add(this.halo);
        // system.add(this.textName);
        this.screen.scene.add(system);
        //console.log("system:" + system);

        return system;
      });
  };

  //creates halo for planet visibility, uses orbit code
  createHalo(){

    var resolution = this.xPos + 15 * 50; // segments in the line
    var length = 360 / resolution;
    var orbitLine = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
      color: 'lightblue',
      linewidth: 1,
      fog: true
    });

    // Build the orbit line
    const positions1 = [];
    const positions2 = [];
    for (var i = 0; i <= resolution; i++) {
      var segment = (i * length) * Math.PI / 180;
      var orbitAmplitude = this.radius * 1000;

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
		orbitLine.computeBoundingSphere();
    var line = new THREE.Line(orbitLine, material);

    line.position.set(this.xPos, this.yPos, this.zPos);
    return line;
  }
  
  //will be used to display planet name near planet
  displayName(name, x, y,z){
    // const data = require('./fonts/Vogue_Regular.json');
    // const fonts = fontAll(require.context('./font', false, /\.(json)$/));
    //"../fonts/Vogue_Regular.json"
    // ../fonts/Bebas_Neue_Regular.json'
    // node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json


    // Create a canvas element
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 6;
    canvas.height = 10;

    // Set text properties
    context.font = '5px Arial';
    context.fillStyle = 'white';
    

    // Draw text on canvas
    context.fillText(name, canvas.width / 2, canvas.height / 2);

    // Create a texture from the canvas
    var texture = new THREE.CanvasTexture(canvas);

    // Create a plane geometry to display the text
    var geometry = new THREE.PlaneGeometry(6, 2);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);

    // Add the mesh to the scene
    return mesh;
    
    // const canvas = document.createElement('canvas');
    // const context = canvas.getContext('2d');
    // context.fillStyle = 'green';
    // context.font = 'italic 5px Arial';
    // // context.textAlign = 'center';
    // context. textBaseline = 'middle';
    // context.fillText(name, 0, 10);
    // const texture = new THREE.Texture(canvas);
    
    // texture.needsUpdate = true;
    // var material = new THREE.MeshBasicMaterial({
    //   map: texture,
    //   side: THREE.DoubleSide,
    // })
    // material.transparent = true
    // var mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material)
    // mesh.position.set(x, y, z);
    // return mesh

    // var fontLoader = new FontLoader();
    // console.log("name");
    // // console.log("../fonts/Bebas_Neue_Regular.json");
    // fontLoader.load("three/examples/fonts/droid/droid_serif_regular.typeface.json", (font) => {
    // // Create a TextGeometry using the loaded font
    //   console.log("name");
    //   const text = new TextGeometry(name, {
    //     font: font,
    //     size: 1,
    //     height: 0.1,
    //     });
    //     const textMaterial = new THREE.MeshNormalMaterial();
    //     const textMesh = new THREE.Mesh(text, textMaterial);
    //     textMesh.position.x = -46;
    //     textMesh.position.y = -10;
    //     return textMesh;
    // });

    // const ttfLoader = new TTFLoader();
    // ttfLoader.load("../fonts/jet_brains_mono_regular.ttf", (json) => {
    //   // First parse the font.
    //   const jetBrainsFont = fontLoader.parse(json);
    //   // Use parsed font as normal.
    //   const textGeometry = new TextGeometry(name, {
    //     height: 2,
    //     size: 10,
    //     font: jetBrainsFont,
    //   });
    //   const textMaterial = new THREE.MeshNormalMaterial();
    //   const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    //   textMesh.position.x = -46;
    //   textMesh.position.y = -10;
    //   return textMesh;
    // });
  }

}