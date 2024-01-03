import BookData from "./BookData";
import BookTag from "./BookTag";

interface BookProps {
  book: BookData;
  activeTags: string[];
  onTagClick: (tag: string) => void;
  bookShape: string;
}

export default function Book(props: BookProps) {
  const imageLinks = props.book.image_links;
  const imageLink = props.bookShape == "square" ? imageLinks.square : imageLinks.book;
  return (
    <div className="mb-4">
      <a href={props.book.goodreads_link} target="_blank">
        <div className="py-4 flex justify-center">
          <img src={`${imageLink}?a=2`} className="w-48" />
        </div>

        <div className="font-bold text-center">{props.book.title}</div>
        <div className="text-center">{props.book.author}</div>
      </a>

      {props.bookShape == "book" && (
        <div className="flex justify-center mt-1">
          {props.book.tags.map((tag) => (
            <BookTag key={tag} tag={tag} onClick={props.onTagClick} active={props.activeTags.includes(tag)} />
          ))}
        </div>
      )}
    </div>
  );
}
