import React from "react";

import SceneComponent from "./SceneComponent";
import "./Graphics.css";

import {
  Color3,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
} from "@babylonjs/core";

let box: any;

const onSceneReady = (scene: any) => {
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();
  scene.clearColor = new Color3(0.157, 0.173, 0.204);
  camera.attachControl(canvas, true);

  var light = new HemisphericLight("light", new Vector3(2, 1, 0), scene);
  light.intensity = 0.5;

  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position.y = 1;

  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

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
