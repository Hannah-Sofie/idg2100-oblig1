export class SuperAssessmentCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.bookmarked = false;
    this.isFlipped = false;
    this.bindMethods();
    this.keyName = 'FAVOURITE_CARDS_LIST_STORE';
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
    return [
      "card-id",
      "card-type",
      "card-category",
      "card-name",
      "card-description",
      "card-details",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (
      name !== "card-id" &&
      name !== "card-type" &&
      name !== "card-category" &&
      name !== "card-name" &&
      name !== "card-description" &&
      name !== "card-details"
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

  get cardCategory() {
    return this.getAttribute("card-category");
  }
  set cardCategory(value) {
    if (this._cardCategory !== value) {
      this._cardCategory = value;
      this.setAttribute("card-category", value);
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
    }
  }

  get cardDetails() {
    return this.getAttribute("card-details");
  }
  set cardDetails(value) {
    if (this._cardDetails !== value) {
      this._cardDetails = value;
      this.setAttribute("card-details", value);
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
        right: 10px;
        bottom: 5px;
        font-size: 20px;
        color: var(--black, #000);
      }
      
      .card.front-card {
        background-color: var(--category-color, #e2c364);
        text-align: center;
      }
      
      .card.back-card {
        background-color: var(--white, #fff);
        color: var(black, #000);
        transform: rotateY(180deg);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border: 2px solid var(--category-color, #e2c364);
        border-radius: 10px;
        align-items: flex-start;
      }
      
      .card-category,
      .card-name {
        text-transform: uppercase;
        font-weight: bold;
      }
      
      .front-card .card-category {
        font-size: 20px;
        padding: 10px;
        line-height: 1.2;
      }
      
      .back-card .card-category,
      .back-card .card-description,
      .back-card .card-name,
      .back-card .card-details {
        line-height: 1.2;
        padding-left: 10px;
      }

      .back-card .card-category {
        font-size: 16px;
        padding-right: 10px;
      }

      .back-card .card-name {
        font-size: 18px;
        padding-top: 15px;
        padding-bottom: 5px;
      }

      .back-card .card-description {
        font-size: 14px;
      }
      .back-card .card-details {
        color: var(--gray, #6c757d);
        font-size: 12px;
      }

      .back-card .card-details p {
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
        margin: 0;
        padding-top: 20px;
        padding-bottom: 5px;
      }
      
      .card-category-icon {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background-color: var(--category-color, #e2c364);
        width: 100%;
        padding: 10px 0;
      }
      
      .card-icon img {
        padding-left: 10px;
        filter: invert(100%) grayscale(100%);
      }

      .front-card .card-icon img {
        height: 45px;
        width: auto;
      }

      .back-card .card-icon img {
        height: 30px;
        width: auto;
      }
      </style>

      <div class="card-content">
        <div class="card front-card">
          <span class="bookmark-icon">${bookmarkIcon}</span>
          <div class="card-icon">
            <img src="${this._iconSrc}" alt="Assessment icon" />
          </div>
          <div class="card-category">
            <span class="card-category">${this._cardCategory}</span>
          </div>
          <img
            src="../assets/images/super_assessor.png"
            alt="Super Assessor"
            style="width: 100%"
          />
        </div>
      
        <div class="card back-card">
          <span class="bookmark-icon">${bookmarkIcon}</span>
          <div class="card-category-icon">
            <div class="card-icon">
              <img src="${this._iconSrc}" alt="Assessment icon" />
            </div>
            <div class="card-category"><span>${this._cardCategory}</span></div>
          </div>
          <div class="card-name"><span>${this._cardName}</span></div>
          <div class="card-description"><span>${this._cardDescription}</span></div>
          <div class="card-details">
            <p>How/Tips</p>
            <span>${this._cardDetails}</span>
          </div>
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
    this._cardCategory = this.getAttribute("card-category");
    this._cardName = this.getAttribute("card-name");
    this._cardDescription = this.getAttribute("card-description");
    this._cardDetails = this.getAttribute("card-details");
    this.bookmarked =
      localStorage.getItem(`bookmark-${this._cardId}`) === "true";

    const categoryColorVariables = {
      "Who is assessed": "--color-who-is-assessed", // Blue
      "The assessor": "--color-the-assessor", // Purple
      "Assessment artefact": "--color-artefact", // Red
      "Assessment format": "--color-format", // Green
      Context: "--color-context", // Pink
      "Assessment timing": "--color-timing", // Orange
    };

    // Get the color for the current category
    const categoryColorVariable = categoryColorVariables[this._cardCategory];

    if (categoryColorVariable) {
      this.style.setProperty(
        "--category-color",
        `var(${categoryColorVariable})`
      );
    } else {
      console.error(
        "Category color variable not found for:",
        this._cardCategory
      );
    }

    const iconMap = {
      "Who is assessed": "../assets/images/who_is_assessed.png",
      "The assessor": "../assets/images/the_assessor.png",
      "Assessment artefact": "../assets/images/assessment_artefact.png",
      "Assessment format": "../assets/images/assessment_format.png",
      Context: "../assets/images/context.png",
      "Assessment timing": "../assets/images/assessment_timing.png",
    };

    this._iconSrc =
      iconMap[this._cardCategory] || "../images/default_assessment.png";
  }

  cardInfo() {
    return {
      id: this._cardId,
      type: this._cardType,
      category: this._cardCategory,
      name: this._cardName,
      description: this._cardDescription,
      details: this._cardDetails,
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

customElements.define("super-assessment-card", SuperAssessmentCard);
