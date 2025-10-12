import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { sharedStyles } from '../shared-styles';
import { Player } from '../domain/player';

@customElement('game-component')
export class GameComponent extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) status = '';
  @property({ type: String }) master = '';
  @property({ type: String }) winner = '';
  @property({ type: String }) players= '';
  

  static styles = [
    sharedStyles, css`
    .game-information {
    font-family: "tablet-gothic", sans-serif;
    text-align: center;
    font-size: 12pt;
    line-height: 16pt;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
  .game-information:first-letter {
      text-transform: capitalize;
  }

  .action-button {
    background-color: red;
    z-index: 1000;
    position: relative;
    border: 1px solid black;
    text-align: center;
    padding-top: 5px;
    padding-bottom: 7px;
    padding-left: 30px;
    padding-right: 30px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14pt;
    font-family: "tablet-gothic", sans-serif;
    border-radius: 18px;
  }

  .button-container {
    width: 100%;
    display: flex;
    align-content: center;
  }
`];

  handleJoin() {
    this.dispatchEvent(new CustomEvent('game-join', {
      detail: { name: this.name },
      bubbles: true,
      composed: true
    }));
  }

  handleDelete() {
    this.dispatchEvent(new CustomEvent('game-delete', {
      detail: { name: this.name },
      bubbles: true,
      composed: true
    }));
  }
  
  
  render() {
    return html`
     <div>
        <div class="game-information"> ${this.name} </div>
        ${this.status === 'pending' ? 
          html` ${this.players.length == 0 ? html`<div class="game-information">${this.master} sta giocando.</div>` : html`<div class="game-information">${this.master}, ${this.players} stanno giocando.</div>`}
                <div class="button-container"> 
                  <button class="action-button" @click="${this.handleJoin}">join</button> 
                </div>` 
          : html``}
        ${this.status === 'completed' ? html` Winner: ${this.winner} <div class="button-container"> <button class="action-button" @click="${this.handleDelete}">cancella</button> </div>` : html``}        
      </div>
  `;
  }
}
