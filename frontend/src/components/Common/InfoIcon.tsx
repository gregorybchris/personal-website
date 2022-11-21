import "./styles/InfoIcon.sass";

import questionIcon from "../../images/question.svg";

interface InfoIconProps {
  text: string;
}

export default function InfoIcon(props: InfoIconProps) {
  return (
    <div className="InfoIcon">
      <img className="InfoIcon-icon" src={questionIcon} alt="Clarification" />
      <div className="InfoIcon-text">{props.text}</div>
    </div>
  );
}
