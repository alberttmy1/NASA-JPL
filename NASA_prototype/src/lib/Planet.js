import * as THREE from "three";

//pos is array of planet positions
//check if pos[0] is equal to current days planet position
//if not
//pos.pop() gets rid of last planet position
//pos.unshift([x,y,z]) adds new planet position to front

export default class Planet {
  constructor(radius, positionX, positionY, positionZ, name, screen/*, textureFile*/) {
    this.screen = screen;
    this.radius = this.toAU(radius);
    this.pos = [[this.toAU(positionX),this.toAU(positionY),this.toAU(positionZ)]];
    //not using textures currently
    //this.textureFile = textureFile;
    this.name = name;
    //orbit shit
    this.orbit = undefined;
    this.halo = this.createHalo();
    this.createOrbit()
    //this.orbit = this.createOrbit();
  }

  toAU(km){
    return km * 6.6845871226706 * (10 ** -9);
  };

  getMesh() {
    if (this.mesh === undefined || this.mesh === null) {
      const geometry = new THREE.SphereGeometry(this.radius);
      //basic white texture for now
      //const texture = new THREE.TextureLoader().load(this.textureFile);
      //const material = new THREE.MeshBasicMaterial({ map: texture });
      const material = new THREE.MeshBasicMaterial();
      this.mesh = new THREE.Mesh(geometry, material);
      //adds current position to mesh
      console.log(this.name,"pos",this.pos);
      this.mesh.position.x = this.pos[0][0];
      this.mesh.position.y = this.pos[0][1];
      this.mesh.position.z = this.pos[0][2];

    }
    return this.mesh;
  }
  //ajax call
  ajax_call(target,dates){
    return new Promise((resolve) => {
      for(let i=0; i<dates.length; i++){
        let time = dates[i];
        $.ajax({
          url:'https://spice-api.herokuapp.com/orbits?planet='+target+'&utc='+time,
          type: 'GET',
          dataType:'JSON',
          crossDomain: true,
          planet:target,
          utc:time
        })
          .then((data) => {
            //console.log("here");
            this.pos.push([this.toAU(data.x),this.toAU(data.y),this.toAU(data.z)]);
            //console.log(this.pos);
            if(this.pos.length-1 == dates.length){
              resolve()
            }
          });
      }
    })
  };

  //not using orbits currently
  createOrbit() {

    //new orbit code
    let dates = [];
    const date = new Date();
    for(let i=0; i<10; i++){
      dates.push(new Date(date.setDate(date.getDate() - 2)).toISOString());
    }

    this.ajax_call(this.name,dates)
      .then(() => {
        console.log(this.name,"Final Pos", this.pos);
        var orbitLine = new THREE.BufferGeometry();
        var material = new THREE.LineBasicMaterial({
          color: 'red',
          linewidth: 5,
          fog: true
        });
        orbitLine.setAttribute( 'position', new THREE.Float32BufferAttribute( this.pos.flat(), 3 ) );
        orbitLine.computeBoundingSphere();
        var line = new THREE.Line(orbitLine, material);

        //line.position.set(this.pos[0][0], this.pos[0][1], this.pos[0][2]);
        line.position.set(0,0,0);
        this.orbit = line;
        console.log("line",line);
        var planetMesh = this.getMesh();
        var system = new THREE.Group();
        system.add(planetMesh);
        system.add(this.orbit);
        system.add(this.halo);
        this.screen.scene.add(system);
        console.log("done done done");
        //return line;
      });
  };

  //creates halo for planet visibility, uses orbit code
  createHalo(){

    var resolution = this.pos[0][0] + 15 * 50; // segments in the line
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

    line.position.set(this.pos[0][0], this.pos[0][1], this.pos[0][2]);
    return line;
  }
  //will be used to display planet name near planet
  /*displayName(){

  }*/

}