import { db } from './firebase';
import { setDoc, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { Game } from './domain/game';

type CallbackFunction = (game: Game) => void;

export class StoreService {
	static saveGame(game: Game) {
		const docRef = doc(db, 'games', game.name);
    	setDoc(docRef, game.toJSON());

    	console.log('saved');
	}

	static onGameUpdate(gameName: string, cb: CallbackFunction) {
		const docRef = doc(db, 'games', gameName);
    	onSnapshot(docRef, (docSnapshot) => {
    		if (docSnapshot.exists()) {
    			const game = Game.fromJSON(docSnapshot.data());
    			cb(game);
    		}
    	});
	}

	/*static onGamesUpdate(cb: CallbackFunction) {
		const docRef = doc(db, 'games', 'currentGame');
    	onSnapshot(docRef, (docSnapshot) => {
    		if (docSnapshot.exists()) {
    			const game = Game.fromJSON(docSnapshot.data());
    			cb(game);
    		}
    	});
	}*/

	static deleteGame(gameName: string) {
		const docRef = doc(db, 'games', gameName);
		deleteDoc(docRef)
			.then(() => {
				console.log(`Game ${gameName} deleted successfully.`);
			})
			.catch((error) => {
				console.error("Error deleting game: ", error);
			});
	}
}

/*
import { db } from './firebaseConfig'; // Assicurati che il percorso sia corretto
import { collection, onSnapshot } from 'firebase/firestore';

// Riferimento alla collection che vuoi ascoltare
const collectionRef = collection(db, 'nomeDellaTuaCollection'); // Sostituisci con il nome reale della tua collection

// Ascolta i cambiamenti nella collection
const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {

  // querySnapshot.docChanges() ti dà l'elenco dei cambiamenti avvenuti rispetto all'ultimo snapshot
  querySnapshot.docChanges().forEach((change) => {

    // Controlla il tipo di cambiamento
    if (change.type === 'added') {
      // Questo documento è stato aggiunto!
      console.log("Nuovo documento aggiunto: ", change.doc.data());

      // Puoi accedere all'ID del nuovo documento così:
      // console.log("ID del nuovo documento: ", change.doc.id);

      // Qui puoi eseguire l'azione che ti serve fare quando un nuovo documento viene aggiunto,
      // ad esempio, aggiornare la tua lista di elementi nell'interfaccia utente.

    } else if (change.type === 'modified') {
      // Un documento esistente è stato modificato
      console.log("Documento modificato: ", change.doc.data());
      // Qui puoi aggiornare l'elemento corrispondente nella tua UI

    } else if (change.type === 'removed') {
      // Un documento è stato rimosso
      console.log("Documento rimosso: ", change.doc.data());
      // Qui puoi rimuovere l'elemento dalla tua UI
    }
  });

}, (error) => {
  console.error("Errore durante l'ascolto della collection:", error);
});

// Quando non ti serve più ascoltare, chiama unsubscribe()
// unsubscribe();


/*
import { db } from './firebaseConfig'; // Assicurati che il percorso sia corretto
import { collection, getDocs, QuerySnapshot } from 'firebase/firestore';


}

// Chiama la funzione per eseguire la lettura
// readEntireCollectionOnce();
*/
