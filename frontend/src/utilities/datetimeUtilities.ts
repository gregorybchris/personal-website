import { Duration } from "luxon";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const yearNumber = date.getFullYear();
  const monthNumber = date.getMonth();
  const dayNumber = date.getDate() + 1;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[monthNumber];
  return `${monthName}. ${dayNumber}, ${yearNumber}`;
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
