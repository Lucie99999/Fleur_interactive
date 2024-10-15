import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {degToRad} from "three/src/math/MathUtils";

class Flower{
    //Constructeur de la classe Flower
    constructor(stemHeight){
        //On définit les propriétés de la classe.
        this.canvas = document.querySelector('.js-canvas');
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.stemHeight = stemHeight;
        this.animation = {
            rotationX:0,
            rotationZ:0
        };
        this.turn="aller";
        //On lance certaines méthodes de la classe à son instanciation.
        this.init();
    }

    //Méthode permettant de lancer des fonctions choisies de la classe Flower.
    init(){
        this.createScene();
        this.axesHelper();
        this.createCamera();
        this.createRender();
        this.createGroupFlower();
        this.createControls();
        this.animate();
    }

    //Méthode qui permet de créer une scène. En général, on a 1 scène par projet. Il s'agit de l'espace de dessin 3D.
    createScene(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#DAF7A6');
        return this.scene;
    }

    //En mode développement, méthode qui ajoute le repère.
    axesHelper(){
        const axesHelper = new THREE.AxesHelper( 100);
        //this.scene.add(axesHelper);
    }
    //Méthode qui crée une caméra, notre point de vue.
    createCamera(){
        const aspectRatio = this.canvasWidth / this.canvasHeight;
        this.camera = new THREE.PerspectiveCamera( 45, aspectRatio, 0.1, 1000 );
        this.camera.position.z=-250;
        this.camera.position.y=50;
        this.camera.position.x=-150;
        return this.camera;
    }

    //Méthode qui crée un render pour afficher la scène du point de vue de la caméra.
    createRender(){
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        //On met animate.bind pour récupérer la valeur du "this"; la portée de la fonction ne permettait pas de le faire sans.
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.canvas.appendChild(this.renderer.domElement);
        return this.renderer;
    }

    //Méthode pour ajouter un cube à la scène
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

    //Méthode pour ajouter la tige de la fleur
    createStem(){
        const geometry = new THREE.CylinderGeometry( 2,2, this.stemHeight, 64 );
        const material = new THREE.MeshBasicMaterial( {color: 0x77aa1a} );
        this.cylinder = new THREE.Mesh(geometry,material);
        this.cylinder.position.x = 0;
        this.cylinder.position.y = this.stemHeight/2;
        this.cylinder.position.z = 0;
        return this.cylinder;
    }

    //Méthode pour ajouter le pistil de la fleur
    createPistil(){
        const geometry = new THREE.SphereGeometry( 4, 64, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xeafa2e } );
        this.sphere = new THREE.Mesh(geometry,material);
        this.sphere.position.x = 0;
        this.sphere.position.y=this.stemHeight;
        this.sphere.position.z = 0;
        return this.sphere;
    }

    //Méthode pour ajouter un pétal à la fleur
    createPetal(angle,positionX,positionY,positionZ,color){
        const geometry = new THREE.TorusGeometry( 6, 1, 16, 100 );
        const colorHexa = new THREE.Color(color);
        const material = new THREE.MeshBasicMaterial( { color: colorHexa} );
        this.torus = new THREE.Mesh(geometry,material);
        this.torus.position.x=positionX;
        this.torus.position.y=positionY;
        this.torus.position.z=positionZ;
        this.torus.rotation.x=degToRad(angle);
        return this.torus;
    }

    //Méthode pour regrouper tous les éléments de la fleur et pouvoir ensuite les animer tous ensemble.
    createGroupFlower(){
        this.groupFlower = new THREE.Group();
        this.groupFlower.add(this.createStem());
        this.groupFlower.add(this.createPistil());
        this.groupFlower.add(this.createPetal(45,10,this.stemHeight,0, "rgb(250,163,46)"));
        this.groupFlower.add(this.createPetal(45,-10,this.stemHeight,0,"rgb(255, 87, 51)"));
        this.groupFlower.add(this.createPetal(45,0,(this.stemHeight)+5,5,"rgb(194, 46, 250)"));
        this.groupFlower.add(this.createPetal(45,0,(this.stemHeight)-5,-5,"rgb(250, 46, 226)"));
        this.scene.add(this.groupFlower);
    }

    //Méthode pour faire tourner l'objet avec la souris.
    createControls(){
        this.controls = new OrbitControls(this.camera,this.renderer.domElement );
        this.controls.autoRotate=false;
        return this.controls;
    }

    //Méthode pour faire un rendu en continu.
    animate(){
        //Animation de la fleur :
        //Si aucune ville renseignée, la fleur tourne sur elle-même,
        if (window.data.city===""){
            this.groupFlower.rotation.y += 0.01;
        } else {
        //Si une ville est sélectionnée suite à une autre, on reset les données de rotation de la fleur.
            if (window.data.resetAnimation){
                this.animation.rotationX = 0;
                this.animation.rotationZ = 0;
                window.data.resetAnimation = false;
            } else {
                const speed = 0.01 * window.data.windSpeed;
                let windData = 0;
                //en fonction de la direction du vent, on donne une valeur à windData.
                if (window.data.windDirection < 90){
                    windData = window.data.windDirection;
                } else if (window.data.windDirection > 90 && window.data.windDirection < 180){
                    windData = 180 - window.data.windDirection;
                } else if (window.data.windDirection > 180 && window.data.windDirection < 270){
                    windData = (270 - window.data.windDirection);
                } else if (window.data.windDirection >= 270){
                    windData = window.data.windDirection;
                }
                //On anime la fleur en faisant des allers retours.
                if (this.animation.rotationX <= windData && this.animation.rotationZ <= windData && this.turn == "aller") {
                    this.animation.rotationX += speed;
                    this.animation.rotationZ += speed;
                    this.groupFlower.rotation.z = degToRad(this.animation.rotationZ)
                    this.groupFlower.rotation.x = degToRad(this.animation.rotationX)
                } else if (this.animation.rotationX >= windData && this.turn == "aller"){
                    this.turn="retour";
                } else if (this.animation.rotationX >= -windData && this.animation.rotationZ >= -windData && this.turn=="retour"){
                    this.animation.rotationX -= speed;
                    this.animation.rotationZ -= speed;
                    this.groupFlower.rotation.z = degToRad(this.animation.rotationZ)
                    this.groupFlower.rotation.x = degToRad(this.animation.rotationX)
                } else if (this.animation.rotationX <= -windData && this.turn == "retour"){
                    this.turn="aller";
                }
            }

        }

        this.controls.update();

        //On fait le rendu c'est à dire qu'on montre le point de vue de la caméra dans la scène.
        this.renderer.render(this.scene,this.camera );
    }
}


export {Flower};