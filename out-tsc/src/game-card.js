import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
let GameCard = class GameCard extends LitElement {
    constructor() {
        super(...arguments);
        this.id = '';
        this.description = '';
        this.value = '';
        this.color = '';
        this.backgroundColor = '';
        this.left = '';
        this.zindex = '';
        this.isselected = "false";
    }
    handleClick() {
        this.dispatchEvent(new CustomEvent('game-card-click', {
            detail: { id: this.id },
            bubbles: true,
            composed: true
        }));
    }
    getDescription() {
        const a = this.description.split('______ ');
        if (this.value !== '') {
            return html `
        <span>${a[0]}</span>
        <span style="font-weight: 400; font-family: sans-serif; font-size: 30px; text-decoration: underline">${this.value}</span>
        <span style="margin-left: -6px">${a[1]}</span>
      `;
        }
        return this.description;
    }
    render() {
        return html `
    <div class="card ${this.backgroundColor}" @click=${this.handleClick} style="left: ${this.left}; z-index: ${this.isselected === "true" ? 1000 : this.zindex};">
      <p>${this.getDescription()}<span class="point">.</span></p>
    </div>
  `;
    }
};
GameCard.styles = css `
  .card {
    height: 400px;
    width: 250px;
    padding-top: 20px;
    padding-left: 22px;
    padding-right: 22px;
    border-radius: 10px;
  }

  .card:first-letter {
    text-transform: uppercase;
  }

  .black {
    background-color: red;
    color: black;
    font-size: 37px;
    font-family: "gandur-new", sans-serif;
    font-weight: 300;
    font-style: normal;
    line-height: 42px;
    rotate: -5deg;
    margin: auto;
    margin-top: 20px;
  }

  .white {
    background-color: white;
    color: black;
    font-size: 25px;
    rotate: 10deg;
    border: 1px black solid;
    display: inline-block;
    position: absolute;
    margin-top: -200px;
  }

  .card p {
    margin: 0px;
  }

  .black .point {
    display: none;
  }
`;
__decorate([
    property({ type: String })
], GameCard.prototype, "id", void 0);
__decorate([
    property({ type: String })
], GameCard.prototype, "description", void 0);
__decorate([
    property({ type: String })
], GameCard.prototype, "value", void 0);
__decorate([
    property({ type: String })
], GameCard.prototype, "color", void 0);
__decorate([
    property({ type: String })
], GameCard.prototype, "backgroundColor", void 0);
__decorate([
    property({ type: String })
], GameCard.prototype, "left", void 0);
__decorate([
    property({ type: String })
], GameCard.prototype, "zindex", void 0);
__decorate([
    property({ type: String })
], GameCard.prototype, "isselected", void 0);
GameCard = __decorate([
    customElement('game-card')
], GameCard);
export { GameCard };
//# sourceMappingURL=game-card.js.map