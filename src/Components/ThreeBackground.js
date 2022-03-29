import React from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import speaker from './3d/speaker.glb';

const scene = new THREE.Scene();

/**
 * Renders a simple centered 3d animation
 */
export class ThreeBackground extends React.Component {
    constructor(props) {
        super(props);

        this.container = React.createRef();
    }
 
  componentDidMount() {
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1500 );

    const renderer = new THREE.WebGLRenderer( {alpha: true, antialias: true} );
    renderer.setSize( window.innerWidth*0.7, window.innerHeight*0.7 );
    this.container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    const material = new THREE.MeshBasicMaterial( { color: 0xFFC300 } );

    
    // Old solution for loading random .glb model, replace geometry with imported .glb 
    //let currentGeometry;
    
    // switch(Math.floor(Math.random() * 3)) {
    //   case 0:
    //     currentGeometry = new THREE.BoxGeometry();
    //     break;
    //   case 1:
    //     currentGeometry = new THREE.ConeGeometry();
    //     break;
    //   case 2:
    //     currentGeometry = new THREE.DodecahedronGeometry();
    //     break;
    //   default: 
    //   currentGeometry = new THREE.BoxGeometry();
    //     break;
    // }

    const loader = new GLTFLoader();

    loader.load(speaker, function (gltf) {
        gltf.scene.children.forEach(function(child) {
            child.material = material;
            child.material.needsUpdate = true;
        });

        scene.add(gltf.scene);

        const animations = gltf.animations;
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const clock = new THREE.Clock();

        
        animations.forEach( function ( clip ) {
            mixer.clipAction( clip ).play();
        } );
        
        gltf.scene.scale.set(0.2, 0.2, 0.2);

        const composer = new EffectComposer( renderer );
        composer.addPass( new RenderPass( scene, camera ) );

        const animate = function () {
            if ( mixer ) mixer.update( clock.getDelta()*2 );

            requestAnimationFrame( animate );
            gltf.scene.rotation.y += 0.01;
            composer.render();
        };

        animate();

    }, undefined, function (error) {
        console.error(error);
    });
        
    camera.position.z = 4;
    camera.setViewOffset( window.innerWidth, window.innerHeight, window.innerWidth * 0, window.innerHeight * 0.2, window.innerWidth, window.innerHeight );

    function onWindowResize(){
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.focus = 10;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

  }

  componentWillUnmount() {
    scene.clear();
  }

  render() {
    return(
        <div ref = {refNode => this.container = refNode}/>
    );
  }
} 