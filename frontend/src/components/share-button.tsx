import { ExportIcon } from "@phosphor-icons/react";

interface ShareButtonProps {
  url: string;
  text: string;
  shareTitle?: string;
  shareText?: string;
}

export default function ShareButton({
  url,
  text,
  shareTitle,
  shareText,
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

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-row items-center gap-2 rounded-md px-3 py-1 hover:bg-black/5"
    >
      <ExportIcon size={20} weight="duotone" color="#6283c0" />
      <span className="text-md">{text}</span>
    </div>
  );
}
