import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { Router } from '@vaadin/router';



import '../components/card-component';
//import { CardComponent } from '../components/card-component';
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
    position: sticky;
    z-index: 10000;
  }

  .outer-container-widget-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    max-width: 400px;
    width: 100%;
    margin: auto;
    z-index: 10000;
    position: fixed;
    bottom: 20px;
  }
  
  .action-button {
    background-color: red;
    border: 1px solid black;
    z-index: 1000;
    position: relative;
    padding-top: 5px;
    padding-bottom: 7px;
    padding-right: 20px;
    padding-left: 20px;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 14pt;
    font-family: "tablet-gothic", sans-serif;
    border-radius: 18px;
    margin-top: 15px;
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

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.handleArrowKeys.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleArrowKeys.bind(this));
    super.disconnectedCallback();
  }

  handleArrowKeys(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (this.getPlayer()?.currentCardId === '' && this.currentCardId !== '') {
          const containerCards = this.renderRoot.querySelector(".container-cards") as HTMLElement;
          const blackContainerCards = this.renderRoot.querySelector(".black-card-container") as HTMLElement;
          const frontCard = containerCards?.querySelector("card-component:last-child") as any;
          const blackCard = blackContainerCards?.querySelector("card-component:first-child") as any;
   
          if (frontCard) { 
            frontCard.applyAnimation("slide-up", () => {
              this.handlePlayCard();
            });
          }
          if (blackCard) { 
            blackCard.applyAnimation("slide-down", () => {
            });
          }
          containerCards?.querySelectorAll(`card-component`).forEach((card, index, array) => {
            if (card !== frontCard) {
              (card as any).applyAnimation("slide-more-down");
            }
          });
        }
        break;
      case 'ArrowDown':
        // handle down arrow
        break;
      case 'ArrowLeft':
          this.reverseSwap(() => {
             this.moveBackCardToFront();
             this.currentCardId = this.getFrontCard().id;
             this.requestUpdate();
          });
        break;
      case 'ArrowRight':
        this.swap(() => {
             this.moveCurrentCardToBack();
             this.currentCardId = this.getFrontCard().id;
             this.requestUpdate();
          });
        break
      case 'Enter':
        this.handlePlayCard();
        break;
    }
  }

  getFrontCard() {
    return this.getPlayerChoosableCards()[this.getPlayerChoosableCards().length - 1];
  }

  moveCurrentCardToBack() {
    const frontCard = this.getFrontCard();
    this.getPlayerChoosableCards().pop();
    this.getPlayerChoosableCards().unshift(frontCard);
  }

  moveBackCardToFront() {
    const backCard = this.getPlayerChoosableCards()[0];
    this.getPlayerChoosableCards().shift();
    this.getPlayerChoosableCards().push(backCard);
  }

  swap(cb?: () => void) {
    const containerCards = this.renderRoot.querySelector(".container-cards") as HTMLElement;
   
    const frontCard = containerCards?.querySelector("card-component:last-child") as any;
   
    if (!frontCard) 
      return;

    containerCards?.querySelectorAll(`card-component`).forEach((card, index, array) => {
      if (card !== frontCard) {
        (card as any).applyAnimation("slide-left");
      }
    });

    frontCard.applyAnimation("swap", cb);
  }

  reverseSwap(cb?: () => void) {
    const containerCards = this.renderRoot.querySelector(".container-cards") as HTMLElement;
   
    const backCard = containerCards?.querySelector("card-component:first-child") as any;
   
    if (!backCard) 
      return;

    backCard.applyAnimation("reverse-swap", cb);

    containerCards?.querySelectorAll(`card-component`).forEach((card, index, array) => {
      if (card !== backCard) {
        (card as any).applyAnimation("slide-right");
      }
    });
  }
  
  findCurrentCardIndex() {
    const hand = this.getPlayerChoosableCards();
    if (!hand || hand.length === 0) {
      return -1;
    }
    return hand.findIndex(card => card.id === this.currentCardId);
  }

  getLeftCardIndex() {
    const hand = this.getPlayerChoosableCards();
    if (!hand || hand.length === 0) {
      return -1;
    }
    const currentIndex = this.findCurrentCardIndex();
    if (currentIndex === -1) {
      return 0;
    }
    return (currentIndex - 1 + hand.length) % hand.length;
  }

  getRightCardIndex() {
    const hand = this.getPlayerChoosableCards();
    if (!hand || hand.length === 0) {
      return -1;
    }
    const currentIndex = this.findCurrentCardIndex();
    if (currentIndex === -1) {
      return 0;
    }
    return (currentIndex + 1) % hand.length;
  }

  getLeftCardId() {
    const hand = this.getPlayerChoosableCards();
    const leftIndex = this.getLeftCardIndex();
    if (leftIndex === -1) {
      return '';
    }
    return hand[leftIndex].id;
  }

  getRightCardId() {
    const hand = this.getPlayerChoosableCards();
    const rightIndex = this.getRightCardIndex();
    if (rightIndex === -1) {
      return '';
    }
    return hand[rightIndex].id;
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
   
    return html`<div class="black-card-container"><card-component description="${this.currentGame.blackCard?.content}" value="${this.findCardContent(this.currentCardId || this.getPlayer()?.currentCardId || '')}" backgroundColor="${this.currentGame.blackCard?.color}" color="${this.currentGame.blackCard?.getOppositeColor()}"></card-component></div>`;
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

  getPlayerChoosableCards() {
     if (this.getRole() === 'player') {
      return this.getHand();
    } else {
      return this.currentGame.tableCards;
    }
  }

  renderChoosableCards() {
    return this.renderCards(this.getPlayerChoosableCards(), this.getRole() === 'master');
  }


  renderCards(cards: any, resolve: boolean) {
    let left = -30;
    let zindex = 11;
   
    return html`<div class="container-cards">
         ${cards.map((card: any) => 
              new Card(card.id, card.content, card.color)).map((card: any) => { 
                left += 10;
                zindex += 1;
                return this.renderCard(card, left, zindex, resolve, true);
          })}
        </div>`;
  }

  renderCard(card: Card, left: number, zindex: number, resolve: boolean, choosable: boolean) {
    if(resolve) {
       return html`<card-component id="${card.id}" description="${this.currentGame.blackCard?.content}" value="${this.findCardContent(card.id)}" backgroundColor="${this.currentGame.blackCard?.color}" color="${this.currentGame.blackCard?.getOppositeColor()}" left="${left}px" zindex="${zindex}" choosable="${choosable}"></card-component>`;
    } else {
      return html`
            <card-component id="${card.id}" description="${card.content}" backgroundColor="${card.color}" color="${card.getOppositeColor()}" left="${left}px" zindex="${zindex}" choosable="${choosable}"></card-component>
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
      return html`<div id="last-round" style="font-size: 24px; font-family: 'tablet-gothic', sans-serif; color:red; text-align: center;">E il vincitore è... ${lastRound.winnerName}</div>`;
  }

  renderLastRoundWinningCard(lastRound: Round) {
     return html`
            <card-component id="-1" description="${lastRound.blackCardContent}" value="${lastRound.whiteCardContent}" backgroundColor="black" color="white"></card-component>
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
      <main class="game">
        <span>User: ${localStorage.userName}(${this.getRole()}) - ${this.currentGame.status}</span>
         <audio id="remote-audio" autoplay controls style="display:none"></audio>

        <div class="outer-container-widget">
          ${this.currentGame.players.map(player => html`
            <div class="container-widget">
              <div class="${player.role}-widget" style="${player.name === localStorage.userName ? 'font-weight: light;' : ''}">
                ${player.name}  ${this.currentGame.getPlayerWins(player.name)}
              </div>
              <div class="has-choosen-container">
                <div class="has-choosen" style="opacity: ${player.currentCardId !== '' ? '1' : '0'}"/>
              </div>
            </div>
          `)}
        </div>
         ${this.isPlayer() && this.currentGame.turn != 'master' && this.getPlayer()?.currentCardId !== '' ? html `<div style="font-size: 48px; font-family: 'eskapade-fraktur', serif; color:red; text-align: center; rotate: 2deg; line-height: 0.9; margin-bottom: 12px; margin-top: 15px;">Congratulazioni,</br>hai scelto la</br>tua carta!</div><div style="font-size: 20px; font-family: 'tablet-gothic', sans-serif; color:red; text-align: center; rotate: 2deg; font-weight: lighter; margin-bottom:40px;">(ora aspetta che gli altri</br>scelgano la loro...)</div>` : html ``}
         ${this.isPlayer() && this.currentGame.turn == 'master' && !this.currentGame.hasMasterChoosenCard() ? html `<div style="font-size: 48px; font-family: 'eskapade-fraktur', serif; color:red; text-align: center; rotate: 2deg; line-height: 0.9; margin-bottom: 12px; margin-top: 15px;">Congratulazioni,</br>hai scelto la</br>tua carta!</div><div style="font-size: 20px; font-family: 'tablet-gothic', sans-serif; color:red; text-align: center; rotate: 2deg; font-weight: lighter; margin-bottom:40px;">(ora aspetta che il master</br>scelga la migliore...)</div>` : html ``}
         ${this.renderLastRound()}
         ${this.renderBlackCard()}
         ${this.getPlayer()?.currentCardId === '' ? this.renderChoosableCards() : html ``}
         <div class="outer-container-widget-bottom">
          ${this.currentGame.status === 'started' ? html`<button class="action-button" @click="${this.handleStopGame}">stop</button>` : html``}
          ${this.isMaster() && this.currentGame.hasMasterChoosenCard() && !this.currentGame.areDecksEmpty() ? html`<button class="action-button" @click="${this.handleNextRound}">next round</button>` : html``}
          ${this.getPlayer()?.currentCardId === '' && this.currentCardId !== '' ? html`<button class="action-button" @click="${this.handlePlayCard}">confirm</button>` : html``}
          <button class="action-button" @click="${this.handleLeaveGame}">leave</button>
          <button class="action-button" @click="${this.handleCall}" style="display:none">call</button>
          <button class="action-button" @click="${this.handleCloseCall}" style="display:none">close call</button>
         </div>  
     </main>
    `;
  }
}
function cb(): any {
  throw new Error('Function not implemented.');
}

