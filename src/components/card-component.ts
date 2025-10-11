import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { Utils } from '../utils';
import { sharedStyles } from '../shared-styles';

@customElement('card-component')
export class CardComponent extends LitElement {
  @property({ type: String }) id = '';
  @property({ type: String }) description = '';
  @property({ type: String }) value = '';
  @property({ type: String }) color = '';
  @property({ type: String }) backgroundColor = '';
  @property({ type: String }) left = '';
  @property({ type: String }) zindex = '';
  @property({ type: String }) choosable = false;
  @property({ type: String }) favorite = '';
  @property({ type: String }) cardNumber = '';


  static styles = [
    sharedStyles, css`
    .card {
    width: 233px;
    height: 377px;
    padding-left: 21px;
    padding-right: 21px;
    padding-bottom: 21px;
    padding-top: 17px;
    border-radius: 13px;
  }

  .card:first-letter {
    text-transform: uppercase;
  }

  .choosable {
     position: absolute;
  }

  .black {
    background-color: #ff0000;
    color: black;
    font-size: 18pt;
    font-style: normal;
    line-height: 22pt;
    rotate: -5deg;
    border: 1px black solid;
    margin: auto;
    margin-top: 20px;
    font-family: "tablet-gothic", sans-serif;
    font-weight: 300;
  }

  .white {
    background-color: white;
    color: black;
    font-size: 20.625pt;
    rotate: 8deg;
    border: 1px black solid;
    display: inline-block;
    margin-top: -200px;
    font-family: "eskapade-fraktur", serif;
    font-weight: 400;
    line-height: 22pt;
  }

  .card p {
    margin: 0px;
  }

  .black .point {
    display: none;
  }

@keyframes swap {
  50% {
    transform: translateX(var(--swap-x, 310px)) scale(0.85);
    animation-timing-function: ease-in;
    z-index: +1000;
  }
  60% {
    z-index: 0;
  }
  100% {
    transform: translateX(var(--swap-end-x, -90px)) translateY(var(--swap-end-y, 13px)) scale(1);
    z-index: 0;
  }
}

@keyframes reverse-swap {
  50% {
     transform: translateX(var(--reverse-swap-x, 400px)) scale(0.85);
     z-index: 0;
  }  
  60% {
     z-index: +1000; 
  }
  100% {
     transform: translateX(var(--reverse-swap-end-x, 90px)) translateY(var(--swap-end-y, 13px)) scale(1);
     animation-timing-function: ease-in;
     z-index: +1000;
  }
}

@keyframes slide-left {
  100% {
     animation-timing-function: ease-in;
     transform: translateX(+10px);
  }  
}

@keyframes slide-right {
  100% {
     animation-timing-function: ease-in;
     transform: translateX(-10px);
  }  
}

@keyframes slide-up {
30% {
     opacity: 1;
  }
100% {
     animation-timing-function: ease-in;
     transform: translateY(-500px);
     opacity: 0;
     rotate: -5deg;
  }  
}

@keyframes slide-more-down {
100% {
     animation-timing-function: ease-in;
     transform: translateY(+500px);
  }
}

@keyframes slide-down {
100% {
     animation-timing-function: ease-in;
     transform: translateY(+230px) translateX(-20px);
  }
}

.favorite-container {
  position: absolute;
  bottom: 15px; 
  right: 15px; 
}

.not-favorite {
  stroke: black;
  stroke-width: 15px;
  fill: red;
}

.favorite {
  stroke: black;
  stroke-width: 15px;
  fill: black;
}
`];

  handleClickFavorite(e: any) {
    e.stopPropagation(); // blocca la propagazione del click
    this.dispatchEvent(new CustomEvent('card-favorite', {
      detail: { id: this.id, description: this.description, value: this.value, favorite: (this.favorite === 'false') },
      bubbles: true,
      composed: true
    }));
    this.requestUpdate();
  }

  getLeftPosition() {
    const cardDiv = this.renderRoot.querySelector('.card') as HTMLElement;
    if (cardDiv) {
      const rect = cardDiv.getBoundingClientRect();
      return rect.left;
    }
    return 0;
  }

  getWidth() {
    const cardDiv = this.renderRoot.querySelector('.card') as HTMLElement;
    if (cardDiv) {
      const rect = cardDiv.getBoundingClientRect();
      return rect.width;
    }
    return 0;
  }

  applyAnimation(animation: string, cb?: () => void) {
    const cardDiv = this.renderRoot?.querySelector('.card') as HTMLElement;
    if (!cardDiv) return;

    if (animation === 'swap') {
      const swapX = '310px'; 
      const swapEndX = (-Number(this.left) + 10) + 'px'; //-90
      const swapEndY = (Number(this.cardNumber) + 3) + 'px'; 
      
      cardDiv.style.setProperty('--swap-x', swapX);
      cardDiv.style.setProperty('--swap-end-x', swapEndX);
      cardDiv.style.setProperty('--swap-end-y', swapEndY);
    }

    if (animation === 'reverse-swap') {
      const swapX = (Number(this.cardNumber) * 10 + 310) + 'px'; 
      const swapEndX = (Number(this.cardNumber) * 10 - 10) + 'px'; //90
      const swapEndY = (-Number(this.cardNumber) - 3) + 'px'; 
    
      cardDiv.style.setProperty('--reverse-swap-x', swapX);
      cardDiv.style.setProperty('--reverse-swap-end-x', swapEndX);
      cardDiv.style.setProperty('--swap-end-y', swapEndY);
    }

    cardDiv.style.animation = animation + " 1s forwards";

    setTimeout(() => {
      cardDiv.style.animation = "";
      if (cb) cb();
    }, 1000);
  }

  hasFavorite() {
    return this.backgroundColor === 'black' && this.choosable;
  }

  getFavoriteClass() {
    return this.favorite === 'true'? 'favorite' : 'not-favorite';
  }

  render() {
    return html`
    <div class="card ${this.backgroundColor} ${this.choosable ? 'choosable' : ''}" style="left: ${(-30 + Number(this.left))}px; z-index: ${this.zindex};">
    <p>${Utils.buildHtlmSentence(this.description, this.value)}<span class="point">.</span></p>
      ${this.hasFavorite() ? html`<div class="favorite-container"><div @click="${this.handleClickFavorite}">
        <svg class="${this.getFavoriteClass()}" viewBox="0 0 576 512" width="40" title="star">
          <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
        </svg>
      </div>
    </div>` : html``}
    </div>
  `;
  }
}
