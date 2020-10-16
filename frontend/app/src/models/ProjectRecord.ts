interface ProjectRecord {
  project_id: string;
  name: string;
  date: string;
  project_type: string;
  description: string | null;
  code_link: string | null;
  download_link: string | null;
  image_links: string[];
  primary_language: string;
  archived: boolean;
}

export default ProjectRecord;
