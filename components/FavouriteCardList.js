export class FavouriteCardList extends HTMLElement {
  connectedCallback() {
    window.addEventListener("bookmark-change", () => this.loadFavorites());
    this.loadFavorites();
  }

  loadFavorites() {
    this.innerHTML = "";
    const favorites = JSON.parse(
      localStorage.getItem("FAVOURITE_CARDS_LIST_STORE") || "[]"
    );
    favorites.forEach((card) => {
      const li = document.createElement("li");
      const formattedDate = new Date(card.timestamp).toLocaleString();
      // Check the type of the card
      if (card.type === "Mission") {
        // Display mission card information
        li.innerHTML = `(${formattedDate})<br><b>Type:</b> ${card.type}<br><b>Name:</b> ${card.name}<br><b>Description:</b> ${card.description}`;
      } else if (card.type === "assessment") {
        // Display assessment card information
        li.innerHTML = `(${formattedDate})<br><b>Category:</b> ${card.category}<br><b>Name:</b> ${card.name}<br><b>Description:</b> ${card.description}<br><b>Details:</b> ${card.details}`;
      } else {
        // Handle unknown card types or future expansion
        li.textContent = `Unknown card`;
      }

      // Create and append the delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => {
        const updatedFavorites = favorites.filter((fav) => fav.id !== card.id);

        // Check if the card was indeed removed, then update its bookmark flag
        if (updatedFavorites.length < favorites.length) {
          localStorage.setItem(`bookmark-${card.id}`, "false"); // Set bookmark flag to false
        }

        localStorage.setItem(
          "FAVOURITE_CARDS_LIST_STORE",
          JSON.stringify(updatedFavorites)
        );
        this.loadFavorites(); // Reload the favorites to update the UI

        // Dispatch the unfavorite-card event
        document.dispatchEvent(
          new CustomEvent("unfavorite-card", { detail: { cardId: card.id } })
        );
      };

      li.appendChild(deleteBtn);
      this.appendChild(li);
    });
  }
}

customElements.define("favourite-card-list", FavouriteCardList);
