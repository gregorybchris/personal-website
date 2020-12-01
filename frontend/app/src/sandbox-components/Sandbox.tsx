import React from "react";

import States from "./States";
import Graphics from "./Graphics";

export default () => {
  return (
    <div className="Sandbox">
      <Graphics />
      <States />
    </div>
  );
};
