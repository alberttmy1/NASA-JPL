import * as THREE from "three";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/AfterimagePass.js';

export default class Object {
    constructor(name, radius, positionX, positionZ) {
        //1000 times is just for visibility
        this.name = name
        this.radius = radius;
        this.positionX = positionX;
        //this.positionY = positionY
        this.positionZ = positionZ;
        //orbit shit
        this.orbit = this.createOrbit();
        //this.setOrbitInclination();
        //halo
        this.halo = this.createHalo();
        //name for display
        //this.name = name;
    }

    getMesh() {
    if (this.mesh === undefined || this.mesh === null) {
        const geometry = new THREE.SphereGeometry(this.radius);
        //TODO make textures work
        this.mesh = new THREE.Mesh(geometry);
        this.mesh.position.x += this.positionX;
        this.mesh.position.z += this.positionZ;
    }
    return this.mesh;
    }

    c

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
    //creates halo for planet visibility, uses orbit code
    createHalo(){

    var resolution = this.positionX + 15 * 50; // segments in the line
    var length = 360 / resolution;
    var orbitLine = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
        //color: this._color,
        color: 'lightblue',
        linewidth: 1,
        fog: true
    });

    // Build the orbit line
    const positions = [];
    for (var i = 0; i <= resolution; i++) {
        var segment = (i * length) * Math.PI / 180;
        var orbitAmplitude = this.radius * 1000;

        positions.push(
            Math.cos(segment) * orbitAmplitude,
            0,
            Math.sin(segment) * orbitAmplitude
        );
    }
    orbitLine.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    //geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    //generateMorphTargets( orbitLine );
        orbitLine.computeBoundingSphere();
    var line = new THREE.Line(orbitLine, material);

    line.position.set(this.positionX, 0, 0);

    return line;
    }
    //will be used to display planet name near planet
    /*displayName(){

    }*/

    setOrbitInclination() {
    this._object.orbitCentroid.rotation.x = this._object.orbitalInclination * Constants.degreesToRadiansRatio;
    }
}