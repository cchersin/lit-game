import { html } from 'lit';
import { Game } from './domain/game';

const placeHolder = '______';
    
export class Utils {
    
  static buildSentence(blackCardContent: string, whiteCardContent: string) {
      return blackCardContent.replace(placeHolder, whiteCardContent);
  }

  static buildHtlmSentence(blackCardContent: string, whiteCardContent: string) {
    const a = blackCardContent.split(placeHolder);
      if (whiteCardContent !== '') {
        return html`
          <span>${a[0]}</span>
          <span style="font-family: 'eskapade-fraktur', serif; font-weight: 400; font-size: 20.625pt; line-height: 22pt;">${whiteCardContent}</span>
          <span style="${a[1] === "." ? "margin-left: -6px" : ""}">${a[1]}</span>
        `;
      }
    return html`${blackCardContent}`;
  }

  static getRanking(games: Array<Game>) {
    const ranking: Map<String, number> = new Map();
    games.forEach((g) => {
      const winner = g.getWinner();
      if (winner) {
        if (!ranking.get(winner)) {
          ranking.set(winner, 0);
        }
        const points = ranking.get(winner) ?? 0;
        ranking.set(winner, points + 1);
      }
    });
    return Array.from(ranking, ([playerName, points]) => ({ playerName, points }))
      .sort((a, b) => b.points - a.points).map((e) => ({ playerName: e.playerName, wins: e.points }));
  }
}
                                      
                                      