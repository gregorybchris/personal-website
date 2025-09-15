import { DateTime, Duration } from "luxon";

export function formatDate(dateString: string): string {
  const d = DateTime.fromISO(dateString);
  return d.toLocaleString(DateTime.DATE_MED);
}

export function formatDuration(timeString: string): string {
  const d = Duration.fromISOTime(timeString);
  let result = "";
  if (d.hours > 0) {
    result += `${d.hours}h`;
  }
  if (d.minutes > 0) {
    if (result.length > 0) {
      result += " ";
    }
    result += `${d.minutes}m`;
  }
  return result;
}
