
export class Card {
  content: string;
  color: string;

  constructor(content: string, color: string) {
    this.content = content;
    this.color = color;
  }

  getOppositeColor() {
    if (this.color === 'white')
      return 'black'

    return 'white'
  }

  toJSON() {
    return {
      content: this.content,
      color: this.color,
    };
  }

  static fromJSON(json: any) {
    return new Card(json.content, json.color);
  }
}
                                      
                                      