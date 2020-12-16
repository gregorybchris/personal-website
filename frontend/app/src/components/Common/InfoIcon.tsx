import React from "react";

import questionIcon from "../../images/question.svg";

import "./styles/InfoIcon.sass";

interface InfoIconProps {
  text: string;
}

const InfoIcon = (props: InfoIconProps) => {
  return (
    <div className="InfoIcon">
      <img className="InfoIcon-icon" src={questionIcon} alt="Clarification"></img>
      <div className="InfoIcon-text">{props.text}</div>
    </div>
  );
};

export default InfoIcon;
