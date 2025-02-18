import moment from "moment";

export const isDatePassed = (date: string | Date) => {
  const dateToCheck = moment(Number(date));
  const currentDate = moment();
  return dateToCheck.isBefore(currentDate);
};

export const isVideoConference = (location: string) => {
  const videoConference = ['visio conférence', 'visio conf', 'visioconférence', 'visio-conference', 'videoconference', 'video conferencing', 'visio', 'aucune localisation'];
  return videoConference.some((word) => location.toLowerCase().includes(word));
}

export function formatDuration(duration: string): string {
  const totalMinutes = parseInt(duration, 10);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let formattedDuration = '';
  if (hours > 0) {
    formattedDuration += `${hours}h `;
  }
  if (minutes > 0) {
    formattedDuration += `${minutes}m`;
  }

  return formattedDuration.trim();
}
