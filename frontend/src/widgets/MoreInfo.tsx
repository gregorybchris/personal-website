import "../styles/icons.css";

import { Question as QuestionIcon } from "@phosphor-icons/react";

interface MoreInfoProps {
  text: string;
}

export function MoreInfo({ text }: MoreInfoProps) {
  return (
    <div className="ml-2 inline-block align-middle">
      <QuestionIcon
        className="info-icon mb-1 inline-block"
        size={20}
        color="#6283c0"
      />
      <div className="info-icon-text absolute inline-block cursor-default pl-2 text-text-2 opacity-0 transition-all">
        {text}
      </div>
    </div>
  );
}
