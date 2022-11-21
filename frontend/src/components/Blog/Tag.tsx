import "./styles/Tag.sass";

interface TagProps {
  text: string;
  onClickTag: (tag: string) => void;
}

export default function Tag(props: TagProps) {
  return (
    <div className="Tag" onClick={() => props.onClickTag(props.text)}>
      <span className="Tag-text">#{props.text}</span>
    </div>
  );
}
