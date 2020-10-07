interface EventRecord {
  event_id: string;
  name: string;
  date: string;
  event_type: string;
  content_type: string;
  description: string;
  has_code: boolean;
  has_download: boolean;
  archived: boolean;
}

export default EventRecord;
