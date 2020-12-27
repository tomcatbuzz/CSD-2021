import * as THREE from 'three';
// let OrbitControls = require("three-orbit-controls")(THREE);
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'js/GLTFLoader.js';

import fragment from './shader/fragment.glsl';
import vertex from './shader/vertex.glsl';
// import * as dat from 'dat.gui';
import gsap from 'gsap';
import load from 'load-asset';
import img1 from '../../images/1.jpg';
import img2 from '../../images/2.jpg';
import img3 from '../../images/3.jpg';


// const gallery = [
//   new THREE.TextureLoader().load('../../images/'),
//   new THREE.TextureLoader().load('../assets/2.jpg'),
//   new THREE.TextureLoader().load('../assets/3.jpg'),
//   new THREE.TextureLoader().load('../assets/4.jpg')
// ];

let images = ({
  url: '../../images/1.jpg',
  url: '../../images/1.jpg',
  url: '../../images/3.jpg',
  url: '../../images/4.jpg'
});

let config = [
  {
    page: 'home',
    texture: new THREE.TextureLoader().load('../../images/1.jpg')
  },
  {
    page: 'about',
    texture: new THREE.TextureLoader().load('../../images/2.jpg')
  },
  {
    page: 'contact',
    texture: new THREE.TextureLoader().load('../../images/3.jpg')
  },
  {
    page: 'blog',
    texture: new THREE.TextureLoader().load('../../images/4.jpg')
  },
  
];
console.log(img1);

export default class Sketch {
  constructor() {
    this.scene = new THREE.Scene();
    // this.container = options.dom;
    this.width = window.offsetWidth;
    this.height = window.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // not sure if needed here
    this.container = document.getElementById("container");
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70, 
      window.innerWidth / window.innerHeight, 
      0.001, 
      1000
    );

    // let frustumSize = 1;
    // let aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera(
    //   frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000
    // );
    this.camera.position.set(0, 0, 2);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    this.isPlaying = true;
    // load.all(images).then((assets)=> {
    //   this.addObjects();
    //   for(let key in assets) {
    //       assets[key] = new THREE.Texture(assets[key])
    //   }

    //   this.material.uniforms.t1.value = assets[start] || assets["index"];
    //   this.material.uniforms.t1.value.needsUpdate = true;
    //   this.assets = assets;
    //   console.log(assets,images);
      this.addObjects();
      this.resize();
      this.render();
      this.setupResize();
      // this.settings();
      // this.click();
      this.play();
    
  }
  
  // changeBG(newpage) {
  //   if(this.animating) {
  //     this.nextShow = newpage;
  //     return
  //   }
  //   this.animating = true;
  //   let nextTexture = this.assets[newpage] || this.assets["index"]
  //   this.material.uniforms.t2.value = nextTexture
  //   this.material.uniforms.t2.value.needsUpdate = true;
  //   gsap.to(this.material.uniforms.progress,{
  //       duration: 2,
  //       value: 1,
  //       onComplete:()=> {
  //           this.material.uniforms.progress.value = 0;
  //           this.material.uniforms.t1.value = nextTexture;
  //           this.animating = false;
  //           if(this.nextShow) {
  //             this.changeBG(this.nextShow)
  //             this.nextShow = null
              
  //           }
  //       }
  //   })
  // }

  goto(page) {
    
    let gotoPage = config.find(o => {
      return o.page == page;
    });
    let tl = gsap.timeline({ onComplete: () => {
      this.material.uniforms.progress.value = 0;
      this.material.uniforms.texture2.value.needsUpdate = true;
      this.material.uniforms.texture2.value = gotoPage.texture;
    }});
    tl.to(this.material.uniforms.progress,
      { duration: 0.5 },
      { value: 1 });
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
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    // original scene from github
    // var w = window.innerWidth;
    // var h = window.innerHeight;
    // renderer.setSize( w, h );
    // camera.aspect = w / h;

    // material.uniforms.uvRate1.value.y = h / w;

    // // calculate scene
    // let dist  = camera.position.z - plane.position.z;
    // let height = 1;
    // camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

    // // if(w/h>1) {
    // plane.scale.x = w/h;
    // // }

    //image convert
    this.imageAspect = 2592/3872;
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
    this.material.uniforms.uvRate1.value.y = this.height / this.width;

    this.camera.fov =
      2 *
      Math.atan(this.width / this.camera.aspect / (2 * this.cameraDistance)) *
      (180 / Math.PI); // in degrees

    // calculate scene MIGHT NEED?
  // let dist  = camera.position.z - plane.position.z;
  // let height = 1;
  // camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

  // // if(w/h>1) {
  // plane.scale.x = w/h;
  // // }
  
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
        uvRate1: {
          value: new THREE.Vector2(1,1)
        },
        texture1: { value: new THREE.TextureLoader().load('../../images/1.jpg') },
        texture2: { value: new THREE.TextureLoader().load('../../images/2.jpg') },
        texture3: { value: new THREE.TextureLoader().load('../../images/3.jpg') },
        texture4: { value: new THREE.TextureLoader().load('../../images/4.jpg') },
        resolution: { value: new THREE.Vector4() },
        
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment
      
    });
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

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
    // this.material.uniforms.progress.value = this.settings.progress;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    
  }
}
