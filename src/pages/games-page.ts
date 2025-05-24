import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Game } from '../domain/game';
import '../components/game-component';
import { StoreService } from '../store-service';
import { db } from '../firebase';
import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';

import { Router } from '@vaadin/router';


@customElement('games-page')
export class GamesPage extends LitElement {

  static styles = css`
  main {
    background-color: red;
    height: 100%;
  }
  `;

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

  handleNewGame(event: any) {
    const gameName = new Date().toString();
 
    const game = new Game(gameName);

    game.init(localStorage.userName);

    localStorage.currentGame = game.name;

    StoreService.saveGame(game);

    Router.go('/starting');
  }

  handleGameJoin(event: any) {
    const game = this.games.find(g => g.name === event.detail.name);
    if (game) {
      game.join(localStorage.userName);

      localStorage.currentGame = game.name;

      StoreService.saveGame(game); 

      Router.go('/starting');
    }
  }

  handleGameDelete(event: any) {
    const game = this.games.find(g => g.name === event.detail.name);
    if (game) {
      StoreService.deleteGame(game.name);  
    }
  }

  render() {
    return html`
      <main @game-join=${this.handleGameJoin} @game-delete=${this.handleGameDelete}>
         <h1>Games</h1>
         <div><button class="action-button" @click="${this.handleNewGame}">New game</button></div>
         ${this.games.map(game => html`
            <p>
              <game-component name="${game.name}" status="${game.status}" winner="${game.getWinner()}"</game-component>
            </p>
          `)}
      </main>
    `;
  }
}
