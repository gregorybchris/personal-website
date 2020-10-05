interface EventRecord {
  event_id: string;
  name: string;
  date: string;
  event_type: string;
  content_type: string;
  short_description: string;
  long_description: string;
  deleted: boolean;
}

export default EventRecord;
