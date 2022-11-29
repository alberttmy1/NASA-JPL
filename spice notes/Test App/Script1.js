// JavaScript source code
<script type="module">
import * as THREE from 'C:/Users/tiger/OneDrive/Documents/Course Folders/CSCI 4308 Capstone/three.js-master/build/three.module.js';
 
function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    const scene = new THREE.Scene();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshBasicMaterial({color: 0x44aa88});

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    renderer.render(scene, camera);

</script>

<body>
  <canvas id="c"></canvas>
</body>

