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
                                      