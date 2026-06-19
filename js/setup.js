import { eventNameInput, teamCountSelect, teamInputs } from "./dom.js";
import { defaultColors } from "./state.js";

export function initializeTeamCountOptions() {
  for (let i = 2; i <= 18; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i);
    if (i === 6) option.selected = true;
    teamCountSelect.appendChild(option);
  }
}

export function renderTeamInputs() {
  const count = Number(teamCountSelect.value);
  const previousNames = Array.from(teamInputs.querySelectorAll('input[type="text"]')).map((input) => input.value);
  const previousColors = Array.from(teamInputs.querySelectorAll('input[type="color"]')).map((input) => input.value);
  
  teamInputs.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const row = document.createElement("div");
    row.className = "team-editor-row";

    const index = document.createElement("div");
    index.className = "team-index chalk";
    index.textContent = `E${i + 1}`;

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.className = "team-color";
    colorInput.value = previousColors[i] || defaultColors[i % defaultColors.length];
    colorInput.setAttribute("aria-label", `Couleur de l'équipe ${i + 1}`);

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 30;
    input.placeholder = `Nom de l'équipe ${i + 1}`;
    input.value = previousNames[i] || `Équipe ${i + 1}`;

    row.appendChild(index);
    row.appendChild(colorInput);
    row.appendChild(input);
    teamInputs.appendChild(row);
  }
}

export function syncFormFromState(state) {
  if (!state.teams.length) return;
  eventNameInput.value = state.eventName;
  teamCountSelect.value = String(Math.min(Math.max(state.teams.length, 2), 18));
  renderTeamInputs();
  const inputs = Array.from(teamInputs.querySelectorAll('input[type="text"]'));
  const colors = Array.from(teamInputs.querySelectorAll('input[type="color"]'));
  inputs.forEach((input, index) => {
    input.value = state.teams[index]?.name || `Équipe ${index + 1}`;
  });
  colors.forEach((color, index) => {
    color.value = state.teams[index]?.color || defaultColors[index % defaultColors.length];
  });
}

export function collectFormData(state) {
  const inputs = Array.from(teamInputs.querySelectorAll('input[type="text"]'));
  const colors = Array.from(teamInputs.querySelectorAll('input[type="color"]'));
  
  const names = inputs.map((input, index) => {
    const value = input.value.trim();
    return value || `Équipe ${index + 1}`;
  });

  state.eventName = eventNameInput.value.trim() || "Tournoi";

  const previousScores = new Map(state.teams.map((team) => [team.name, team.score]));
  const previousColors = new Map(state.teams.map((team) => [team.name, team.color]));
  
  state.teams = names.map((name, index) => ({
    name,
    color: colors[index]?.value || previousColors.get(name) || defaultColors[index % defaultColors.length],
    score: previousScores.get(name) || 0
  }));
}

export function loadDemo() {
  eventNameInput.value = "Quiz Séries TV - Le Voyage Heure";
  teamCountSelect.value = "6";
  renderTeamInputs();
  const demoNames = ["Les 456", "Peaky Quizzers", "Team Hawkins", "Les Dragons", "Casa d'Ambiance", "Upside Down"];
  const inputs = Array.from(teamInputs.querySelectorAll('input[type="text"]'));
  const colors = Array.from(teamInputs.querySelectorAll('input[type="color"]'));
  inputs.forEach((input, index) => {
    input.value = demoNames[index] || `Équipe ${index + 1}`;
  });
  colors.forEach((color, index) => {
    color.value = defaultColors[index % defaultColors.length];
  });
}
