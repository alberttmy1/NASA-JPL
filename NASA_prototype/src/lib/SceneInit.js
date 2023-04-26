import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

import {
  CSS2DRenderer,
  CSS2DObject,
} from 'https://unpkg.com/three@0.125.2/examples/jsm/renderers/CSS2DRenderer.js';


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
    this.mouse = new Vector2();

    // Setup labels
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(innerWidth, innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(this.labelRenderer.domElement);

    this.labelDiv = document.createElement('div');
    this.labelDiv.className = 'label';
    this.labelDiv.style.marginTop = '-1em';
    this.label = new CSS2DObject(this.labelDiv);
    this.label.visible = false;
    this.scene.add(this.label);

    window.addEventListener('mousemove', ({ clientX, clientY }) => {
      const { innerWidth, innerHeight } = window;
  
      this.mouse.x = (clientX / innerWidth) * 2 - 1;
      this.mouse.y = -(clientY / innerHeight) * 2 + 1;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      const { innerWidth, innerHeight } = window;

      this.renderer.setSize(innerWidth, innerHeight);
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
    });

  }

  animate() {
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls.update();
    this.stats.update();
    update_mouse_over();
    // this.controls.update();
  }

  render() {
    //composer.render(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
    // Render labels
    this.labelRenderer.render(this.scene, this.camera);
    //console.log("rendered");
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  
  update_mouse_over() {
    
    // Pick objects from view using normalized mouse coordinates
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const [hovered] = this.raycaster.intersectObjects(this.scene.children);

    if (hovered) {
      // Setup label
      this.renderer.domElement.className = 'hovered';
      this.label.visible = true;
      this.labelDiv.textContent = hovered.object.name;

      // Get offset from object's dimensions
      const offset = new Vector3();
      new Box3().setFromObject(hovered.object).getSize(offset);

      // Move label over hovered element
      this.label.position.set(
        hovered.object.position.x,
        offset.y / 2,
        hovered.object.position.z
      );
    } else {
      // Reset label
      this.renderer.domElement.className = '';
      this.label.visible = false;
      this.labelDiv.textContent = '';
    }
  }
    
}