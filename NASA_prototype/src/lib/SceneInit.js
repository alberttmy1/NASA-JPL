import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';

export default class SceneInit {
  constructor(fov = 5, camera, scene, stats, controls, renderer, raycaster) {
    this.fov = fov;
    this.scene = scene;
    this.stats = stats;
    this.camera = camera;
    this.controls = controls;
    this.renderer = renderer;
    this.raycaster = raycaster;
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

    this.stats = Stats();
    //document.body.appendChild(this.stats.dom);

    // if window resizes
    window.addEventListener("resize", () => this.onWindowResize(), false);

    // raycaster 
    // Raycaster 
    // create a raycaster to detect when the mouse is hovering over a planet
    this.raycaster = new THREE.Raycaster();

    // add a mouse move event listener to the renderer
    this.renderer.domElement.addEventListener('mousemove', event => {
      // calculate the mouse position in normalized device coordinates (-1 to +1)
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // set the raycaster origin and direction based on the mouse position
      this.raycaster.setFromCamera(mouse, this.camera);
      
      // detect all intersections between the raycaster and the planets
      const intersects = this.raycaster.intersectObjects(planets);
      
      if (intersects.length > 0) {
        // call the onHover function of the first intersected planet
        intersects[0].object.userData.onHover();
      } else {
        // hide the tooltip if the mouse is not hovering over a planet
        tooltip.style.visibility = 'hidden';
      }
    });
  }

  animate() {
    // requestAnimationFrame(this.animate.bind(this));
    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats.update();
    // this.controls.update();
  }

  render() {
    //composer.render(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
    //console.log("rendered");
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}