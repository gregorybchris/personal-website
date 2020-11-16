interface ProjectRecord {
  project_id: string;
  name: string;
  date: string;
  rating: number;
  project_type: string;
  controls: string | null;
  description: string | null;
  remarks: string | null;
  code_link: string | null;
  download_link: string | null;
  image_links: string[];
  primary_language: string;
  archived: boolean;
}

export default ProjectRecord;
