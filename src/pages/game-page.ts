import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';

import '../components/card-component';
import { Card } from '../domain/card'
import { Game } from '../domain/game';
import { Round } from '../domain/round';

import { StoreService } from '../store-service';
import { MediaConnection, Peer } from 'peerjs';
import { query } from 'lit/decorators.js';

import { sharedStyles } from '../shared-styles';

@customElement('game-page')
export class GamePage extends LitElement {
  currentCardId = '';
  currentGame = new Game('');
  calls : Array<MediaConnection> = []

  @query('#remote-audio') remoteAudioEl: any;
  
  
  static styles = [
  sharedStyles, css`
  main {
    overflow: hidden;
    background-color: #000000;
    height: 100%;
  }

  .card {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }

  .player-widget {
    background-color: white;
    padding: 7px;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 20px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 5px;
    margin-bottom: 7px;
    text-transform: capitalize;
    font-family: "tablet-gothic", sans-serif;
    font-size: 10pt;
  }

  .master-widget {
    background-color: red;
    color: black;
    padding: 7px;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 20px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 5px;
    margin-bottom: 7px;
    text-transform: capitalize;
    font-size: 10pt;
  }

  .container-cards {
   margin-top: 50px;
   position: relative;
  }

  .outer-container-widget {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    max-width: 400px;
    margin: auto;
  }
  
  .action-button {
    background-color: red;
    font-size: 18px;
    border-radius: 20px;
    z-index: 1000;
    position: relative;
    border: none;
    padding: 10px;
    padding-left: 18px;
    padding-right: 18px;
    font-weight: bold;
    margin: 10px;
    margin-top: 30px;
    font-family: "tablet-gothic", sans-serif;
  }
  
  .has-choosen {
    background-color: red;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    justify-content: center;
    margin-bottom: 10px;
  }

  .has-choosen-container {
    display: flex;
    justify-content: center;
    }
  `];

  constructor() {
    super();
    this.loadGame();
  }

  firstUpdated() {
    this.setupListen()
  }
  

  handleCardClick(event: any) {
    this.currentCardId = event.detail.id;
    this.requestUpdate();
  }

  findCardContent(cardId: String) {
    const card = this.currentGame.getWhiteCard(cardId);

    if (card) {
      return card.content;
    }

    return '';
  }

  handleStopGame(event: any) {
    console.log('handleStopGame');
    this.currentGame.stop();
    StoreService.saveGame(this.currentGame);
    this.requestUpdate();
  }

  handleLeaveGame() {
    this.currentGame.leave(localStorage.userName);
    StoreService.saveGame(this.currentGame);
  }

  loadGame() {
    StoreService.onGameUpdate(localStorage.currentGame, (game) => {
     if (game) {
        this.currentGame = game;

        if (this.currentGame.status !== 'started' || !this.hasRole()) {
          Router.go('/starting');
        }

        if (this.currentGame.status === 'completed') {
          Router.go('/winner');
        }

        if (this.getPlayer()?.hasCards() && !this.getPlayer()?.hasCard(this.currentCardId)) {
          this.currentCardId = '';
        }

   
        this.requestUpdate();
      }
    });
  }

  findMasterName() {
    return this.currentGame.findMasterName();
  }

  findPlayers() {
    return this.currentGame.findPlayers();
  } 

  isMaster() {
    return this.currentGame.isMaster(localStorage.userName);
  }

  isPlayer() {
    return this.currentGame.isPlayer(localStorage.userName);
  }

  getPlayer() {
    return this.currentGame.getPlayer(localStorage.userName);
  }

  hasRole() {
    return this.getPlayer();
  }

  hasHand() {
    const player = this.currentGame.getPlayer(localStorage.userName);
    return player ? player.hand.length > 0 : false;
  }

  getRole() {
    return this.currentGame.getRole(localStorage.userName);
  }

  renderBlackCard() {
  
    if (!this.hasRole() || (this.isMaster() && this.currentGame.tableCards.length > 0) || this.currentGame.hasMasterChoosenCard()) {
      return html``; 
    }
   
    return html`<card-component description="${this.currentGame.blackCard?.content}" value="${this.findCardContent(this.currentCardId || this.getPlayer()?.currentCardId || '')}" backgroundColor="${this.currentGame.blackCard?.color}" color="${this.currentGame.blackCard?.getOppositeColor()}"></game-component>`;
  }

  getHand() {
    return this.currentGame.getHand(localStorage.userName);
  }

  getRounds() {
    return this.currentGame.rounds;
  }

  handlePlayCard() {
    this.currentGame.playCard(localStorage.userName, this.currentCardId);

    StoreService.saveGame(this.currentGame);
  }

  handleNextRound() {
    this.currentGame.nextRound();

    StoreService.saveGame(this.currentGame);
  }

  renderWhiteCards() {
    if (this.getRole() === 'player') {
      return this.renderCards(this.getHand(), false);
    } else {
      return this.renderCards(this.currentGame.tableCards, true);
    }
  }


  renderCards(cards: any, resolve: boolean) {
    let left = -60;
    let zindex = 11;
   
    return html`<div class="container-cards">
         ${cards.map((card: any) => 
              new Card(card.id, card.content, card.color)).map((card: any) => { 
                left += 40;
                zindex -= 1;
                return this.renderCard(card, left, zindex, resolve);
          })}
        </div>`;
  }

  renderCard(card: Card, left: number, zindex: number, resolve: boolean) {
    if(resolve) {
       return html`<card-component id="${card.id}" description="${this.currentGame.blackCard?.content}" value="${this.findCardContent(card.id)}" backgroundColor="${this.currentGame.blackCard?.color}" color="${this.currentGame.blackCard?.getOppositeColor()}"></game-component>`;
    } else {
      return html`
            <card-component id="${card.id}" description="${card.content}" backgroundColor="${card.color}" color="${card.getOppositeColor()}" left="${left}px" zindex="${zindex}" isselected="${card.id === this.currentCardId}"></game-component>
          `;
    } 
  }


  renderLastRound() {
    if(this.currentGame.turn == 'master' && this.currentGame.hasMasterChoosenCard()) {
      const lastRound = this.currentGame.getLastRound();
      if (lastRound) {
        return html`<div>${this.renderLastRoundWinner(lastRound)}${this.renderLastRoundWinningCard(lastRound)}/div>`;
      }
    } 
  }

  renderLastRoundWinner(lastRound: Round) {
      return html`<div id="last-round" style="color:white">Winner: ${lastRound.winnerName}</div>`;
  }

  renderLastRoundWinningCard(lastRound: Round) {
     return html`
            <card-component id="-1" description="${lastRound.blackCardContent}" value="${lastRound.whiteCardContent}" backgroundColor="black" color="white"></game-component>
          `;
  }

  async handleCall() {
      const peer = new Peer();

      for(const player of this.currentGame.players) {
        if (player.name !== localStorage.userName) {
          console.log('Calling player:', player.name, 'with peer ID:', player.peerId);
          
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

          const call = peer.call(player.peerId, stream);

          this.calls.push(call);
        }
      }
  };

  async handleCloseCall() {
      const peer = new Peer();

      for(const call of this.calls) {
          call.close()
      }
      this.calls = [];
  };

  async setupListen() {
      const peer = new Peer();

      console.log('Setup listen for peer connection');

      peer.on('open', id => {
          this.getPlayer()?.setPeerId(id);
          StoreService.saveGame(this.currentGame);
          console.log('My Peer ID:', id);
      });

      peer.on('call', call => {
        call.answer(); 

        console.log('Call received from:', call.peer);

        call.on('stream', remoteStream => {
          this.remoteAudioEl.srcObject = remoteStream;
        });

        call.on('close', () => {
          console.log('Call closed:');
          this.remoteAudioEl.srcObject = null;
        });

        call.on('error', () => {
          console.log('error:');
        });
       
      });

      peer.on('close', () => {
          console.log('Peer closed:');
      });

      peer.on('error', () => {
          console.log('Peer error:');
      });

  };


  render() {
     return html`
      <main class="game" @card-click=${this.handleCardClick}>
        <span>User: ${localStorage.userName}(${this.getRole()}) - ${this.currentGame.status}</span>
         <audio id="remote-audio" autoplay controls style="display:none"></audio>

        <div class="outer-container-widget">
          ${this.currentGame.players.map(player => html`
            <div class="container-widget">
              <div class="${player.role}-widget" style="${player.name === localStorage.userName ? 'font-weight: light;' : ''}">
                ${player.name}  ${this.currentGame.getPlayerWins(player.name)}
              </div>
              <div class="has-choosen-container">
                <div class="has-choosen" style="background-color: ${player.currentCardId !== '' ? 'red' : 'black'}"/>
              </div>
            </div>
          `)}
        </div>
         ${this.renderLastRound()}
         ${this.renderBlackCard()} 
         ${this.getPlayer()?.currentCardId === '' ? this.renderWhiteCards() : html ``}
         ${this.isPlayer() && this.currentGame.turn == 'master' && !this.currentGame.hasMasterChoosenCard() ? html `<div style="color:white">Wait master to choose...</div>` : html ``}
         <div class="outer-container-widget">
          ${this.getPlayer()?.currentCardId === '' && this.currentCardId !== '' ? html`<button class="action-button" @click="${this.handlePlayCard}">Confirm</button>` : html``}
          ${this.currentGame.status === 'started' ? html`<button class="action-button" @click="${this.handleStopGame}">Stop</button>` : html``}
          ${this.isMaster() && this.currentGame.hasMasterChoosenCard() && !this.currentGame.areDecksEmpty() ? html`<button class="action-button" @click="${this.handleNextRound}">NextRound</button>` : html``}
          <button class="action-button" @click="${this.handleLeaveGame}">Leave</button>
          <button class="action-button" @click="${this.handleCall}" style="display:none">Call</button>
          <button class="action-button" @click="${this.handleCloseCall}" style="display:none">CloseCall</button>
         </div>  
      </main>
    `;
  }
}
