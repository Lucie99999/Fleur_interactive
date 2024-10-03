import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Flower{
    //Constructeur de la classe Flower
    constructor(){
        //On définit les propriétés de la classe.
        this.canvas = document.querySelector('.js-canvas');
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        //On lance certaines méthodes de la classe à son instanciation.
        this.init();
    }

    //Méthode permettant de lancer des fonctions choisies de la classe Flower.
    init(){
        this.createScene();
        this.createCamera();
        this.createRender();
        this.createCube();
        this.createControls();
        this.animate();
    }

    //On crée une scène. En général, on a 1 scène par projet. Il s'agit de l'espace de dessin 3D.
    createScene(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#DAF7A6');
        return this.scene;
    }

    //On crée une caméra, notre point de vue.
    createCamera(){
        const aspectRatio = this.canvasWidth / this.canvasHeight;
        this.camera = new THREE.PerspectiveCamera( 45, aspectRatio, 0.1, 1000 );
        this.camera.position.z=5;
        return this.camera;
    }

    //On crée un render pour afficher la scène du point de vue de la caméra.
    createRender(){
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        //On met animate.bind pour récupérer la valeur du "this"; la portée de la fonction ne permettait pas de le faire sans.
        this.renderer.setAnimationLoop(this.animate.bind(this))
        this.canvas.appendChild(this.renderer.domElement);
        return this.renderer;
    }

    //Méthode pour ajouter une forme.
    createCube(){
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeColor = new THREE.Color( 'red');
        const material = new THREE.MeshBasicMaterial( {color: cubeColor, wireframe: true} );
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.rotation.x = Math.PI*0,25;
        this.cube.rotation.y = Math.PI*0,25;
        this.scene.add(this.cube);
        return this.cube;
    }

    createControls(){
        this.controls = new OrbitControls(this.camera,this.renderer.domElement );
        this.controls.autoRotate=true;
        return this.controls;
    }

    //On fait un rendu en continu.
    animate(){
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.controls.update();

        //On fait le rendu c'est à dire qu'on montre le point de vue de la caméra dans la scène.
        this.renderer.render(this.scene,this.camera );
    }
}


export {Flower};