export function timeFromDate(date: Date) {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  
export function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };
    const datePart = new Intl.DateTimeFormat("en-US", options).format(date);
    const timePart = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  
    return `${datePart} at ${timePart}`;
  }
  