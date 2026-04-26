import { podiumGrid } from "./dom.js";
import { defaultColors } from "./state.js";
import { escapeHtml } from "./utils.js";

export function renderPodium(state) {
  // Group teams by score (handle ties)
  const scoreGroups = new Map();
  state.teams.forEach((team, index) => {
    const key = team.score;
    if (!scoreGroups.has(key)) {
      scoreGroups.set(key, []);
    }
    scoreGroups.get(key).push({ ...team, originalIndex: index });
  });

  // Sort scores descending and take top 3 positions
  const sortedScores = Array.from(scoreGroups.keys()).sort((a, b) => b - a);
  
  // Build podium with ties handled
  const podiumTeams = [];
  let position = 0;
  
  for (const score of sortedScores) {
    const teamsWithScore = scoreGroups.get(score);
    for (const team of teamsWithScore) {
      if (position < 3) {
        podiumTeams.push({ ...team, podiumPosition: position });
        position++;
      }
    }
  }

  // Pad with placeholders if less than 3 positions filled
  while (podiumTeams.length < 3) {
    podiumTeams.push({ name: "-", score: 0, color: "#666", originalIndex: -1, podiumPosition: position });
    position++;
  }

  // Separate into podium rows (same score = same row)
  const podiumRows = [];
  let currentRow = [];
  let currentScore = null;
  
  for (const team of podiumTeams) {
    if (currentScore === null || team.score === currentScore) {
      currentRow.push(team);
      currentScore = team.score;
    } else {
      if (currentRow.length > 0) {
        podiumRows.push([...currentRow]);
      }
      currentRow = [team];
      currentScore = team.score;
    }
  }
  if (currentRow.length > 0) {
    podiumRows.push([...currentRow]);
  }

  // Render podium with scores below
  let html = '<div class="podium-container">';
  
  // Render each row (could have multiple teams per row for ties)
  for (let rowIndex = 0; rowIndex < podiumRows.length; rowIndex++) {
    const rowTeams = podiumRows[rowIndex];
    const positionClass = rowIndex === 0 ? "first" : rowIndex === 1 ? "second" : "third";
    
    html += `<div class="podium-row ${positionClass}">`;
    
    for (const team of rowTeams) {
      const color = team.color || defaultColors[team.originalIndex % defaultColors.length];
      html += `
        <article class="podium-card" style="--team-color: ${color}">
          <div class="podium-rank">${rowIndex + 1}</div>
          <div class="podium-team-name chalk">${escapeHtml(team.name)}</div>
          <div class="podium-pillar"></div>
        </article>
      `;
    }
    
    html += '</div>';
  }
  
  html += '</div>';
  
  // Add scores below the podium
  html += '<div class="podium-scores">';
  for (let i = 0; i < Math.min(3, podiumTeams.length); i++) {
    const team = podiumTeams[i];
    const color = team.color || defaultColors[team.originalIndex % defaultColors.length];
    html += `
      <div class="podium-score-item" style="--team-color: ${color}">
        <span class="podium-score-rank">${i + 1}</span>
        <span class="podium-score-name">${escapeHtml(team.name)}</span>
        <span class="podium-score-value">${team.score} pts</span>
      </div>
    `;
  }
  html += '</div>';

  podiumGrid.innerHTML = html;

  // Trigger confetti
  triggerConfetti();
}

function triggerConfetti() {
  const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#e91e63"];
  const confettiCount = 150;
  const container = document.querySelector(".podium-shell");
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    
    // Random properties
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = 2 + Math.random() * 2;
    const size = 8 + Math.random() * 8;
    const rotation = Math.random() * 360;
    
    confetti.style.cssText = `
      --confetti-color: ${color};
      left: ${left}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      width: ${size}px;
      height: ${size}px;
      transform: rotate(${rotation}deg);
    `;
    
    container.appendChild(confetti);
  }

  // Clean up confetti after animation
  setTimeout(() => {
    document.querySelectorAll(".confetti").forEach((el) => el.remove());
  }, 5000);
}