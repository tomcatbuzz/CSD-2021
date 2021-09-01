import barba from '@barba/core';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText);

let imagesLoaded = require('imagesloaded');

import A from './canvas/app';
let sketch = new A();

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

const logo = select('#logo');


const loader = select('.loader');
const loaderInner = select('.loader .inner');
const progressBar = select('.loader .progress');
const loaderMask = select('.loader__mask');

// images loaded
function init() {

  // show loader on page load
  gsap.set(loader, { autoAlpha: 1 });

  // scale loader down
  gsap.set(loaderInner, { scaleY: 0.005,
    transformOrigin: 'bottom' });

  // make a tween that scales the loader
 const progressTween = gsap.to(progressBar, { paused: true,
    scaleX: 0,
    ease: 'none',
    transformOrigin: 'right' });

  // setup variables
  let loadedImageCount = 0,
    imageCount;
  
  const container = select('body');

  // setup Images loaded
  const imgLoad = imagesLoaded(container, {background: true});
  imageCount = imgLoad.images.length;
  

  // set the initial progress to 0
  updateProgress(0);

  // triggered after each item is loaded
  imgLoad.on('progress', function() {

    // increase the number of loaded images
    loadedImageCount++;

    // update progress
    updateProgress(loadedImageCount);
  });

  // update the progress of our progressBar tween
  function updateProgress(value) {

    console.log(imageCount)
    // tween progress bar tween to the right value
    gsap.to(progressTween, {
      progress: value / imageCount,
      duration: 0.3,
      ease: 'power1.out',

      // onUpdate: progressUpdate,
      // onComplete: loadComplete,
    });
  }

  // textBar.value = textContent;
  // function progressUpdate() {
  //   const loadingProgress = Math.round(progressTween.progress() * 100);
  //   // textBar.innerHTML = `${loadingProgress * 100}%`;
  //   document.querySelectorAll('.txt-perc').forEach(_element => _element.textContent = loadingProgress + '%');
  // }
  // do whatever you want when all images are loaded
  imgLoad.on('done', function() {

    // we will simply init our loader animation onComplete
    gsap.set(progressBar, { autoAlpha: 0,
      onComplete: initPageTransitions });
  });
}
init();

let animation = gsap.timeline({});

function pageTransitionIn({ container }) {
  const tl = gsap.timeline({
    defaults: {
      // duration: 0.5,
      duration: 1,
      ease: 'power1.inOut'
    },
    onComplete: () => initContent()
  });
  tl.to(container, { opacity: 0 });
  return tl;  
}

function pageTransitionOut({ container }) {
  let goto = container.getAttribute('data-barba-namespace');
    sketch.goto(goto);
    console.log(sketch, 'this is Sketch');
    // const split = new SplitText('h1', {type:'chars'});
	  // animation.from(split.chars, {opacity:0, y:50, ease:'back(4)', stagger:{
		// from:'end',
		// each:0.05
	  // }});
    const tl = gsap.timeline({
      defaults: {
        // duration: 0.5,
        duration: 1,
        ease: 'power1.inOut'
      }
    })
    tl.fromTo(container, { opacity: 0 }, { opacity: 1 });
    return tl;
}

function initPageTransitions() {

  // do something before the transition starts
  barba.hooks.before(() => {
    select('html').classList.add('is-transitioning');
    window.scrollTo(0, 0);
    
  });

  // do something after the transition finishes
  barba.hooks.after(() => {
    select('html').classList.remove('is-transitioning');
  });

  barba.hooks.leave(() => {
    
  });

  barba.hooks.afterEnter(() => {
    initSplit();
  })

  barba.hooks.afterLeave((data) => {
    console.log(data, 'data');
  });

  // scroll to the top of the page
  barba.hooks.enter(() => {
    window.scrollTo(0, 0);
    console.log('enter bitch');
    // linkHome();
    // changeNav();
    // headerNav();
    // initNavIn();
  });
  // function linkHome() {
  //   logo.href = '../index.html';
  // }

  // ************** ADD VIEWS???? for initContent() ??? or barba.hooks.enter initcontent, test pg2
  barba.init({
    
    debug: true,
    transitions: [{
      once() {

        // do something once on the initial page load
        initLoader();
      },
      leave: ({ current }) => pageTransitionIn(current),

      // animate loading screen in
      enter({ next }) {

        // animate loading screen away
        pageTransitionOut(next);
      },
    }],
    views: [
      {
        namespace: 'home',
        beforeEnter() {
          
        }  
      }
    ]
  });
}
function initLoader() {
  const tlLoaderIn = gsap.timeline({
    id: 'tlLoaderIn',
    defaults: {
      duration: 1.1,
      ease: 'power2.out',
    },
    onComplete: () => initContent(),
  });
  const image = select('.loader__image img');
  const mask = select('.loader__image--mask');
  const line1 = select('.loader__title--mask:nth-child(1) span');
  const line2 = select('.loader__title--mask:nth-child(2) span');
  const lines = selectAll('.loader__title--mask');
  const loaderContent = select('.loader__content');
  tlLoaderIn
    .set(loaderContent, { autoAlpha: 1 })
    .to(loaderInner, {
      scaleY: 1,
      transformOrigin: 'bottom',
      ease: 'power1.inOut',
    })
    .addLabel('revealImage')
    .from(mask, { yPercent: 100 }, 'revealImage-=0.6')
    .from(image, { yPercent: -80 }, 'revealImage-=0.6')
    .from([line1, line2], { yPercent: 100,
      stagger: 0.1 }, 'revealImage-=0.4');
  const tlLoaderOut = gsap.timeline({
    id: 'tlLoaderOut',
    defaults: {
      duration: 1.2,
      ease: 'power2.inOut',
    },
    delay: 1,
  });
  tlLoaderOut
    .to(lines, { yPercent: -500,
      stagger: 0.2 }, 0)
    .to([loader, loaderContent], { yPercent: -100 }, 0.2)
    .from('#container', { y: 150 }, 0.2);
  const tlLoader = gsap.timeline();
  tlLoader
    .add(tlLoaderIn)
    .add(tlLoaderOut);
}

function initContent() {
  select('body').classList.remove('is-loading');
}

function initSplit () {
  const split = new SplitText('h1', {type:'chars'});
	  animation.from(split.chars, {opacity:0, y:50, ease:'back(4)', stagger:{
		from:'end',
		each:0.05
	  }});
}
