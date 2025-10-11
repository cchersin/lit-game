import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Game } from '../domain/game';
import '../components/game-component';
import { StoreService } from '../store-service';
import { db } from '../firebase';
import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';

import { Router } from '@vaadin/router';

import { format, isToday } from "date-fns";
import { it } from "date-fns/locale";

import { sharedStyles } from '../shared-styles';




@customElement('games-page')
export class GamesPage extends LitElement {

  static styles = [

  sharedStyles, css`
  main {
    background-color: red;
    height: 100%;
  }

  .action-button {
    text-align: center;
    padding-top: 5px;
    padding-bottom: 7px;
    padding-right: 20px;
    padding-left: 20px;
    margin-left: auto;
    margin-right: auto;
    background-color: black;
    margin-top: 15px;
    border: none;
    font-size: 14pt;
    color: red;
    font-family: "tablet-gothic", sans-serif;
    border-radius: 18px;
  }

  .game-component {
    border: 1px solid black;
    border-radius: 20px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
  }

  div.button-container {
    display: flex;
    align-content: center;
  }

  .favourites-button, .ranking-button, .archive-button {
    margin-left: 15px;
    margin-right: 15px;
    background-color: black;
    height: 70px;
    width: 70px;
    border-radius: 35px;
  }

  .circles-container {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
  }

  .outer-circles-container {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  
  .logout {
    text-align: right;
    padding-top: 10px;
    padding-right: 15px;
    font-family: "tablet-gothic", sans-serif;
    font-size: 12pt;
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

  handleNewGame(event: any) {
    const date = new Date();     
    
    const gameName = format(date, "dd MMMM yyyy, HH:mm", { locale: it });
 
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

  handleGoToArchive (event: any) {
    Router.go('/games-archive');  
  }
  
  handleLogout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('currentGame');
    Router.go('/login'); 
  }

  handleFavorite(event: any) {
    Router.go('/favorites');  
  }

  handleRanking(event: any) {
  Router.go('/ranking');  
  }

  render() {
    return html`
      <main @game-join="${this.handleGameJoin}">
       <div class="logout">
          <a @click="${this.handleLogout}">logout</a>
         </div>
         <div class="button-container"><button class="action-button" @click="${this.handleNewGame}">nuovo gioco</button></div>
         ${this.games.filter(game => game.status !== 'completed').map(game => html`
            <div class="game-component">
              <game-component name="${game.name}" status="${game.status}" master="${game.findMaster()?.name}" players="${game.findPlayers()?.map(p=>p.name).join(",")}" winner="${game.getWinner()}"></game-component>
            </div>
          `)}
           <div class="outer-circles-container">
                <div class="circles-container">
                  <div class="archive-button" @click="${this.handleGoToArchive}"></div>
                  <div class="favourites-button" @click="${this.handleFavorite}"></div>
                  <div class="ranking-button" @click="${this.handleRanking}"></div>
                </div>
           </div>
      </main>
    `;
  }
}
