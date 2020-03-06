import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import '../style/model5.css';

export default function EarthSplineScroll(props){
  let scene = new THREE.Scene();
  let camera3D = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

  const [camPosIndex, setcamPosIndex ] = useState(0);
  const [cameraState, setCameraState ] = useState();
  const [spline, setSpline] = useState();
  const [title, setTitle] = useState(false);
  const [text, setText] = useState(false);
  const [h1Fade, setH1Fade] = useState(false);
  const [display, setDisplay] = useState(false)

  useEffect(()=>{
    let renderer = new THREE.WebGLRenderer({ alpha : true, antialias: true});
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight);
    document.querySelector('#obj-3D').appendChild( renderer.domElement );

    initTreeJs(scene,camera3D,renderer).then((res)=>{
      setSpline(res.spline)
      setCameraState(res.camera)
      animate(renderer, res.earth)
      window.addEventListener('resize',  () => handleWindowResize(renderer, res.camera))
    });
  },[]);


  useEffect(() => {
    if (!cameraState || !spline) return

    let camPos = spline.getPoint(camPosIndex / 10000)

    cameraState.position.x = camPos.x;
    cameraState.position.z = camPos.z;
    cameraState.position.y = camPos.y;
    cameraState.lookAt(0, 0, 0);
  }, [camPosIndex]);


  async function initTreeJs(scene,camera,renderer){

    let promise = new Promise((resolve, reject) => {

          scene.background = new THREE.Color( 0x000000 )
          var loaderTexture = new THREE.TextureLoader();

          // *** TERRE ***//
          let geometry = new THREE.SphereGeometry(0.4, 32, 32);
          let material = new THREE.MeshPhongMaterial();
          material.map = loaderTexture.load(process.env.PUBLIC_URL+"/earthmap1k.jpg")
          material.bumpMap = loaderTexture.load(process.env.PUBLIC_URL+"/earthbump1k.jpg")
          material.specularMap = loaderTexture.load(process.env.PUBLIC_URL+"/earthspec1k.jpg")
          material.specular  = new THREE.Color('grey')
          material.bumpScale = 0.05
          let earth = new THREE.Mesh( geometry, material );
          earth.position.set(0,0,0)
          scene.add( earth );

          // **** LIGHTS *** //
          let light = new THREE.AmbientLight( 0xffffff, 0.02 );
          scene.add( light );

          let directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
          directionalLight.position.set(10,10,10)
          scene.add( directionalLight );

          // *** ETOILES *** //
          for (var i = 0; i < 400; i++) {
            var b = new THREE.Mesh(
              new THREE.SphereGeometry( 0.5, 32, 32 ),
              new THREE.MeshBasicMaterial({color: "#EEEDDD"})
            );
            b.position.x = -300 + Math.random() * 600;
            b.position.y = -300 + Math.random() * 600;  
            b.position.z = -300 + Math.random() * 600;
            
            scene.add(b);
          }

          // *** SPLINE CAMERA *** //
            const splinePoints =  [
              new THREE.Vector3( -2, -4, 2 ),
              new THREE.Vector3( 1, 0, 1 ),
              new THREE.Vector3( 2, 7, -2 ),
              new THREE.Vector3( -2, 0, -2 ),
            ] 
            //** Create a closed wavey loop **//
            let spline = new THREE.CatmullRomCurve3(splinePoints, false, "chordal");


          // **** CAMERA SETTINGS *** //
          camera.position.x = -1.9991990685168373;
          camera.position.y = -3.9999988561106123;
          camera.position.z = 2;
          camera3D.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
          camera.updateMatrixWorld();

          renderer.render( scene, camera );

          resolve({obj :scene, camera, spline, earth})
    })

    let value = await promise
    return value
  };

  //*** PERMET LE RENDU ET LES ANIMATIONS ***//
  function animate(renderer, earth) {

    requestAnimationFrame(() => animate(renderer, earth));
    renderer.render( scene, camera3D );

    // *** MOVING HEARTH ***//
    earth.rotation.y += 0.005;
  };

  //*** INCREMENTE CAMPOSINDEX AVEC LE SCROLL ***//
  const handleMouseWheel = (e) =>{

    let y = camPosIndex + e.deltaY

    if (y >= 0 && y <= 10000){
      setcamPosIndex(camPosIndex + e.deltaY)
    } 


    if (y > 2900 && y < 3850){
      setDisplay(true)
    } else {
      setDisplay(false)
    }


    if( y > 3000 && y < 3750){
      setTitle(true)
    } else {
      setTitle(false)
    }


    if( y > 2670){
      setH1Fade(true)
    } else {
      setH1Fade(false)
    }

    console.log(title)
  };

  const handleText = () => {
    setText(!text)
  }

  //*** ALLOW RESIZING WINDOW ***//
  const handleWindowResize = (renderer, camera) =>{      
    let width = window.innerWidth;
    let height = window.innerHeight;

    renderer.setSize(width, height)
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
  }

  return (
      <>
      <div onWheel={(e) => handleMouseWheel(e)}>
        <div style={ { opacity: title ? '1' : '0', display: display ? "block" : "none"}} id="title" >
          <h3>Caractéristiques</h3>
          <img src={process.env.PUBLIC_URL + '/button.svg'} onClick={handleText} style={{transform: text ? "rotate(45deg)" : "rotate(0deg)"}} />
          <p style= {{opacity: text ? "1" : "0"}}>
            <b>Diamètre à l'équateur:</b> 12 756 km <br/><br/>
            <b>Masse:</b> 5974 milliards de milliards de tonnes <br/><br/>
            <b>Densité moyenne:</b> 5,52 (eau : 1)<br/><br/>
            <b>Température moyenne de surface:</b> 14°C<br/><br/>
            <b>Composition de l'atmosphère:</b> Azote (78%), oxygène (21%), gaz carbonique, vapeur d'eau, gaz rares.<br/><br/>
            <b>Période de rotation:</b> 23 heures 56 minutes 4 secondes<br/><br/>
            <b>Rayon moyen de l'orbite:</b> 149,598 millions de kilomètres<br/><br/>
            <b>Période de révolution:</b> 365 jours 6 heures et 9 minutes
            </p>
        </div>
        <div id="obj-3D"></div>
        <h1 style={ { opacity: h1Fade ? '0' : '1' } }>LA TERRE</h1>
      </div>
      </>
  )
};
