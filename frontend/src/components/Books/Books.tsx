import { GET, makeQuery } from "../../utilities/requestUtilities";
import { useEffect, useState } from "react";

import Book from "./Book";
import BookData from "./BookData";

export default function Books() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    const booksQuery = makeQuery("media/books");
    GET(booksQuery).then((books: BookData[]) => {
      setBooks(books);
    });
  }, []);

  function onTagClick(tag: string) {
    let newTags: string[] = [];
    if (activeTags.includes(tag)) {
      newTags = activeTags.filter((activeTag) => activeTag !== tag);
    } else {
      newTags = [...activeTags, tag];
    }
    setActiveTags(newTags);
  }

  return (
    <div className="font-raleway pt-8 grid justify-items-center">
      <div className="w-4/5">
        <div className="font-noto text-text-1 text-3xl font-bold mb-5 text-center">Books</div>
        <div className="text-text-1 pb-5 text-center">
          I don't consider myself a big reader, but I do try to get a couple in every year. Here are some books I
          enjoyed!
        </div>
      </div>
      <div className="w-4/5 grid grid-cols-3 pt-5 justify-items-center">
        {books
          .filter((book) => activeTags.length == 0 || book.tags.some((tag) => activeTags.includes(tag)))
          .sort((bookA, bookB) => bookB.recommendability - bookA.recommendability)
          .map((book) => (
            <Book key={book.isbn} book={book} onTagClick={onTagClick} activeTags={activeTags} />
          ))}
      </div>
    </div>
  );
}
