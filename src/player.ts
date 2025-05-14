import { Card } from './card.js'

export class Player {
  name: string;
  role: string;
  hand: Array<Card>;
  currentCardId: string;

  constructor(name: string, role: string) {
    this.name = name;
    this.role = role;
    this.hand = [];
    this.currentCardId = '';
  }

  getCurrentCard() {
    return this.hand.find((card) => card.id === this.currentCardId);
  }

  hasCurrentCard() {
    return this.currentCardId !== '';
  }

  toJSON() {
    return {
      name: this.name,
      role: this.role,
      hand: this.hand.map(c => c.toJSON()),
      currentCardId: this.currentCardId,
    };
  }

  static fromJSON(json: any) {
    const p = new Player(json.name, json.role);
    p.hand = json.hand.map((c: any) => Card.fromJSON(c));
    p.currentCardId = json.currentCardId;
    return p;
  }
}
                                      