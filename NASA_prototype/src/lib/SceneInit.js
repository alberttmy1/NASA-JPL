import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
export default class SceneInit {

  constructor(fov = 5, camera, scene, stats, controls, renderer, raycaster, mouse, label, labelDiv, labelRenderer) {
    this.fov = fov;
    this.scene = scene;
    this.stats = stats;
    this.camera = camera;
    this.controls = controls;
    this.renderer = renderer;
    this.raycaster = raycaster;
    this.mouse = mouse;
    this.label = label;
    this.labelDiv = labelDiv;
    this.labelRenderer = labelRenderer;
    this.planets = [];
  }

  initScene() {
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 128;

    this.scene = new THREE.Scene();

    // const spaceTexture = new THREE.TextureLoader().load("space2.jpeg");
    // this.scene.background = spaceTexture;

    // specify a canvas which is already created in the HTML file and tagged by an id
    // aliasing enabled
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("myThreeJsCanvas"),
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.stats = Stats();
    //document.body.appendChild(this.stats.dom);

    // if window resizes
    window.addEventListener("resize", () => this.onWindowResize(), false);

    // raycaster 
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Setup labels
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(this.labelRenderer.domElement);
 

  }

  animate() {
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls.update();
    this.stats.update();

    const systems = this.get_systems();
    if (systems.length != 0){
      this.update_systems(systems);
    }
  }

  render() {
    //composer.render(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
    
  get_systems() {
    const systems = [];

    this.scene.traverse(function(object) {
      if (object instanceof THREE.Group) {
        systems.push(object);
      }
    });

    return systems;
  }

  update_systems(systems){
    for (let i = 0; i < systems.length; i++){
      const system = systems[i];
      //console.log(system.children);

      const planetLabel = system.getObjectByName('planetLabel');
      
      if(system.children.length > 2){
        const mesh = system.children[0];
        const orbit = system.children[1];
        const radius = mesh.geometry.boundingSphere.radius;
        
        if (planetLabel != null){
          planetLabel.position.set(mesh.position.x, mesh.position.y - radius, mesh.position.z);
        }
      }
    }
    this.labelRenderer.render(this.scene, this.camera);
  }
}