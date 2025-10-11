import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Game } from '../domain/game';
import '../components/game-component';
import { StoreService } from '../store-service';
import { db } from '../firebase';
import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';

import { Router } from '@vaadin/router';
import { sharedStyles } from '../shared-styles';


@customElement('games-archive-page')
export class GamesAchivePage extends LitElement {

  static styles = [
    sharedStyles, css`
    main {
    background-color: red;
    height: 100%;
  }

  .action-button {
    font-size: 16pt;
    color: red;
    font-family: "eskapade-fraktur", sans-serif;
    padding-top: 5px;
    padding-bottom: 6px;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 15px;
    background-color: black;
    margin-top: 15px;
    border: none;
  }

  .game-component {
    border: 1px solid black;
    border-radius: 20px;
  }

  div.button-container {
    display: flex;
    align-content: center;
  }

  .archive-button {
    background-color: black;
    height: 70px;
    width: 70px;
    border-radius: 35px;
  }

  .favourites-button {
    margin-left: 50px;
    background-color: black;
    height: 70px;
    width: 70px;
    border-radius: 35px;
  }

  .circles-container {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    max-width: 100%;
    margin-bottom: 50px;
  }

  .outer-circles-container {
    position: fixed;
    bottom: 0;
  }
  `];

  games: Game[] = [];

  constructor() {
    super();
    this.loadGames();
  }
   
  async loadGames() {
    const q = query(collection(db, "games"));
        onSnapshot(q, (querySnapshot) => {
          this.games = querySnapshot.docs.map(doc => {
            return Game.fromJSON(doc.data());
          });
    
          this.requestUpdate();
        });
  }

  
  handleGameDelete(event: any) {
    const game = this.games.find(g => g.name === event.detail.name);
    if (game) {
      StoreService.deleteGame(game.name);  
    }
  }

  handleClose(event: any) {
    Router.go('/games');
  }

  render() {
    return html`
      <main @game-delete=${this.handleGameDelete}>
         ${this.games.filter(game => game.status === 'completed').map(game => html`
            <div class="game-component">
              <game-component name="${game.name}" status="${game.status}" master="${game.findMaster()?.name}" winner="${game.getWinner()}"</game-component>
            </div>
          `)}
          <div class="button-container"><button class="action-button" @click="${this.handleClose}">chiudi</button></div>
         
      </main>
    `;
  }
}
