import * as THREE from "three";

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
    this.createOrbit()
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
        else if(scaled<=255){
            color = [0.0,1.0,1.0-update];
        }
        else if(scaled<=255){
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
        line.computeLineDistances();

        line.position.set(0,0,0);
        this.orbit = line;
        //creates planet mesh, adds to solarsystem
        var planetMesh = this.getMesh();
        var system = new THREE.Group();
        system.add(planetMesh);
        system.add(this.orbit);
        system.add(this.halo);
        this.screen.scene.add(system);
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
  /*displayName(){

  }*/

}