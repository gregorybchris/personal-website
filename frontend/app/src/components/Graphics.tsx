import React from "react";
import {
  Color3,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
} from "@babylonjs/core";
import SceneComponent from "./SceneComponent";
import "./Graphics.css";

let box: any;

const onSceneReady = (scene: any) => {
  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  scene.clearColor = new Color3(0.157, 0.173, 0.204);

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(2, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.5;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: any) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

export default () => (
  <div className="Graphics">
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      onRender={onRender}
      id="my-canvas"
    />
  </div>
);
