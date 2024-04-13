export class SuperMissionCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.bookmarked = false;
    this.isFlipped = false;
    this.bindMethods();
  }

  // Lifecycle Callbacks
  connectedCallback() {
    this._loadCardDetails();
    this.render();
    this.manageEventListeners(true);
  }

  disconnectedCallback() {
    this.manageEventListeners(false);
  }

  static get observedAttributes() {
    return ["card-id", "card-type", "card-name", "card-description"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (
      name !== "card-id" &&
      name !== "card-type" &&
      name !== "card-name" &&
      name !== "card-description"
    )
      return;
    this[`_${name}`] = newValue;
    this.render();
  }

  // Event Handling
  bindMethods() {
    this.toggleBookmark = this.toggleBookmark.bind(this);
    this._handleUnfavorite = this._handleUnfavorite.bind(this);
    this.flipCard = this.flipCard.bind(this);
  }

  manageEventListeners(addListeners) {
    const flipControl = this.shadowRoot.querySelector(".card-flip");
    if (addListeners) {
      document.addEventListener("unfavorite-card", this._handleUnfavorite);
      flipControl.addEventListener("click", this.flipCard);
    } else {
      document.removeEventListener("unfavorite-card", this._handleUnfavorite);
      flipControl.removeEventListener("click", this.flipCard);
    }
  }

  _handleUnfavorite(event) {
    if (event.detail.cardId === this._cardId && this.bookmarked) {
      this.bookmarked = false;
      this.render();
    }
  }

  // Custom Logic Methods
  flipCard() {
    this.isFlipped = !this.isFlipped;
    this.updateFlipState();
  }

  toggleBookmark() {
    this.bookmarked = !this.bookmarked;
    try {
      let favorites = JSON.parse(
        localStorage.getItem("FAVOURITE_CARDS_LIST_STORE") || "[]"
      );
      if (this.bookmarked) {
        favorites.push(this.cardInfo());
      } else {
        favorites = favorites.filter((card) => card.id !== this._cardId);
      }
      localStorage.setItem(
        "FAVOURITE_CARDS_LIST_STORE",
        JSON.stringify(favorites)
      );
      localStorage.setItem(`bookmark-${this._cardId}`, this.bookmarked);
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
    this.dispatchEvent(
      new CustomEvent("bookmark-change", {
        detail: this.cardInfo(),
        bubbles: true,
        composed: true,
      })
    );
    this.updateBookmarkIcon();
  }

  // Getters and Setters
  get cardId() {
    return this.getAttribute("card-id");
  }
  set cardId(value) {
    if (this._cardId !== value) {
      this._cardId = value;
      this.setAttribute("card-id", value);
    }
  }

  get cardType() {
    return this.getAttribute("card-type");
  }
  set cardType(value) {
    if (this._cardType !== value) {
      this._cardType = value;
      this.setAttribute("card-type", value);
    }
  }

  get cardName() {
    return this.getAttribute("card-name");
  }
  set cardName(value) {
    if (this._cardName !== value) {
      this._cardName = value;
      this.setAttribute("card-name", value);
    }
  }

  get cardDescription() {
    return this.getAttribute("card-description");
  }
  set cardDescription(value) {
    if (this._cardDescription !== value) {
      this._cardDescription = value;
      this.setAttribute("card-description", value);
      this.render();
    }
  }

  // Rendering and Updates
  render() {
    const bookmarkIcon = this.bookmarked ? "★" : "☆";

    this.shadowRoot.innerHTML = `
      <style>
      :host {
        display: block;
        position: relative;
        width: var(--card-width, 200px);
        height: var(--card-height, 300px);
        border-radius: 8px;
        overflow: hidden;
        perspective: 1000px;
      }
      .card-content {
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
      }
      .flipped {
        transform: rotateY(180deg);
      }
      .card {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
      
      .bookmark-icon {
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 10px;
        font-size: 24px;
      }
      .card-id {
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 12px;
        color: var(--gray, #6c757d);
      }
      .card-flip {
        cursor: pointer;
        position: absolute;
        bottom: 5px;
        right: 10px;
        font-size: 20px;
        color: var(--black, #000);
      }
      .card.front-card {
        background-color: var(--color-mission, #e2c364);
      }
      .card.back-card {
        background-color: var(--white, #fff);
        color: var(black, #000);
        transform: rotateY(180deg);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border: 2px solid var(--color-mission, #e2c364);
        border-radius: 10px;
        align-items: flex-start;
        padding: 10px;
      }
      .card-type,
      .card-name {
        text-transform: uppercase;
        font-weight: bold;
      }
      
      .front-card .card-type {
        color: var(--light-blue, #74a7de);
        font-size: 20px;
        padding-bottom: 40px;
      }
      
      .back-card .card-description {
        padding-top: 10px;
        font-size: 14px;
      }
      .back-card .card-type {
        font-size: 22px;
      }
      .back-card .card-name {
        font-size: 18px;
        line-height: 1.2;
      }
      .card-name-icon {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        padding-top: 10px;
      }
      .card-icon img {
        height: 35px;
        width: auto;
      }      
      </style>
  
        <div class="card-content">
        <div class="card front-card">
        <span class="bookmark-icon">${bookmarkIcon}</span>
        <div class="card-type"><span>${this._cardType}</span></div>
        <img src="../assets/images/super_assessor.png" alt="Super Assessor" style="width: 100%"/>
        </div>
       
        <div class="card back-card">
        <span class="bookmark-icon">${bookmarkIcon}</span>
        <div class="card-type"><span>${this._cardType}</span>
        </div>
        <div class="card-name-icon">
        <div class="card-name"><span>${this._cardName}</span></div>
        <div class="card-icon"><img src="${this._iconSrc}" alt="Mission icon"></div>
        </div>
        <div class="card-description">${this._cardDescription}</span>
        <span></div>
        <div class="card-id"><span>${this._cardId}</span></div>
        </div>
        <div class="card-flip">&#8617;</div>
        </div>
      `;
    this.addAllEventListeners();

    const cardContent = this.shadowRoot.querySelector(".card-content");
    if (this.isFlipped) {
      cardContent.classList.add("flipped");
    } else {
      cardContent.classList.remove("flipped");
    }
  }

  updateFlipState() {
    const cardContent = this.shadowRoot.querySelector(".card-content");
    if (this.isFlipped) {
      cardContent.classList.add("flipped");
    } else {
      cardContent.classList.remove("flipped");
    }
  }

  updateBookmarkIcon() {
    const bookmarkIcon = this.shadowRoot.querySelectorAll(".bookmark-icon");
    const iconText = this.bookmarked ? "★" : "☆";
    bookmarkIcon.forEach((icon) => (icon.textContent = iconText));
  }

  _loadCardDetails() {
    this._cardId = this.getAttribute("card-id");
    this._cardType = this.getAttribute("card-type");
    this._cardName = this.getAttribute("card-name");
    this._cardDescription = this.getAttribute("card-description");
    this.bookmarked =
      localStorage.getItem(`bookmark-${this._cardId}`) === "true";

    const iconMap = {
      Innovation: "../assets/images/innovation.png",
      "Time management": "../assets/images/time_management.png",
      Learning: "../assets/images/learning.png",
      "Student engagement": "../assets/images/student_engagement.png",
      Authenticity: "../assets/images/authenticity.png",
      "Cost cutting": "../assets/images/cost_cutting.png",
      "Counteract cheating": "../assets/images/counteract_cheating.png",
    };

    this._iconSrc = iconMap[this._cardName] || "../images/default_mission.png";
  }

  cardInfo() {
    return {
      id: this._cardId,
      type: this._cardType,
      name: this._cardName,
      description: this._cardDescription,
      bookmarked: this.bookmarked,
      timestamp: new Date().toISOString(),
    };
  }

  addAllEventListeners() {
    const bookmarkIcons = this.shadowRoot.querySelectorAll(".bookmark-icon");
    const flipControl = this.shadowRoot.querySelector(".card-flip");

    bookmarkIcons.forEach((icon) => {
      icon.removeEventListener("click", this.toggleBookmark);
      icon.addEventListener("click", this.toggleBookmark);
    });

    flipControl.removeEventListener("click", this.flipCard);
    flipControl.addEventListener("click", this.flipCard);
  }
}

customElements.define("super-mission-card", SuperMissionCard);
