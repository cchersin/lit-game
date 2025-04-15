
export class Card {
  id: string;
  content: string;
  color: string;

  constructor(id: string, content: string, color: string) {
    this.id = id;
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
      id: this.id,
      content: this.content,
      color: this.color,
    };
  }

  static fromJSON(json: any) {
    return new Card(json.id, json.content, json.color);
  }
}
                                      
                                      