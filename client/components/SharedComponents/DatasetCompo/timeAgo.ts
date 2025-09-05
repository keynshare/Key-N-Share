
export default function timeAgo(createdAt: string) {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);
  
    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
  
    if (seconds < 60) return `${seconds} seconds ago`;
  
    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) {
        return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
      }
    }
  }
  