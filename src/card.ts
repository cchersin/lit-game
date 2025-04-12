
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
}
                                      
                                      