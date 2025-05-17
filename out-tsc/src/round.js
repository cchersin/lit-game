export class Round {
    constructor(winnerName, sentence) {
        this.winnerName = winnerName;
        this.sentence = sentence;
    }
    toJSON() {
        return {
            winnerName: this.winnerName,
            sentence: this.sentence,
        };
    }
    static fromJSON(json) {
        const r = new Round(json.winnerName, json.sentence);
        return r;
    }
}
//# sourceMappingURL=round.js.map