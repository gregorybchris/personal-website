interface ProjectRecord {
  project_id: string;
  name: string;
  date: string;
  project_type: string;
  description: string;
  code_link: boolean;
  download_link: boolean;
  image_links: string[];
  archived: boolean;
}

export default ProjectRecord;
