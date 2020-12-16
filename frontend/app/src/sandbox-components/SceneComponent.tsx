import React, { useEffect, useRef } from "react";

import { Engine, Scene } from "@babylonjs/core";

export default (props: any) => {
  const reactCanvas = useRef(null);
  const { antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest } = props;

  useEffect(() => {
    if (reactCanvas.current) {
      const engine = new Engine(reactCanvas.current, antialias, engineOptions, adaptToDeviceRatio);
      const scene = new Scene(engine, sceneOptions);
      if (scene.isReady()) {
        props.onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => props.onSceneReady(scene));
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === "function") {
          onRender(scene);
        }
        scene.render();
      });

      const resize = () => {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener("resize", resize);
      }

      return () => {
        scene.getEngine().dispose();

        if (window) {
          window.removeEventListener("resize", resize);
        }
      };
    }
  }, [reactCanvas, antialias, adaptToDeviceRatio, engineOptions, onRender, sceneOptions, props]);

  return <canvas ref={reactCanvas} {...rest} />;
};
