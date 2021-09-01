import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
// import * as dat from 'dat.gui';
import gsap from 'gsap';

import home from '../../img/1.jpg';
import about from '../../img/2.jpeg';
import contact from '../../img/3.jpeg';
import blog from '../../img/4.jpg';

let config = [
  {
    page: 'home',
    texture: new THREE.TextureLoader().load(home)
  },
  {
    page: 'about',
    texture: new THREE.TextureLoader().load(about)
  },
  {
    page: 'contact',
    texture: new THREE.TextureLoader().load(contact)
  },
  {
    page: 'blog',
    texture: new THREE.TextureLoader().load(blog)
  } 
];
console.log(config, "configBitch");


export default class Sketch {
  constructor() {
    this.scene = new THREE.Scene();
    // this.container = options.dom;
    this.container = document.getElementById("container");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      // alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // not sure if needed here added at bottom of page
    // this.container = document.getElementById("container");
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70, 
      window.innerWidth / window.innerHeight, 
      0.001, 
      1000
    );

    let frustumSize = 1;
    let aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.OrthographicCamera(
      frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000
    );
    this.camera.position.set(0, 0, 2);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
        
    this.isPlaying = true;
    
    this.addObjects();
    this.setupResize();
    this.resize();
    this.render();
    // this.settings();
  }

  goto(page) {
    let gotoPage = config.find(o => {
      return o.page == page;
    });
    console.log(gotoPage,'Page');
    this.material.uniforms.t2.value = gotoPage.texture;
    this.material.uniforms.t2.value.needsUpdate = true;
    gsap.to(this.material.uniforms.progress, { 
      duration: 1.8,
      value: 1,
      onComplete: () => {
        this.material.uniforms.progress.value = 0;
        this.material.uniforms.t1.value = gotoPage.texture;
      }
    });
  }

  // settings() {  
  //   let that = this;
  //   this.settings = {
  //     progress: 0,
  //   };
  //   this.gui = new dat.GUI();
  //   this.gui.add(this.settings, 'progress', 0, 1, 0.01);
  // }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    // this.width = this.container.offsetWidth;
    // this.height = this.container.offsetHeight;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    //image convert
    this.imageAspect = 2389/3000;
    let a1;
    let a2;
    if(this.height/this.width>this.imageAspect) {
      a1 = (this.width/this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = (this.height/this.width) / this.imageAspect;
    }
    
    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    // this.camera.fov =
    //   2 *
    //   Math.atan(this.width / this.camera.aspect / (2 * this.cameraDistance)) *
    //   (180 / Math.PI); // in degrees

    this.camera.updateProjectionMatrix();
  }
  

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        // pixels: { value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
        // accel: { value: new THREE.Vector2(0.5,2)},
        t1: { value: new THREE.TextureLoader().load(home) },
        t2: { value: new THREE.TextureLoader().load(about) },
        texture3: { value: new THREE.TextureLoader().load(contact) },
        texture4: { value: new THREE.TextureLoader().load(blog) },
        resolution: { value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment
    });
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render()
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

// new Sketch({
//   dom: document.getElementById('container')
// });