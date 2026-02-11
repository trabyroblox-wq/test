// Main elements
const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
const categorySelect = document.getElementById("categorySelect");
const showFavoritesBtn = document.getElementById("showFavoritesBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");
const darkModeToggle = document.getElementById("darkModeToggle");
const showNamesToggle = document.getElementById("showNamesToggle");
const funButton = document.getElementById("funButton");
const themeSelect = document.getElementById("themeSelect");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");

let allGames = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let clicks = JSON.parse(localStorage.getItem("clicks")) || {};
let recent = JSON.parse(localStorage.getItem("recent")) || [];
let showOnlyFavorites = false;

// Fetch games
fetch("games.json")
  .then(res => res.json())
  .then(data => {
    allGames = data.games;
    populateCategories();
    render(allGames);
    if (musicToggle.checked) bgMusic.play();
  });

// Render games
function render(games) {
  if (showOnlyFavorites) games = games.filter(g => favorites.includes(g.name));
  // Sort by clicks for trending
  games.sort((a,b) => (clicks[b.name] || 0) - (clicks[a.name] || 0));

  grid.innerHTML = "";

  if (games.length === 0) {
    grid.innerHTML = "<p style='text-align:center;color:#888;'>No games found.</p>";
    return;
  }

  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game";
    div.innerHTML = `
      <img src="${game.image}" alt="${game.name}">
      <div class="name">${game.name}</div>
      <div class="heart">${favorites.includes(game.name) ? '❤️' : '🤍'}</div>
    `;
    // Click to play
    div.onclick = (e) => {
      if (e.target.className === 'heart') return; // skip if heart clicked
      // Update clicks & recent
      clicks[game.name] = (clicks[game.name] || 0) + 1;
      localStorage.setItem("clicks", JSON.stringify(clicks));
      recent = recent.filter(g => g !== game.name);
      recent.unshift(game.name);
      recent = recent.slice(0,5);
      localStorage.setItem("recent", JSON.stringify(recent));
      window.location.href = `play.html?url=${encodeURIComponent(game.url)}`;
    };
    // Heart click
    div.querySelector(".heart").onclick = (e) => {
      e.stopPropagation();
      if (favorites.includes(game.name)) {
        favorites = favorites.filter(f => f !== game.name);
      } else {
        favorites.push(game.name);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      render(allGames);
    };
    grid.appendChild(div);
  });
}

// Search + Easter egg
search.addEventListener("input", () => {
  const q = search.value.toLowerCase();
  if (q === "bear") {
    grid.innerHTML = `
      <div style="display:flex;justify-content:center;align-items:center;flex-direction:column;">
        <img src="assets/bear.png" style="width:300px;height:auto;margin-top:20px;">
        <div style="color:#b784ff;font-size:24px;margin-top:10px;">🐻 You found the bear!</div>
      </div>
    `;
    return;
  }
  if (q === "admin") {
    alert("🎉 Secret game unlocked!"); // can redirect to secret.html
    return;
  }
  const filtered = allGames.filter(g => g.name.toLowerCase().includes(q));
  render(filtered);
});

// Category filter
categorySelect.addEventListener("change", () => {
  const cat = categorySelect.value;
  const filtered = cat === "all" ? allGames : allGames.filter(g => g.category === cat);
  render(filtered);
});

// Favorites filter
showFavoritesBtn.addEventListener("click", () => {
  showOnlyFavorites = !showOnlyFavorites;
  showFavoritesBtn.style.background = showOnlyFavorites ? "#b784ff" : "#888";
  render(allGames);
});

// Populate category select
function populateCategories() {
  const cats = [...new Set(allGames.map(g => g.category).filter(Boolean))];
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });
}

// Settings panel
settingsBtn.addEventListener("click", () => settingsPanel.classList.add("show"));
closeSettings.addEventListener("click", () => settingsPanel.classList.remove("show"));

// Dark mode toggle
darkModeToggle.addEventListener("change", () => {
  document.body.style.background = darkModeToggle.checked ? "#0b0b0b" : "#fff";
  document.body.style.color = darkModeToggle.checked ? "#fff" : "#000";
});

// Show/hide game names
showNamesToggle.addEventListener("change", () => {
  document.querySelectorAll(".game .name").forEach(nameDiv => {
    nameDiv.style.display = showNamesToggle.checked ? "block" : "none";
  });
});

// Fun secret button
funButton.addEventListener("click", () => alert("🎉 You found a secret in settings!"));

// Music toggle
musicToggle.addEventListener("change", () => {
  if (musicToggle.checked) bgMusic.play();
  else bgMusic.pause();
});

// Themes
const themes = {
  purpleBlack: { primary: "#b784ff", secondary: "#e0d7ff", glow: "rgba(183,132,255,0.6)" },
  blueBlack: { primary: "#7fd1ff", secondary: "#cceeff", glow: "rgba(127,209,255,0.6)" },
  redBlack: { primary: "#ff7f7f", secondary: "#ffcccc", glow: "rgba(255,127,127,0.6)" },
  greenBlack: { primary: "#7fff7f", secondary: "#ccffcc", glow: "rgba(127,255,127,0.6)" }
};
function applyTheme(name) {
  const t = themes[name];
  document.querySelector(".top h1").style.color = t.primary;
  document.querySelector("#settingsBtn").style.background = t.primary;
  document.querySelectorAll(".game").forEach(card => {
    card.querySelector(".name").style.color = t.secondary;
    card.onmouseover = () => card.style.boxShadow = `0 0 25px ${t.glow}`;
    card.onmouseout = () => card.style.boxShadow = "none";
  });
}
themeSelect.addEventListener("change", () => applyTheme(themeSelect.value));
applyTheme("purpleBlack");
