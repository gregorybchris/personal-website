import "../styles/icons.css";

import { Question as QuestionIcon } from "@phosphor-icons/react";

interface InfoIconProps {
  text: string;
}

export default function InfoIcon(props: InfoIconProps) {
  return (
    <div className="ml-2 inline-block align-middle">
      <QuestionIcon
        className="info-icon mb-1 inline-block"
        size={20}
        color="#6283C0"
      />
      <div className="info-icon-text absolute inline-block cursor-default pl-2 text-text-2 opacity-0 transition-all">
        {props.text}
      </div>
    </div>
  );
}
