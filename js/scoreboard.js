import { scoreboardSubtitle, scoreboardTitle, teamsGrid } from "./dom.js";
import { defaultColors } from "./state.js";
import { escapeHtml, getRanks, rankLabel } from "./utils.js";

export function renderScoreboard(state) {
  scoreboardTitle.textContent = state.eventName || "Tournoi";
  scoreboardSubtitle.textContent = `${state.teams.length} équipe${state.teams.length > 1 ? "s" : ""} · classement en direct`;

  const rankMap = getRanks(state.teams);

  const rankingHtml = state.teams
    .map((team, index) => ({
      name: team.name,
      score: team.score,
      rank: rankMap.get(index) || 1,
      color: team.color || defaultColors[index % defaultColors.length]
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "fr"))
    .map((team) => `
      <div class="ranking-row ${team.rank === 1 ? "leader" : ""}" style="--team-color: ${team.color}">
        <div class="ranking-left">
          <div class="ranking-badge">${team.rank}</div>
          <div class="ranking-name">${escapeHtml(team.name)}</div>
        </div>
        <div class="ranking-score">${team.score}</div>
      </div>
    `)
    .join("");

  let rankingBlock = document.getElementById("rankingBlock");
  if (!rankingBlock) {
    rankingBlock = document.createElement("section");
    rankingBlock.id = "rankingBlock";
    rankingBlock.className = "ranking-block";
    rankingBlock.innerHTML = `
      <div class="ranking-header">
        <button id="rankingToggle" class="ranking-toggle" aria-label="Masquer le classement">
          <span class="ranking-toggle-icon">▼</span>
        </button>
        <div class="ranking-title-wrap">
          <h2 class="ranking-title chalk">Classement</h2>
          <p class="ranking-help">Le classement se met à jour en direct selon les scores.</p>
        </div>
      </div>
      <div id="rankingList" class="ranking-list"></div>
    `;
    teamsGrid.parentNode.insertBefore(rankingBlock, teamsGrid);
    
    // Add toggle event listener
    document.getElementById("rankingToggle").addEventListener("click", () => {
      rankingBlock.classList.toggle("collapsed");
      const icon = rankingBlock.querySelector(".ranking-toggle-icon");
      icon.textContent = rankingBlock.classList.contains("collapsed") ? "▶" : "▼";
    });
  }

  document.getElementById("rankingList").innerHTML = rankingHtml;

  teamsGrid.innerHTML = state.teams
    .map((team, index) => {
      const rank = rankMap.get(index) || 1;
      const bumpClass = state.lastChangedIndex === index ? "bump" : "";
      const teamColor = team.color || defaultColors[index % defaultColors.length];

      return `
        <article class="team-card ${rank === 1 ? "top-1" : ""}" style="--team-color: ${teamColor}">
          <div class="team-top">
            <div class="rank-badge">E${index + 1}</div>
            <div class="team-name-wrap">
              <h2 class="team-name chalk">${escapeHtml(team.name)}</h2>
              <div class="team-rank-label">${rankLabel(rank)}</div>
            </div>
          </div>
          <div class="score-box">
            <div class="score-value ${bumpClass}">${team.score}</div>
          </div>
          <div class="score-controls">
            <button class="score-btn minus" data-action="minus" data-index="${index}" aria-label="Retirer un point à ${escapeHtml(team.name)}">−</button>
            <button class="score-btn plus" data-action="plus" data-index="${index}" aria-label="Ajouter un point à ${escapeHtml(team.name)}">+</button>
          </div>
        </article>
      `;
    })
    .join("");

  if (state.lastChangedIndex !== null) {
    setTimeout(() => {
      state.lastChangedIndex = null;
    }, 260);
  }
}
