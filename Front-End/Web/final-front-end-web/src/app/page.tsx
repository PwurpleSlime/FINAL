"use client"
// Imports
import styles from './page.module.css';
import * as THREE from 'three';
import { JSX, useEffect, useRef, useState } from "react";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ethers } from "ethers"
import { AdminCard, MeetingCard } from "./Components/index" 

// End o Imports
// Start of page.tsx
const thre = true
const centerPoint = new THREE.Vector3(0,0,0)
let distance = 8
let angle = 0
const pivotPoint = [0,3,0]

export default function Home() {
  const boxRef = useRef(null); // What is this damn thing
  const adminRef = useRef(null)
  const [hasWallet, setWallet] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isAdminPage, setIsAdminPage] = useState(true)
  const [isMeetingPage, setIsMeetingPage] = useState(false)
  const [isAddAdminPage, setIsAddAdminPage] = useState(false)
  const [isRemoveAdminPage, setIsRemoveAdminPage] = useState(false)
  const [walletIsAvalible, setWalletIsAvalible] = useState(true)
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [adminList, setAdminList] = useState<any[]>([])
  const [meetingList, setMeetingList] = useState<any[]>([])
  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [addAdminName, setAddAdminName] = useState("")
  const [addAdminAddr, setAddAdminAddr] = useState("")
  const [removeAdminAddr, setRemoveAdminAddr] = useState("")

  async function addAdmin() {
    if (addAdminName == "" || addAdminAddr == "" || provider == null){
      return
    }

    
    await fetch('http://10.200.136.135:3005/addAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newName: addAdminName,
        newAddr: addAdminAddr,
        adderAddr: account
      }),
    });
  }

  useEffect(()=>{
    const adminZone = document.querySelector(".adminZone")
    
    fetch("http://10.200.136.135:3005/getAdminNameList")
    .then((res)=>res.json())
    .then((data: string[])=>{
      setAdminList(data)
    })
    .catch((err)=>{
      console.error("Error fetching admin list:", err)
    })

    fetch("http://10.200.136.135:3005/getMeetingPlaces")
    .then((res)=>res.json())
    .then((data: string[])=>{
      setMeetingList(data)
    })
    .catch((err)=>{
      console.error("Error fetching admin list:", err)
    })
  }, [isAdminPage])
  if (thre){
  // THREE vars. That is four vars hmmmmm?
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null); // gets canvas?
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null); // renders it
  const [controls, setControls] = useState<OrbitControls | null>(null); // allows movement

  const addElement = () => {
    setElements([...elements, <p key={elements.length}>Hello</p>]);
  };

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
    




    function makeStars(posRange:number,negRange:number,amount:number,r:number,g:number,b:number) {
      for (let i = 0; i < amount; i++) {
        const starGeometry = new THREE.SphereGeometry(0.5, 32, 32)
        const starMesh = new THREE.MeshBasicMaterial({ color: new THREE.Color(r,g,b) })
        const star = new THREE.Mesh( starGeometry, starMesh)
        let num1 = Math.random()*posRange - Math.random()*negRange
        if (num1<=8 && num1>=-8){
          num1+=20
        }
        let num2 = Math.random()*posRange - Math.random()*negRange
        if (num2<=8 && num2>=-8){
          num2+=20
        }
        let num3 = Math.random()*posRange - Math.random()*negRange
        if (num3<=8 && num3>=-8){
          num3+=20
        }

        star.position.set(num1,num2,num3)
        scene.add(star)
        
      }
    }

    makeStars(300,300,600,255,255,255)

    const animate = () => {
      angle += 0.001
      camera.position.set(pivotPoint[0] + distance * Math.sin(angle), pivotPoint[1], pivotPoint[2] + distance * Math.cos(angle))
      camera.lookAt(centerPoint);




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

  async function attemptConnect(){
    if ((window as any).ethereum){
      try {
        let provider = new ethers.BrowserProvider((window as any).ethereum)
        let signer = await provider.getSigner()
        const userAddress = await signer.getAddress()
        console.log(provider);
        console.log(signer);

        setProvider(provider)
        setAccount(userAddress)
        console.log('Wallet Connected:',userAddress);
        setIsConnected(true)
        
      }catch{
        console.error("Wallet connection failed:", Error)
      }
    }else{
      setWalletIsAvalible(false)

    }
  }

  if (!walletIsAvalible){
    return (
      <>
      <div>
        <canvas ref={boxRef} style={{width: "100vw", height: "100vh"}} className={`${styles.bg} bg`}></canvas> 
        {/* Still have not the faintest idea what box Ref is */}
      </div>

      <div className={styles.page}>
        <h1>Please connect a metamask wallet, using the metamask browser plugin</h1>
        <h1>Then you may reload this page and continue</h1>
      </div>
      </>
    )
  }else if (!isConnected) {
    return (
      <>
        <div>
          <canvas ref={boxRef} style={{width: "100vw", height: "100vh"}} className={`${styles.bg} bg`}></canvas> 
          {/* Still have not the faintest idea what box Ref is */}
        </div>

      <div className={styles.page}>
        <button onClick={()=>{
          attemptConnect()
        }}><h1>Connect Wallet</h1></button>
      </div>

      </>
    );
  }else if (isAdminPage){
    return (
      <>
        <div>
          <canvas ref={boxRef} style={{width: "100vw", height: "100vh"}} className={`${styles.bg} bg`}></canvas> 
          {/* Still have not the faintest idea what box Ref is */}
        </div>


      <section className={styles.header}>
        <div className={styles.big}>
          <button onClick={()=>{
            setIsAdminPage(true)
          }}><h1>Admin</h1></button>
        </div>
        <div onClick={()=>{
          setIsAdminPage(false)
          setIsMeetingPage(true)
        }} className={styles.small}>
          <button><h1>Meeting</h1></button>
        </div>
      </section>
      <div className={styles.page}>
        <div className="adminZone">
          {adminList.map((admin, index) => (
            <AdminCard key={index} adminName={admin} />
          ))}
        </div>
        <div className={styles.bottomButtons}>
          <button onClick={()=>{
            setIsAdminPage(false)
            setIsMeetingPage(false)
            setIsAddAdminPage(true)
          }}><h1>Add Admin</h1></button>
          <button onClick={()=>{
            setIsAdminPage(false)
            setIsMeetingPage(false)
            setIsAddAdminPage(false)
            setIsRemoveAdminPage(true)

          }}><h1>Remove Admin</h1></button>

        </div>
      </div>
      </>
    )
  }else if (isRemoveAdminPage){
    return (
      <>
        <div>
          <canvas ref={boxRef} style={{width: "100vw", height: "100vh"}} className={`${styles.bg} bg`}></canvas> 
          {/* Still have not the faintest idea what box Ref is */}
        </div>

        <section className={styles.header}>
        <div className={styles.big}>
          <button onClick={()=>{
            setIsAdminPage(true)
            setIsRemoveAdminPage(false)
          }}><h1>Admin</h1></button>
        </div>
        <div onClick={()=>{
          setIsAdminPage(false)
          setIsMeetingPage(true)
          setIsRemoveAdminPage(false)

        }} className={styles.small}>
          <button><h1>Meeting</h1></button>
        </div>
        </section>

        <div className={styles.page}>
          <h1>REMOVE ADMINS</h1>
          <input type="text" placeholder='Address' value={removeAdminAddr} onChange={(e)=>{
            setRemoveAdminAddr(e.target.value)
          }}/>
          <button onClick={()=>{
            fetch("http://10.200.136.135:3005/removeAdmin",{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                removeHash: removeAdminAddr,
                adminHash: account,
              }),
            });
          }}><h1>Submit</h1></button>
        </div>
      </>
    )
  }else if(isMeetingPage){
    return (
      <>
        <div>
          <canvas ref={boxRef} style={{width: "100vw", height: "100vh"}} className={`${styles.bg} bg`}></canvas> 
          {/* Still have not the faintest idea what box Ref is */}
        </div>


      <section className={styles.header}>
        <div className={styles.small}>
          <button onClick={()=>{
            setIsAdminPage(true)
            setIsMeetingPage(false)

          }}><h1>Admin</h1></button>
        </div>
        <div onClick={()=>{
          setIsAdminPage(false)
          setIsMeetingPage(true)
        }} className={styles.big}>
          <button><h1>Meeting</h1></button>
        </div>
      </section>
      <div className={styles.page}>
        <MeetingCard hostName={'Host Name'} timeStart={'Time Start'} dateStart={'Date Start'} timeEnd={'Time End'} address={'Address'}></MeetingCard>
        {meetingList.map((meeting, index) => (
          <MeetingCard key={index} hostName={meeting.host} timeStart={meeting.timeStart} dateStart={meeting.dateStart} timeEnd={meeting.timeEnd} address={meeting.address} />
        ))}
      </div>

      </>
    )
  }else if (isAddAdminPage){
    return (
      <>
          <div>
            <canvas ref={boxRef} style={{width: "100vw", height: "100vh"}} className={`${styles.bg} bg`}></canvas> 
            {/* Still have not the faintest idea what box Ref is */}
          </div>
        <section className={styles.header}>
          <div className={styles.big}>
            <button onClick={()=>{
              setIsAdminPage(true)
              setIsMeetingPage(false)
              setIsAddAdminPage(false)
            }}><h1>Admin</h1></button>
          </div>
          <div onClick={()=>{
            setIsAdminPage(false)
            setIsMeetingPage(true)
            setIsAddAdminPage(false)
          }} className={styles.small}>
            <button><h1>Meeting</h1></button>
          </div>
        </section>
        <div className={styles.page}>
          <h1>Add Admins</h1>
          <input type="text" placeholder='Full Name Here' value={addAdminName} onChange={(e)=>{
            setAddAdminName(e.target.value)
          }}/>
          <input type="text" placeholder="Full Metamask Wallet Address" value={addAdminAddr} onChange={(e)=>{
            setAddAdminAddr(e.target.value)
          }}/>
          <button onClick={()=>{
            addAdmin()
          }}><h1>Submit</h1></button>
        </div>

      </>
    )
  }
}
// End of page.tsx
