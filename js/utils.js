export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getRanks(teams) {
  const sorted = [...teams]
    .map((team, index) => ({ index, score: team.score }))
    .sort((a, b) => b.score - a.score);

  const rankMap = new Map();
  let currentRank = 1;

  sorted.forEach((item, i) => {
    if (i > 0 && item.score < sorted[i - 1].score) {
      currentRank = i + 1;
    }
    rankMap.set(item.index, currentRank);
  });

  return rankMap;
}

export function rankLabel(rank) {
  if (rank === 1) return "1re place";
  return `${rank}e place`;
}
