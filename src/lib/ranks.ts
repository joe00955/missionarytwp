export const RANKS = [
  { name: "Initiate", minPoints: 0 },
  { name: "Operative", minPoints: 100 },
  { name: "Agent", minPoints: 500 },
  { name: "Specialist", minPoints: 1000 },
  { name: "Commander", minPoints: 2500 },
  { name: "Shadow Elite", minPoints: 5000 },
] as const;

export function getRankForPoints(points: number): string {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].minPoints) return RANKS[i].name;
  }
  return "Initiate";
}

export function getNextRank(
  points: number
): { name: string; pointsNeeded: number } | null {
  for (const rank of RANKS) {
    if (points < rank.minPoints) {
      return { name: rank.name, pointsNeeded: rank.minPoints - points };
    }
  }
  return null;
}

export function getRankProgress(points: number): number {
  let currentMin = 0;
  let nextMin = 100;
  for (let i = 0; i < RANKS.length; i++) {
    if (points >= RANKS[i].minPoints) {
      currentMin = RANKS[i].minPoints;
      nextMin = i < RANKS.length - 1 ? RANKS[i + 1].minPoints : RANKS[i].minPoints;
    }
  }
  if (currentMin === nextMin) return 100;
  return Math.round(((points - currentMin) / (nextMin - currentMin)) * 100);
}
