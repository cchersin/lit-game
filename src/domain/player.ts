import { MediaConnection } from 'peerjs';
import { Card } from './card'

export class Player {
  name: string;
  role: string;
  hand: Array<Card>;
  currentCardId: string;
  peerId: string;
  lastRoundNotified: number = -1;

  constructor(name: string, role: string) {
    this.name = name;
    this.role = role;
    this.hand = [];
    this.currentCardId = '';
    this.peerId = '';
    this.lastRoundNotified = -1;
  }

  getCard(cardId: string) {
    return this.hand.find((card) => card.id === cardId);
  }

  hasCard(cardId: string): boolean {
     return this.hand.some((card) => card.id === cardId);
  }

  hasCards(): boolean {
    return this.hand.length > 0;
  }

  getCurrentCard() {
    return this.getCard(this.currentCardId);
  }

  hasCurrentCard() {
    return this.currentCardId !== '';
  }

  removeCard(cardId: string) {
    const cardIndex = this.hand.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      this.hand.splice(cardIndex, 1);
    }
  }

  removeCurrentCard() {
    const card = this.getCurrentCard();
    if (card) {
      this.removeCard(card.id);
    }
  }

  setPeerId(peerId: string) {
    this.peerId = peerId;
  }

  
  toJSON() {
    return {
      name: this.name,
      role: this.role,
      hand: this.hand.map(c => c.toJSON()),
      currentCardId: this.currentCardId,
      peerId: this.peerId,
      lastRoundNotified: this.lastRoundNotified,
    };
  }

  static fromJSON(json: any) {
    const p = new Player(json.name, json.role);
    p.hand = json.hand.map((c: any) => Card.fromJSON(c));
    p.currentCardId = json.currentCardId;
    p.peerId = json.peerId || '';
    p.lastRoundNotified = json.lastRoundNotified || -1;
    return p;
  }
}
                                      