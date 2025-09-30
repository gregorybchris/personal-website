import { ExportIcon } from "@phosphor-icons/react";
import { isMobileDevice } from "../utilities/device-utilities";
import { cn } from "../utilities/style-utilities";

interface ShareButtonProps {
  url: string;
  text: string;
  shareTitle?: string;
  shareText?: string;
  enabled?: boolean;
  className?: string;
}

export default function ShareButton({
  url,
  text,
  shareTitle,
  shareText,
  enabled = true,
  className,
}: ShareButtonProps) {
  const onClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title: shareTitle, text: shareText });
      } catch (err) {
        console.error("Share canceled or failed: ", err);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const canShare = isMobileDevice() && !!navigator.share;
  if (!canShare) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-row items-center gap-2 rounded-md px-3 py-1 hover:bg-black/5",
        className,
      )}
      aria-disabled={!enabled}
      disabled={!enabled}
    >
      <ExportIcon size={20} weight="duotone" color="#6283c0" />
      <span className="text-md">{text}</span>
    </button>
  );
}
