import { useEffect, useState } from "react";

import BookData from "./BookData";
import BookTag from "./BookTag";
import { Optional } from "../../utilities/typeUtilities";

interface BookProps {
  book: BookData;
  activeTags: string[];
  onTagClick: (tag: string) => void;
}

export default function Book(props: BookProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<Optional<string>>();

  useEffect(() => {
    fetchThumbnail();
  }, []);

  async function fetchThumbnail() {
    const isbn = props.book.isbn.replace("-", "");
    let thumbnailUrl;
    for (let i = 0; i < 10; i++) {
      try {
        const queryUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
        const response = await fetch(queryUrl);
        const data = await response.json();
        thumbnailUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
      } catch (error) {
        console.error("Throttled");
      }
      if (thumbnailUrl) break;
      await new Promise((r) => setTimeout(r, 1000));
    }
    setThumbnailUrl(thumbnailUrl);
  }

  return (
    <div className="w-64 mb-10">
      <div className="font-bold text-center">{props.book.title}</div>
      <div className="text-center">{props.book.author}</div>

      {thumbnailUrl && (
        <div className="py-4 flex justify-center">
          <img src={thumbnailUrl} />
        </div>
      )}

      <div className="flex justify-center">
        {props.book.tags.map((tag) => (
          <BookTag key={tag} tag={tag} onClick={props.onTagClick} active={props.activeTags.includes(tag)} />
        ))}
      </div>
    </div>
  );
}
