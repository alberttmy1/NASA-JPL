import * as THREE from "three";


export default class Planet {
  constructor(radius, positionX, positionZ, textureFile) {
    this.radius = radius;
    this.positionX = positionX;
    //this.positionY = positionY
    this.positionZ = positionZ;
    this.textureFile = textureFile;
    //orbit shit
    this.orbit = this.createOrbit();
    //this.setOrbitInclination();
  }

  getMesh() {
    if (this.mesh === undefined || this.mesh === null) {
      const geometry = new THREE.SphereGeometry(this.radius);
      //TODO make textures work
      const texture = new THREE.TextureLoader().load(this.textureFile);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      //const material = new THREE.MeshBasicMaterial();
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.x += this.positionX;
      this.mesh.position.z += this.positionZ;
    }
    return this.mesh;
  }

  createOrbit() {
    var resolution = this.positionX + 15 * 50; // segments in the line
    var length = 360 / resolution;
    var orbitLine = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
      color: this._color,
      linewidth: 1,
      fog: true
    });

    // Build the orbit line
    const positions = [];
    for (var i = 0; i <= resolution; i++) {
      var segment = (i * length) * Math.PI / 180;
      var orbitAmplitude = this.positionX;

      positions.push(
          Math.cos(segment) * orbitAmplitude,
          0,
          Math.sin(segment) * orbitAmplitude
      );
    }
    orbitLine.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    //generateMorphTargets( orbitLine );
		orbitLine.computeBoundingSphere();
    var line = new THREE.Line(orbitLine, material);

    line.position.set(0, 0, 0);

    return line;
  };

  setOrbitInclination() {
    this._object.orbitCentroid.rotation.x = this._object.orbitalInclination * Constants.degreesToRadiansRatio;
  }
}