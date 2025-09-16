import { useEffect, useState } from "react";
import { Button } from "../components/button";
import { PageTitle } from "../components/page-title";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface ArchiveItem {
  version: number;
  date: string;
  image_links: string[];
}

export function ArchivePage() {
  const [items, setItems] = useState<ArchiveItem[]>([]);

  useEffect(() => {
    const query = makeQuery("archive");
    GET(query).then((items) => {
      setItems(items);
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 px-3 py-8 md:px-8">
      <PageTitle>Archive</PageTitle>

      <div className="flex w-full flex-col items-center gap-8">
        {items.map((item) => (
          <ArchiveSection key={item.version} archiveItem={item} />
        ))}
      </div>
    </div>
  );
}

interface ArchiveSectionProps {
  archiveItem: ArchiveItem;
}

function ArchiveSection({ archiveItem }: ArchiveSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(archiveItem.date);
  const year = date.getFullYear();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row items-center gap-6">
        <div className="font-sanchez text-lg text-black/75">
          ChrisOffline v{archiveItem.version} ({year})
        </div>
        <Button
          text={expanded ? "Collapse" : "Expand"}
          onClick={() => setExpanded(!expanded)}
        />
      </div>

      {expanded && (
        <div className="flex w-full flex-row flex-wrap justify-center gap-4">
          {archiveItem.image_links.map((imageUrl) => (
            <img
              className="w-full shadow-[0_0_6px_2px_rgba(0,0,0,0.3)] md:w-[500px]"
              src={imageUrl}
              key={imageUrl}
              alt="Archive screenshot"
            />
          ))}
        </div>
      )}
    </div>
  );
}
