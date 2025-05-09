"use client"
// Imports
// Run npm i --save-dev @types/three
import Image from "next/image";
import styles from './page.module.css';
import * as THREE from 'three';
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// End o Imports
// Start of page.tsx
const thre = true
export default function Home() {
  const boxRef = useRef(null); // What is this damn thing

  if (thre){
  // THREE vars. That is four vars hmmmmm?
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null); // gets canvas?
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null); // renders it
  const [controls, setControls] = useState<OrbitControls | null>(null); // allows movement

  // Resize three
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(()=> { //Loop update size
    const updateSize = () => { 
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
      }
    };

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [renderer])

  useEffect(()=> {
    if(!boxRef.current) { // I don't know what this is
      return
    }
    var renderTimer: any

      console.log(window.innerHeight, window.innerWidth)
  

    const scene = new THREE.Scene(); // Three scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Camera Controls
    const canvas = document.querySelector(".bg"); //Define .bg as the canvas
    var renderer: THREE.WebGLRenderer | null = null; // idk
    
    setRenderer(renderer); // idk

    if (canvas instanceof HTMLCanvasElement) { // unsure
      console.log(canvas); //unsure
      
      renderer = new THREE.WebGLRenderer({ canvas }); // unsure
      setControls(new OrbitControls( camera, renderer.domElement )); // unsure
      if(controls) { // unsure
        controls.update(); // unsure
      }
    

    camera.position.setZ(10); // Sets the camera posistion as to let me see the stuff

    // HERE
    // Makes a wireframe cube
    const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true}); 
    const cube = new THREE.Mesh( geometry, material ); 
    cube.position.set( 0, 0, 0)
    scene.add( cube );

    const animate = () => {
      requestAnimationFrame(animate)
      controls?.update();
      renderer?.render(scene, camera);
    };
    animate();

  } else {
    console.error("Canvas element not found!");
  }

    renderTimer = setInterval(() => {
      if(controls) {
        controls.update();
      }
      renderer?.render(scene, camera);
      renderer?.setPixelRatio(window.devicePixelRatio);
      renderer?.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix();


    })

    return () => {
      if(!renderTimer) {
        return
      }
      clearInterval(renderTimer);
    }
  }, [])


  }
  return (
    <>
      <div>
        <canvas ref={boxRef} style={{width: "100vw", height: "100vh"}} className="bg"></canvas> 
        {/* Still have not the faintest idea what box Ref is */}
      </div>

    <div className={styles.page}>

    </div>

    </>
  );
}
// End of page.tsx
