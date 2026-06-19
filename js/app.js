import { backBtn, backToScoreBtn, demoBtn, finishBtn, fullscreenBtn, nextBtn, resetBtn, restartBtn, scoreScreen, setupScreen, podiumScreen, teamCountSelect, teamsGrid } from "./dom.js";
import { renderScoreboard } from "./scoreboard.js";
import { renderPodium } from "./podium.js";
import { collectFormData, initializeTeamCountOptions, loadDemo, renderTeamInputs, syncFormFromState } from "./setup.js";
import { state } from "./state.js";
import { hydrateState, persistState } from "./storage.js";

function showSetupScreen() {
  scoreScreen.classList.remove("active");
  podiumScreen.classList.remove("active");
  setupScreen.classList.add("active");
}

function showScoreScreen() {
  setupScreen.classList.remove("active");
  podiumScreen.classList.remove("active");
  scoreScreen.classList.add("active");
  renderScoreboard(state);
}

function showPodiumScreen() {
  setupScreen.classList.remove("active");
  scoreScreen.classList.remove("active");
  podiumScreen.classList.add("active");
  renderPodium(state);
}

nextBtn.addEventListener("click", () => {
  collectFormData(state);
  persistState(state);
  showScoreScreen();
});

demoBtn.addEventListener("click", () => {
  loadDemo();
});

backBtn.addEventListener("click", () => {
  syncFormFromState(state);
  showSetupScreen();
});

resetBtn.addEventListener("click", () => {
  state.teams = state.teams.map((team) => ({ ...team, score: 0 }));
  state.lastChangedIndex = null;
  persistState(state);
  renderScoreboard(state);
});

finishBtn.addEventListener("click", () => {
  showPodiumScreen();
});

backToScoreBtn.addEventListener("click", () => {
  showScoreScreen();
});

restartBtn.addEventListener("click", () => {
  state.teams = state.teams.map((team) => ({ ...team, score: 0 }));
  state.lastChangedIndex = null;
  state.eventName = "";
  state.teams = [];
  localStorage.removeItem("quiz-scoreboard-state");
  showSetupScreen();
  renderTeamInputs();
});

fullscreenBtn.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.warn("Plein écran indisponible sur cet appareil.", error);
  }
});

teamsGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;
  if (!Number.isInteger(index) || !state.teams[index]) return;

  if (action === "plus") state.teams[index].score += 1;
  if (action === "minus") state.teams[index].score = Math.max(0, state.teams[index].score - 1);

  state.lastChangedIndex = index;
  persistState(state);
  renderScoreboard(state);
});

teamCountSelect.addEventListener("change", renderTeamInputs);

initializeTeamCountOptions();
hydrateState(state);
renderTeamInputs();
syncFormFromState(state);

if (state.teams.length) {
  showScoreScreen();
}
