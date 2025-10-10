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
     transform: translateX(310px) scale(0.85);
     animation-timing-function: ease-in;
     z-index: +1000;
  }
  60% {
     z-index: 0;
  }
  100% {
     transform: translateX(-90px) translateY(13px) scale(1);
     z-index: 0;
  }
}

@keyframes reverse-swap {
  50% {
     transform: translateX(400px) scale(0.85);
     z-index: 0;
  }  
  60% {
     z-index: +1000; 
  }
  100% {
     transform: translateX(90px) translateY(-13px) scale(1);
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
  /*height: 30px;
  width: 30px;*/
  bottom: 20px; 
  right: 20px; 
}

.not-favorite {
      margin: 50px 0;
      position: relative;
      display: block;
      color: white;
      width: 0px;
      height: 0px;
      border-right: 100px solid transparent;
      border-bottom: 70px solid white;
      border-left: 100px solid transparent;
      transform: rotate(35deg);
    }
    .not-favorite:before {
      border-bottom: 80px solid white;
      border-left: 30px solid transparent;
      border-right: 30px solid transparent;
      position: absolute;
      height: 0;
      width: 0;
      top: -45px;
      left: -65px;
      display: block;
      content: '';
      transform: rotate(-35deg);
    }
    .not-favorite:after {
      position: absolute;
      display: block;
      color: white;
      top: 3px;
      left: -105px;
      width: 0px;
      height: 0px;
      border-right: 100px solid transparent;
      border-bottom: 70px solid white;
      border-left: 100px solid transparent;
      transform: rotate(-70deg);
      content: '';
    }

.favorite {
      margin: 50px 0;
      position: relative;
      display: block;
      color: black;
      width: 0px;
      height: 0px;
      border-right: 100px solid transparent;
      border-bottom: 70px solid black;
      border-left: 100px solid transparent;
      transform: rotate(35deg);
    }
    .favorite:before {
      border-bottom: 80px solid black;
      border-left: 30px solid transparent;
      border-right: 30px solid transparent;
      position: absolute;
      height: 0;
      width: 0;
      top: -45px;
      left: -65px;
      display: block;
      content: '';
      transform: rotate(-35deg);
    }
    .favorite:after {
      position: absolute;
      display: block;
      color: black;
      top: 3px;
      left: -105px;
      width: 0px;
      height: 0px;
      border-right: 100px solid transparent;
      border-bottom: 70px solid black;
      border-left: 100px solid transparent;
      transform: rotate(-70deg);
      content: '';
    }
`];

  handleClickFavorite(e: any) {
    e.stopPropagation(); // blocca la propagazione del click
    this.dispatchEvent(new CustomEvent('card-favorite', {
      detail: { description: this.description, value: this.value, favorite: (this.favorite === 'false') },
      bubbles: true,
      composed: true
    }));
    this.requestUpdate();
  }

  applyAnimation(animation: String, cb?: () => void) {
    const cardDiv = this.renderRoot.querySelector('.card') as HTMLElement;
    if (!cardDiv) return;

    cardDiv.style.animation = animation + " 1s forwards";

    setTimeout(() => {
      cardDiv.style.animation = "";
      if (cb)
        cb();
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
    <div class="card ${this.backgroundColor} ${this.choosable ? 'choosable' : ''}" style="left: ${this.left}; z-index: ${this.zindex};">
     <p>${Utils.buildHtlmSentence(this.description, this.value)}<span class="point">.</span></p>
      ${this.hasFavorite() ? html`<div class="favorite-container"><div class="${this.getFavoriteClass()}" @click="${this.handleClickFavorite}"></div></div>` : html``}
    </div>
  `;
  }
}
