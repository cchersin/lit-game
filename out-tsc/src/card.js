export class Card {
    constructor(id, content, color) {
        this.id = id;
        this.content = content;
        this.color = color;
    }
    getOppositeColor() {
        if (this.color === 'white')
            return 'black';
        return 'white';
    }
    toJSON() {
        return {
            id: this.id,
            content: this.content,
            color: this.color,
        };
    }
    static fromJSON(json) {
        return new Card(json.id, json.content, json.color);
    }
}
//# sourceMappingURL=card.js.map