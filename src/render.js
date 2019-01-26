import * as BABYLON from 'babylonjs';
import { player } from './camera-player';
import { Enemy } from './enemy';
import { GroundMaterial } from './ground-material';

function BuildWall(x1, z1, x2, z2, scene){
    var wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(1,0,1);
    wallMaterial.backFaceCulling = false;
    var wall, wall_width;

    if ((z1 - z2) == 0){
        wall_width = (x1 > x2) ? (x1 - x2) : (x2 - x1);
        wall = BABYLON.MeshBuilder.CreatePlane("wall", {width: wall_width, height: 2.5}, scene);
        wall.setPositionWithLocalVector(new BABYLON.Vector3((x1+x2)/2, 1.25, z1));
    }
    else{
        wall_width = (z1 > z2) ? (z1 - z2) : (z2 - z1);
        console.log(wall_width);
        wall = BABYLON.MeshBuilder.CreatePlane("wall", {width: wall_width, height: 2.5}, scene);
        wall.setPositionWithLocalVector(new BABYLON.Vector3(x1, 1.25, (z1+z2)/2));
        wall.rotation.y = Math.PI/2;
    }

    wall.material = wallMaterial;
    wall.checkCollisions = true;
}

export class Render {
    static render() {
        // Get the canvas DOM element
        var canvas = document.getElementById('canvas');
        // Load the 3D engine
        var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        // CreateScene function that creates and return the scene
        var createScene = function () {
            // Create a basic BJS Scene object
            var scene = new BABYLON.Scene(engine);
            scene.collisionsEnabled = true;
            scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

            // setup player and camera
            player.setup(scene);

            // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
            var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

            var enemy1 = new Enemy(-5, 0);
            enemy1.setup(scene);

            // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
            var ground = BABYLON.Mesh.CreateGround('ground1', 1000, 1000, 2, scene, false);
            GroundMaterial.addMaterial(ground, scene);
            ground.checkCollisions = true;

            BuildWall(-5,5,5,5, scene);
            BuildWall(5,5,5,-5, scene);
            BuildWall(5,-5,-5,-5, scene);
            BuildWall(-5,5,-5,-5, scene);



            // Return the created scene
            return scene;
        }
        // call the createScene function
        var scene = createScene();
        // run the render loop
        engine.runRenderLoop(function () {
            scene.render();
        });
        // the canvas/window resize event handler
        window.addEventListener('resize', function () {
            engine.resize();
        });

    }
}
