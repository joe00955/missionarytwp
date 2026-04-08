export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeUntil(deadline: Date | string): string {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return "EXPIRED";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "RECON":
      return "text-neutral-400 border-neutral-400";
    case "STANDARD":
      return "text-white border-white";
    case "COVERT":
      return "text-neutral-300 border-neutral-300";
    case "BLACK_OPS":
      return "text-white border-white bg-white/10";
    default:
      return "text-neutral-400 border-neutral-400";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "available":
      return "text-neutral-400 border-neutral-600";
    case "active":
      return "text-white border-white";
    case "submitted":
      return "text-neutral-300 border-neutral-400";
    case "under_review":
      return "text-neutral-200 border-neutral-300";
    case "approved":
      return "text-green-400 border-green-400/50";
    case "rejected":
      return "text-red-400 border-red-400/50";
    case "expired":
      return "text-neutral-600 border-neutral-700";
    default:
      return "text-neutral-400 border-neutral-600";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "available":
      return "AVAILABLE";
    case "active":
      return "ACTIVE";
    case "submitted":
      return "SUBMITTED";
    case "under_review":
      return "UNDER REVIEW";
    case "approved":
      return "APPROVED";
    case "rejected":
      return "REJECTED";
    case "expired":
      return "EXPIRED";
    default:
      return status.toUpperCase();
  }
}
