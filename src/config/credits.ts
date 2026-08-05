export const FLOW_CREDITS = {
  DAILY_LIMIT: 50,
  COST_PER_SHOT: 25,
  RESET_HOURS: 24
};

export function getRemainingTime(lastGeneratedAt: Date) {
  const resetTime = new Date(lastGeneratedAt.getTime() + FLOW_CREDITS.RESET_HOURS * 60 * 60 * 1000);
  const now = new Date();
  const diff = resetTime.getTime() - now.getTime();
  
  if (diff <= 0) return null;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}
