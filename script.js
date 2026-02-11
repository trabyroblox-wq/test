// --- Elements ---
const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
let allGames = [];

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");
const showNamesToggle = document.getElementById("showNamesToggle");
const funButton = document.getElementById("funButton");
const themeSelect = document.getElementById("themeSelect");
const modeSelect = document.getElementById("modeSelect");

// --- State ---
let currentTheme = "purpleBlack";
let currentMode = "dark";

// --- Fetch Games ---
fetch("games.json")
  .then(res => res.json())
  .then(data => {
    allGames = data.games;
    render(allGames);
  });

// --- Render Games ---
function render(games) {
  grid.innerHTML = "";

  if (games.length === 0) {
    grid.innerHTML = "<p style='text-align:center;color:#888;'>No games found.</p>";
    return;
  }

  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = `<img src="${game.image}" alt="${game.name}"><div class="name">${game.name}</div>`;
    div.onclick = () => window.location.href = `play.html?url=${encodeURIComponent(game.url)}`;
    grid.appendChild(div);
  });

  document.querySelectorAll(".game .name").forEach(nameDiv => {
    nameDiv.style.display = showNamesToggle.checked ? "block" : "none";
  });
}

// --- Search & Bear Easter Egg ---
search.addEventListener("input", () => {
  const q = search.value.toLowerCase();

  if (q === "bear") {
    grid.innerHTML = `
      <div class="bear-message" style="display:flex;justify-content:center;align-items:center;flex-direction:column;">
        <img src="assets/bear.png" style="width:300px;height:auto;margin-top:20px;">
        <div style="font-size:24px;margin-top:10px;">🐻 You found the bear!</div>
      </div>`;
    return;
  }

  render(allGames.filter(g => g.name.toLowerCase().includes(q)));
});

// --- Settings Panel ---
settingsBtn.addEventListener("click", () => settingsPanel.classList.toggle("show"));
closeSettings.addEventListener("click", () => settingsPanel.classList.remove("show"));

// --- Show/Hide Game Names ---
showNamesToggle.addEventListener("change", () => render(allGames));

// --- Theme & Mode ---
themeSelect.addEventListener("change", () => {
  document.body.classList.remove(currentTheme);
  currentTheme = themeSelect.value;
  document.body.classList.add(currentTheme);
});

modeSelect.addEventListener("change", () => {
  document.body.classList.remove(currentMode);
  currentMode = modeSelect.value;
  document.body.classList.add(currentMode);
});

// --- Fun Button ---
funButton.addEventListener("click", () => alert("🎉 You found a secret!"));
