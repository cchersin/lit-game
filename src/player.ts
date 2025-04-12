import { Card } from './card.js'

export class Player {
  name: string;
  role: string;
  hand: Array<Card>;

  constructor(name: string, role: string) {
    this.name = name;
    this.role = role;
    this.hand = [];
  }

  drawCard(deck: Card[]): void {
    if (deck.length === 0) {
      console.log(`${this.name} non può pescare: il mazzo è vuoto.`);
      return;
    }

    const drawnCard = deck.shift(); // pesca la prima carta
    if (drawnCard) {
      this.hand.push(drawnCard);
      console.log(`${this.name} ha pescato una carta:`, drawnCard);
    }
  }

  toJSON() {
    return {
      name: this.name,
      role: this.role,
      hand: this.hand.map(c => c.toJSON())
    };
  }

  static fromJSON(json: any) {
    const p = new Player(json.name, json.role);
    p.hand = json.hand.map((c: any) => Card.fromJSON(c));
    return p;
  }
}
                                      