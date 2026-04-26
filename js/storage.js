const STORAGE_KEY = "quiz-scoreboard-state";

export function persistState(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      eventName: state.eventName,
      teams: state.teams
    })
  );
}

export function hydrateState(state) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.teams)) return;

    state.eventName = typeof parsed.eventName === "string" ? parsed.eventName : "";
    state.teams = parsed.teams
      .filter((team) => team && typeof team.name === "string")
      .map((team, index) => ({
        name: team.name || `Équipe ${index + 1}`,
        color: typeof team.color === "string" && /^#[0-9A-Fa-f]{6}$/.test(team.color) ? team.color : null,
        score: Number.isFinite(team.score) ? Math.max(0, team.score) : 0
      }));
  } catch (error) {
    console.warn("Impossible de charger la sauvegarde locale.", error);
  }
}
