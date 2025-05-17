import { db } from './firebase.js';
import { setDoc, doc, onSnapshot } from 'firebase/firestore';
import { Game } from './game.js';
export class StoreService {
    static saveGame(game) {
        const docRef = doc(db, 'global', 'currentGame');
        setDoc(docRef, game.toJSON());
        console.log('saved');
    }
    static onGameUpdate(cb) {
        const docRef = doc(db, 'global', 'currentGame');
        onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const game = Game.fromJSON(docSnapshot.data());
                cb(game);
            }
        });
    }
}
//# sourceMappingURL=store-service.js.map