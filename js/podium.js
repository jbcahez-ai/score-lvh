import { podiumGrid } from "./dom.js";
import { defaultColors } from "./state.js";
import { escapeHtml } from "./utils.js";

export function renderPodium(state) {
  // Sort teams by score (descending) while preserving original index
  const sortedTeams = state.teams
    .map((team, index) => ({ ...team, originalIndex: index }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3

  // Pad with placeholders if less than 3 teams
  while (sortedTeams.length < 3) {
    sortedTeams.push({ name: "-", score: 0, color: "#666", originalIndex: -1 });
  }

  // Render podium in order: 2nd, 1st, 3rd (center is first)
  const podiumOrder = [sortedTeams[1], sortedTeams[0], sortedTeams[2]];
  const positions = ["second", "first", "third"];

  podiumGrid.innerHTML = podiumOrder
    .map((team, index) => {
      // Use the team's own color, or fall back to default based on original index
      const color = team.color || defaultColors[team.originalIndex % defaultColors.length];
      return `
        <article class="podium-card ${positions[index]}" style="--team-color: ${color}">
          <div class="podium-rank">${index + 1}</div>
          <div class="podium-team-name chalk">${escapeHtml(team.name)}</div>
          <div class="podium-score">${team.score} pts</div>
          <div class="podium-pillar"></div>
        </article>
      `;
    })
    .join("");

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