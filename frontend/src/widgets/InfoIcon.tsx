import "../styles/icons.css";

import { Question as QuestionIcon } from "@phosphor-icons/react";

interface InfoIconProps {
  text: string;
}

export default function InfoIcon(props: InfoIconProps) {
  return (
    <div className="inline-block ml-2 align-middle">
      <QuestionIcon className="info-icon mb-1 inline-block" size={20} color="#6283C0" />
      <div className="cursor-default info-icon-text text-text-2 absolute inline-block opacity-0 pl-2 transition-all">
        {props.text}
      </div>
    </div>
  );
}
