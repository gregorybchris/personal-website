import React from "react";

import Music from "./Music";
import States from "./States";
import Graphics from "./Graphics";

export default () => {
  return (
    <div className="Sandbox">
      <Graphics />
      <States />
      <Music />
    </div>
  );
};
