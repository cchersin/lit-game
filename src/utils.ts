import { html } from 'lit';

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
          <span style="margin-left: -6px">${a[1]}</span>
        `;
      }
    return html`${blackCardContent}`;
  }
}
                                      
                                      