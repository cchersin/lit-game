import { Card } from './card.js';
export class Player {
    constructor(name, role) {
        this.name = name;
        this.role = role;
        this.hand = [];
        this.currentCardId = '';
    }
    getCard(cardId) {
        return this.hand.find((card) => card.id === cardId);
    }
    hasCard(cardId) {
        return this.hand.some((card) => card.id === cardId);
    }
    hasCards() {
        return this.hand.length > 0;
    }
    getCurrentCard() {
        return this.getCard(this.currentCardId);
    }
    hasCurrentCard() {
        return this.currentCardId !== '';
    }
    removeCard(cardId) {
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
    toJSON() {
        return {
            name: this.name,
            role: this.role,
            hand: this.hand.map(c => c.toJSON()),
            currentCardId: this.currentCardId,
        };
    }
    static fromJSON(json) {
        const p = new Player(json.name, json.role);
        p.hand = json.hand.map((c) => Card.fromJSON(c));
        p.currentCardId = json.currentCardId;
        return p;
    }
}
//# sourceMappingURL=player.js.map