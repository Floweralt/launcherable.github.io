async function loadGames() {
  try {
    const res = await fetch("/api/games");
    const games = await res.json();

    const gameGrid = document.getElementById("gameGrid");
    const gameFrame = document.getElementById("gameFrame");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const gameCount = document.getElementById("gameCount");
    const searchInput = document.getElementById("searchInput");

    gameGrid.innerHTML = "";

    const gameIcons = {
      'Baldi': '📚',
      'Bendy': '🎨',
      'FNAF': '🐻',
      'FNAF 1': '🐻'
    };

    const availableGames = [];
    const comingSoonGames = [];

    games.forEach(game => {
      if (game.entry) {
        availableGames.push(game);
      } else {
        comingSoonGames.push(game);
      }
    });

    const totalAvailableGames = availableGames.length;
    gameCount.textContent = `${totalAvailableGames} Game${totalAvailableGames !== 1 ? 's' : ''}`;

    let activeCard = null;

    availableGames.forEach(game => {
      const card = document.createElement("div");
      card.className = "game-card";

      const icon = gameIcons[game.title] || '🎮';

      card.innerHTML = `
        <div class="game-card-header">
          <div class="game-icon">${icon}</div>
          <div class="game-info">
            <div class="game-title">${game.title}</div>
            <div class="game-status">
              <span class="status-dot"></span><span>Ready to play</span>
            </div>
          </div>
        </div>
      `;

      card.onclick = () => {
        if (activeCard) {
          activeCard.classList.remove("active");
        }

        card.classList.add("active");
        activeCard = card;

        welcomeScreen.classList.add("hidden");
        gameFrame.src = game.entry;
        gameFrame.classList.add("visible");
      };

      gameGrid.appendChild(card);
    });

    comingSoonGames.forEach(game => {
      const card = document.createElement("div");
      card.className = "game-card disabled";

      const icon = gameIcons[game.title] || '🎮';

      card.innerHTML = `
        <div class="game-card-header">
          <div class="game-icon">${icon}</div>
          <div class="game-info">
            <div class="game-title">${game.title}</div>
            <div class="game-status">
              <span>Coming soon</span>
            </div>
          </div>
        </div>
      `;

      gameGrid.appendChild(card);
    });

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const cards = gameGrid.querySelectorAll(".game-card");

      cards.forEach(card => {
        const title = card.querySelector(".game-title").textContent.toLowerCase();
        if (title.includes(searchTerm)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });

  } catch (error) {
    console.error("Failed to load games:", error);
  }
}

loadGames();
