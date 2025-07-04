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
  @property({ type: String }) isselected = "false";


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

  .black {
    background-color: #ff0000;
    color: black;
    font-size: 18pt;
    font-style: normal;
    line-height: 22pt;
    rotate: -5deg;
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
    position: absolute;
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
`];

  handleClick() {
    this.dispatchEvent(new CustomEvent('card-click', {
      detail: { id: this.id },
      bubbles: true,
      composed: true
    }));
  }

  
  render() {
    return html`
    <div class="card ${this.backgroundColor}" @click=${this.handleClick} style="left: ${this.left}; z-index: ${this.isselected === "true" ? 1000 : this.zindex};">
      <p>${Utils.buildHtlmSentence(this.description, this.value)}<span class="point">.</span></p>
    </div>
  `;
  }
}
