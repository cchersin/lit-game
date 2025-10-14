import { Card } from './card'
import { Player } from './player'
import { Round } from './round'

const whiteCards = [
    new Card('1', 'venire insultati da Glauco perchè hai dimenticato i crocini di taglio', 'white'), 
    new Card('2', 'Inès', 'white'),
    new Card('3', 'Andrea', 'white'),
    new Card('4', 'Montra', 'white'), 
    new Card('5', 'le critiche di Rossolini', 'white'),
    new Card('6', 'Grado', 'white'),
    new Card('7', 'la sessualità di Martina', 'white'), 
    new Card('8', 'il divorzio dei miei genitori', 'white'),
    new Card('9', 'il comic sans', 'white'),
    new Card('10', 'l\'Helvetica', 'white'), 
    new Card('11', 'i poveri che non hanno soldi', 'white'),
    new Card('12', 'i ladri che rubano', 'white'),
    new Card('13', 'un carrellino per paraplegici', 'white'),
    new Card('14', 'Martina', 'white'),     
    new Card('15', 'il Nordio', 'white'),     
    new Card('16', 'i bagni unisex', 'white'),   
    new Card('17', 'le malattie veneree di Freddie Mercury', 'white'),       
    new Card('18', 'la Meloni', 'white'),
    new Card('19', 'i nazisti', 'white'),     
    new Card('20', 'tua madre', 'white'),     
    new Card('21', 'sangue, lacrime e sudore', 'white'),   
    new Card('22', 'essere super etero', 'white'), 
    new Card('23', 'Bon', 'white'),
    new Card('24', 'Giorgio Cedolin', 'white'),     
    new Card('25', 'il divorzio dei miei genitori', 'white'),     
    new Card('26', 'il patriarcato', 'white'),   
    new Card('27', 'Bernt das Brot', 'white'),
    new Card('28', 'la carta fedeltà di Puntin', 'white'),
    new Card('29', 'la pasteta Argeta®', 'white'),
    new Card('30', 'il cellulare scarico di Martina', 'white'),     
    new Card('31', 'la Giustizia Britannica', 'white'),   
    new Card('32', 'lo sguardo da lemure di Cedolin', 'white'),
    new Card('33', 'il comic sans', 'white'),
    new Card('34', 'il nostro signore e salvatore Paul Rand', 'white'),
    new Card('35', 'l\'etero Pride', 'white'),
    new Card('36', 'Elon Musk', 'white'),
    new Card('37', 'il fratello segreto di Martina', 'white'),
    new Card('38', 'il nuovissimo aggiornamento del font più bello del mondo: l\'Hobo', 'white'),
    new Card('39', 'ùn QuOsàn', 'white'),
    new Card('40', 'il neurone condiviso', 'white'),     
    new Card('41', 'MARCELLA', 'white'),   
    new Card('42', 'quel che abbiamo guadagnato, tutto guadagnato', 'white'),
    new Card('43', 'ingamberarsi', 'white'),
    new Card('44', 'la stressione', 'white'),
    new Card('45', 'degheggiare', 'white'),
    new Card('46', 'calcolare la mia Troiettoria', 'white'),
    new Card('47', 'sesso pazzo nella gabbietta di Tina', 'white'),
    new Card('48', 'cercare un buco', 'white'),
    new Card('49', 'un enorme numero di cortigiane', 'white'),
    new Card('50', 'Sburano', 'white'),     
    new Card('51', 'il Friuli', 'white'),   
    new Card('52', 'Trieste', 'white'),
    new Card('53', 'Udine', 'white'),
    new Card('54', 'L\'irrefrenabile voglia di rifondare l\'Impero Austro-Ungarico', 'white'),
    new Card('55', 'una papera', 'white'),
    new Card('56', 'un enorme gay', 'white'),
    new Card('57', 'il mio amico Gesù di Nazareth', 'white'),
    new Card('58', 'il gemello messicano di Carlo Rossolini: Carlíto Rossoliño', 'white'),
    new Card('59', 'Carlo Rossolini', 'white'),
    new Card('60', 'il Genitore 1', 'white'),     
    new Card('61', 'il Genitore 2', 'white'),   
    new Card('62', 'il Genitore 3', 'white'),
    new Card('63', 'il canone Vignelli', 'white'),
    new Card('64', 'la carbonara', 'white'),
    new Card('65', 'il burek di Perpo', 'white'),
    new Card('66', 'il regime comunista', 'white'),
    new Card('67', '69', 'white'),
    new Card('68', 'il best-seller “Tutto quello che non ti dicono sulla Popo”', 'white'),
    new Card('69', 'le liste di Martina', 'white'),
    new Card('70', 'il grigio cadavere di Steve Jobs', 'white'),     
    new Card('71', 'un cocher Spaniel: quattro zampe, mille colori', 'white'),   
    new Card('72', 'la sedia maledetta del piano -1', 'white'),
    new Card('73', 'il modulo in alto a sinistra che ti sminchia tutta la composizione', 'white'),
    new Card('74', 'la crisi mondiale di magliette dovuta alla liberazione dei bambini nella Malesia', 'white'),
    new Card('75', 'una pepsi', 'white'),
    new Card('76', 'delle testate nucleari a corta gittata', 'white'),
    new Card('77', 'pollo, pollo e ancora pollo (piangi Inès, PIANGI!)', 'white'),
    new Card('78', 'sesso, droga ed Helvetica', 'white'),
    new Card('79', 'una quantità infinita di orfane e vedove mai mandate a capo', 'white'),
    new Card('80', 'l\'Ovovia Galattica', 'white'),     
    new Card('81', 'una siringa e un plico di colori Pantone©', 'white'),   
    new Card('82', 'fare coming out', 'white'),
    new Card('83', 'il bianco Helvetica', 'white'),
    new Card('84', 'un account Onlyfans che vende pedici', 'white'),
    new Card('85', 'Camila', 'white'),
    new Card('86', 'Lea (la celiaca)', 'white'),
    new Card('87', 'il Genitore 2 e 3/4', 'white'),
    new Card('88', 'Los pollos Magally', 'white'),
    new Card('89', 'KAGA (Keep America Great Again)', 'white'),
    new Card('90', 'Tupac (Tuiach)', 'white'),     
    new Card('91', 'tuo padre', 'white'),   
    new Card('92', 'le tecniche di riproduzione di Pietro', 'white'),
    new Card('93', 'Omero il computer', 'white'),
    new Card('94', 'il cazzo di Gesù Cristo', 'white'),
    new Card('95', 'le griglie', 'white'),
    new Card('96', 'Duse (per gli amici Rockberto, il Dudu per i confidenti)', 'white'),
    new Card('97', 'lo sterminio degli Inuit', 'white'),
    new Card('98', 'l\'inglese caraibico', 'white'),
    new Card('99', 'una wienerschnizel', 'white'),
    new Card('100', 'Zennaro e compagno', 'white'),
    new Card('101', 'Uolli', 'white'), 
    new Card('102', 'i comunismi', 'white'),
    new Card('103', 'i Modà', 'white'),
    new Card('104', 'la sensualità pungente dei furry', 'white'), 
    new Card('105', 'Luigi Mangione', 'white'),
    new Card('106', 'la leggendaria pizza da Gigi', 'white'),
    new Card('107', 'lo scroto assassino', 'white'), 
    new Card('108', 'Croatto', 'white'),
    new Card('109', 'Luca, l\'amicone di Inès', 'white'),
    new Card('110', 'l\'Ostello Casali', 'white'), 
    new Card('111', 'un\'elaborata trappola di Saw l\'Enigmista', 'white'),
    new Card('112', 'commettere Sudoku', 'white'),
    new Card('113', 'Re-Animator', 'white'),
    new Card('114', 'Taylor Swift', 'white'),     
    new Card('115', 'il primo film d\'azione Ugandese', 'white'),     
    new Card('116', 'entrare nel Grindset', 'white'),   
    new Card('117', 'andare in Accademia', 'white'),       
    new Card('118', 'quel pelato razzista', 'white'),
    new Card('119', 'la dipendenza da Coca (Cola) di Inès', 'white'),     
    new Card('120', 'L.G.B.Tiepolo', 'white'),     
    new Card('121', 'Deganutti con il cappellino “make america great again” fabbricato in Cina da bambini sottopagati', 'white'),   
    new Card('122', 'gli onion rings', 'white'), 
    new Card('123', 'il poster di Trump in bikini', 'white'),
    new Card('124', 'la facoltà di ingegneria', 'white'),     
    new Card('125', 'i succhi di Acne Studios', 'white'),     
    new Card('126', 'L\'accademia di brutte arti', 'white'),   
    new Card('127', 'gigolò per lui, prostituta per lei', 'white'),
    new Card('128', 'una sauna gay', 'white'),
    new Card('129', 'sverginare brutalmente', 'white'),
    new Card('130', 'comprare un appendiabiti al posto della pillola del giorno dopo', 'white'),     
    new Card('131', 'versi da scimmia contro Balotelli', 'white'),   
    new Card('132', 'un\'orgia di frati benedettini', 'white'),
    new Card('133', 'amputare gambe ai mendicanti per fargli raccogliere più soldi', 'white'),
    new Card('134', 'un conflitto di portata internazionale', 'white'),
    new Card('135', 'il Buddha', 'white'),
    new Card('136', 'tautuarsi “satanic_sex” sopra al cuore', 'white'),
    new Card('137', 'funky', 'white'),
    new Card('138', 'slay', 'white'),
    new Card('139', 'swag', 'white'),
    new Card('140', 'chill', 'white'),     
    new Card('141', 'Dio', 'white'),   
    new Card('142', 'un tizio a caso', 'white'),
    new Card('143', 'Cards Against Humanity', 'white'),
    new Card('144', 'il Papa', 'white'),
    new Card('145', 'vendere coca ai bambini', 'white'),
    new Card('146', 'i bambini africani', 'white'),
    new Card('147', 'il KKK', 'white'),
    new Card('148', 'la violazione dei nostri più basilari diritti umani', 'white'),
    new Card('149', 'la mia vita sessuale', 'white'),
    new Card('150', 'la Bibbia', 'white'),     
    new Card('151', 'la disfunzione erettile', 'white'),   
    new Card('152', 'gli ebrei', 'white'),
    new Card('153', 'risolvere i problemi con la violenza', 'white'),
    new Card('154', 'la tensione sessuale', 'white'),
    new Card('155', 'un tumore al cervello', 'white'),
    new Card('156', 'il white privilege', 'white'),
    new Card('157', 'un cappello molto figo', 'white'),
    new Card('158', 'tedeschi in vacanza', 'white'),
    new Card('159', 'la pace nel mondo', 'white'),
    new Card('160', 'fare la cosa giusta', 'white'),     
    new Card('161', 'l\'alcolismo', 'white'),   
    new Card('162', 'suicidarsi', 'white'),
    new Card('163', 'le pessime scelte di vita', 'white'),
    new Card('164', 'la Gay Agenda', 'white'),
    new Card('165', 'i pedofili', 'white'),
    new Card('166', 'i neri', 'white'),
    new Card('167', 'la mascolinità fragile', 'white'),
    new Card('168', 'i francesi', 'white'),
    new Card('169', 'la diversità', 'white'),
    new Card('170', 'il passato', 'white'),     
    new Card('171', 'il razzismo', 'white'),   
    new Card('172', 'un cavallo molto piccolo', 'white'),
    new Card('173', 'la selezione naturale', 'white'),
    new Card('174', 'essere donna', 'white'),
    new Card('175', 'genuina connessione umana', 'white'),
    new Card('176', 'mandare dick pics', 'white'),
    new Card('177', 'invadere la polonia', 'white'),
    new Card('178', 'la police brutality', 'white'),
    new Card('179', 'gli immigrati illegali', 'white'),
    new Card('180', 'Bruno, il cane della provvidenza', 'white'),     
    new Card('181', 'il sistema militare russo', 'white'),   
    new Card('182', 'Francesca Freschi', 'white'),
    new Card('183', 'le tre grazie', 'white'),
    new Card('184', 'Nikolas Angelini', 'white'),
    new Card('185', 'perdere tutti i capelli il giorno della laurea in ingegneria', 'white'),
    new Card('186', 'thaisitioning', 'white'),
    new Card('187', 'chiedere a ChatGBT', 'white'),
    new Card('188', 'portare un AK24 in Accademia', 'white'),
    new Card('189', 'i metodi di insegnamento di Martina', 'white'),
    new Card('190', 'la tragic backstory di Montra', 'white'),     
    new Card('191', 'traumatizzare tuo figlio per character development', 'white'),   
    new Card('192', 'nominare Perper donna onoraria', 'white'),
    new Card('193', 'la chioma fluente di Nello', 'white'),
    new Card('194', 'Marko', 'white'),
    new Card('195', 'venire investiti dalla Smart di Croatto', 'white'),
    new Card('196', 'non invitare Montra al suo addio al nubilato', 'white'),
    new Card('197', 'Riccardo', 'white'),
    new Card('198', 'vendere Riccardo a 3.90 €', 'white'),
    new Card('199', 'avere i risultati dell\'esame dell\'HIV e scoprire che sei passato con il massimo dei voti', 'white'),
    new Card('200', '*colpo di pistola* “hmmm... what ya saaayyy... uuh that you only meant well...”', 'white'),
  ];

const blackCards = [
    new Card('1', 'Voglio fare un gioco, hai un minuto per tagliarti la gamba utilizzando ______.', 'black'),
    new Card('2', 'Per far andare Cindy più veloce abbiamo deciso di potenziare il suo carretto con ______.', 'black'),
    new Card('3', 'Bevo per dimenticare ______.', 'black') ,
    new Card('4', 'Gentili passengeri, si informa che questo treno non partirà da Trieste ma da ______, ci scusiamo per il disagio.', 'black') ,
    new Card('5', 'La consegna del nuovo progetto di Rossolini è quella di creare la brand identity di ______.', 'black') ,
    new Card('6', 'Live, ______, love.', 'black') ,
    new Card('7', 'Che cosa ha finito la tua relazione: ______.', 'black') ,
    // new Card('8', 'No Montra, ______ e ______ non sono la stessa cosa.', 'black') ,
    new Card('9', '“Io Andrea Perper, come prima azione per onorare la mia carica a presidente del Partito Socialista della Pizza, prometto di aumentare ______.” ', 'black') ,
    new Card('10', 'Sono sopravvissuta a ______ e ho ricevuto solo questa maglietta.', 'black') ,
    new Card('11', 'In onore del Pride Month non mi farò tua madre, mi farò ______.', 'black') ,
    new Card('12', 'La colazione di Montra oggi consiste in ______.', 'black') ,
    new Card('13', '“Gentili passeggeri vi informiamo che il treno partirà in ritardo a causa di ______ sui binari.”', 'black') ,
    new Card('14', '______ bilancerà la bella giornata di Inès.', 'black') ,
    new Card('15', '“______ contro gli alieni” il musical.', 'black') ,
    new Card('16', 'I Fink Ployd annunciano il loro nuovo album: ______.', 'black') ,
    new Card('17', 'Dopo scavi approfonditi si è scoperto cosa nascondono i muri del Nordio: ______.', 'black') ,
    new Card('18', 'No, Inès, non c\'è nessuna R nella parola ______.', 'black') ,
    new Card('19', 'A mezzanotte, guardo dentro lo specchio e nel riflesso ______ guarda me.', 'black') ,
    new Card('20', 'Dopo l\'ultimo incidente Trenitalia proibisce il trasporto  di ______ a bordo dei treni.', 'black') ,
    new Card('21', 'Ultimamente Martina non riesce a smettere di parlare di ______. Sta diventando un problema.', 'black') ,
    new Card('22', 'Cancella ogni impegno, abbiamo un problema con ______ che bisogna assolutamente risolvere.', 'black') ,
    new Card('23', 'Nuovo libro di Riccardo Falcinelli “Critica portatile a ______”.', 'black') ,
    new Card('24', 'Sono sopravvissuto a ______ e ho solo guadagnato questa t-shirt.', 'black') ,
    new Card('25', 'Le opinioni di Bon riguardo a  ______ non penso dovrebbero essere divulgate.', 'black') ,
    new Card('26', 'Le uniche due cose di cui dobbiamo avere paura sono: la paura stessa e ______.', 'black') ,
    new Card('27', 'Date le ultime proteste alla fonderia abbiamo deciso di eliminare completamente l\'Helvetica, da adesso useremo ______.', 'black') ,
    new Card('28', '“Non so se fidarmi della madre di Inès da quando ha eliminato ______ dalla sua dieta, forse dovremmo dirle qualcosa.”', 'black') ,
    new Card('29', 'Come nuovo tatuaggio Martina ha deciso di farsi ______ su tutta la gamba sinistra.', 'black') ,
    new Card('30', '______ che corre felice in un prato!', 'black') ,
    new Card('31', 'Sky ha terminato il suo piano per conquistare il mondo e ha utilizzato ______ per portarlo a compimento.', 'black') ,
    new Card('32', 'Durante il sesso mi piace pensare a ______.', 'black') ,
    new Card('33', 'Scusate raga, ma per alimentare la mia ludopatia ho bisogno di ______.', 'black') ,
    new Card('34', 'Cavolo se fossi una prostituta! Potrei ______.', 'black') ,
    new Card('35', 'Signor Mario, grazie ancora per il passaggio, le ho portato ______ come ringraziamento.', 'black') ,
    new Card('36', 'I tre più grandi crimini dell\'umanità: l\'olocausto, lo sterminio degli armeni e ______.', 'black') ,
    new Card('37', 'Per fare un tavolo ci vuole ______, in abbondanza.', 'black') ,
    new Card('38', 'Adesso, la lista degli argomenti di Montra contiene: Taylor Swift, il cibo, il matrimonio e ______.', 'black') ,
    new Card('39', 'La singolare fissa per ______ del Perpo.', 'black') ,
    new Card('40', 'Tutto risolto, per restaurare la femminilità di Martina consigliamo ______ per due volte al giorno.', 'black') ,
    // new Card('41', 'L\'aggressività di Inès per ______ è imparagonabile all\'aggressività che provo per ______.', 'black') ,
    new Card('42', 'Sono Giorgia.</br>Sono una donna.</br>Sono una madre.</br>Sono ______.', 'black') ,
    new Card('43', 'La grigliata di domenica è stata completamente rovinata dall\'introduzione di ______, grazie mille Perpo.', 'black') ,
    new Card('44', 'Il nuovo manifesto per la pace di Israele recita “abbiamo eliminato ______, e ha portato la pace nel mondo.”', 'black') ,
    new Card('45', '______ non è tradire.', 'black') ,
    // new Card('46', 'Dopo “Barbie” e “Oppenheimer” il nuovo duo cinematografico: ______ e ______.', 'black') ,
    new Card('47', '______, Thanks Obama.', 'black') ,
    new Card('48', '“Say my name.”</br>“______.”</br>“You\'re goddamn right.”', 'black') ,
    new Card('49', 'C\'è un\'unica strada per superare il capitalismo ed è ______.', 'black') ,
    new Card('50', 'Ah sì, il terzo genere segreto: ______.', 'black') ,
    new Card('51', 'Nello schema del “Funky, Swag, Slay e Chill” possiamo confermare che ______ è molto Slay.', 'black') ,
    new Card('52', '______? Sono piuttosto sicuro che sia un altro sintomo di autismo.', 'black') ,
    new Card('53', '______? Not on Pride Month.', 'black') ,
    new Card('54', 'IBM. Occhio, ape, ______.', 'black') ,
    new Card('55', 'Ricorda Luke, un vero gentleman non si permetterebbe mai di ______.', 'black') ,
  ];

const minNumPlayers = 2; // Minimum players to start the game

const numberOfCardsInHand = 10; // Number of white cards each player has in hand

export class Game {
  name: string;
  status: string; 
  whiteDeck: Array<Card>;
  blackDeck: Array<Card>;
  blackCard?: Card;
  tableCards: Array<Card>;
  players: Array<Player>; 
  rounds: Array<Round>;
  turn: string;
  
  constructor(name: string) {
    this.name = name;
    this.status = 'completed';
    this.whiteDeck = [];
    this.blackDeck = [];
    this.players = [];
    this.blackCard = new Card('0', '','');
    this.tableCards = [];
    this.rounds = [];
    this.turn = 'players';
  }

  init(masterName: string) {
    console.log('init game');
 
    const p = new Player(masterName, 'master');
    this.players = [p];
    this.whiteDeck = [...whiteCards];
    this.blackDeck = [...blackCards];
    this.shuffle(this.whiteDeck);
    this.shuffle(this.blackDeck);
    this.status = 'pending';
  }

  shuffle(deck: Array<Card>): void {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  isMinNumPlayersReached(): boolean {
    return this.players.length >= minNumPlayers;
  }

  start() {
    console.log('start game');
 
    this.status = 'started';
    this.turn = 'players';
    this.drawBlackCard();
  }

  drawBlackCard() {
    const drawnCard = this.blackDeck.shift();
    if (drawnCard) {
       this.blackCard = drawnCard;
    }
  }

  getPlayerWins(playerName: string): number {
      return this.rounds.filter(round => round.winnerName === playerName).length;
  }

  getLastRoundWinner(): string {
    if (this.rounds.length === 0) {
      return '';
    }
  
    const lastRound = this.rounds[this.rounds.length - 1];
    return lastRound.winnerName || '';
  }

  getLeaderboard(): Array<{ playerName: string; wins: number }> {
     return this.players
      .map(player => ({
        playerName: player.name,
        wins: this.getPlayerWins(player.name)
    }))
    .sort((a, b) => b.wins - a.wins); 
  }

  getWinner() :String {
    const leaderboard = this.getLeaderboard();
    if (leaderboard.length === 0) {
      return '';
    }
    return leaderboard[0].playerName;
  }
    
  stop() {
    console.log('stop game');
 
    this.status = 'completed';
    // this.players = [];
  }

  join(playerName: string) {
    let p = this.players.find((player) => player.name === playerName);

    if (!p) {
      p = new Player(playerName, 'player');
      this.players.push(p);

      p.currentCardId = '';
      this.drawHand(p);
    }
  }

  leave(playerName: string): void {
    const playerIndex = this.players.findIndex(player => player.name === playerName);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
    }

    if (!this.hasMaster()) {
      this.stop();
    }
  }

  drawHand(player: Player) {
    for(let i = player.hand.length; i < numberOfCardsInHand; i++) {
      this.drawCard(player);
    }
  }
  
  private drawCard(player: Player) {
    const drawnCard = this.whiteDeck.shift();
    if (drawnCard) {
      player.hand.push(drawnCard);
    }
  }

  playCard(playerName: string, cardId: string) {
    console.log(`playCard: playerName=${playerName}, cardId=${cardId}`);
   
    let p = this.players.find((player) => player.name === playerName);
    
    if (p) {
      p.currentCardId = cardId;
      if (p.role == 'player') {
        if (this.hasAllPlayersChoosenCards()) {
            this.turn = 'master';
            const master = this.findMaster();

            if (master) {
              this.findPlayers().forEach((player) => {
                  const card = player.getCurrentCard();
                  if (card) {
                    player.removeCurrentCard();
                    this.tableCards.push(card);
                  }
              });
            }
        }
      } else {
        const winner = this.findPlayers().find((player) => player.currentCardId === cardId);
        const winnerCard = this.getWhiteCard(cardId);
        const winnerCardContent = winnerCard ? winnerCard.content : '';
        const blackCardContent = this.blackCard ? this.blackCard.content : '';
        const winnerName = winner ? winner.name : '';

        console.log(`winner: ${winnerName}`);

        const round = new Round(playerName, winnerName, blackCardContent, winnerCardContent);
        this.rounds.push(round);
      }
    }
  }

  getPlayerOfCard(cardId: string): string {
    const player = this.findPlayers().find((p) => p.currentCardId === cardId);
    return player ? player.name : '';
  }
 
  nextRound() {
    console.log('nextRound');
 
    if (this.turn === 'master') {
      if (this.isBlackDeckEmpty()) {
        this.stop();
      } else {
        const winnerName = this.getLastRoundWinner(); 
        this.setMaster(winnerName);
        this.turn = 'players';
        this.tableCards = [];
        this.drawBlackCard(); 
        const isWhiteDeckEmpty = this.isWhiteDeckEmpty();
        this.players.filter((player) => player.name !== winnerName).forEach((player) => {
          player.currentCardId = '';
          if (!isWhiteDeckEmpty) {
            this.drawHand(player);
          }
          if (player.hand.length === 0) {
            this.stop();
            return;
          }
          player.role = 'player';
        });
      }
    }
  }

  existPlayerWhithoutCards() {
    return this.findPlayers().some((player) => player.hand.length === 0);
  }

  hasNextRound() {
    return this.status === 'started' && !this.isBlackDeckEmpty() && (!this.existPlayerWhithoutCards() || !this.isWhiteDeckEmpty());
  }

  setMaster(playerName: string) {
    console.log(`setMaster: playerName=${playerName}`);
    const p = this.players.find((player) => player.name === playerName);
    if (p) {
      p.role = 'master';
      p.currentCardId = '';
    }
  }

  hasAllPlayersChoosenCards() {
    return !this.findPlayers().find((player) => !player.hasCurrentCard());
  }

  hasMasterChoosenCard() {
    const master = this.findMaster();
    return master ? master.hasCurrentCard() : false;
  }

  findMaster() {
    return this.players.find(p => p.role === 'master');
  }

  findMasterName() {
    const master = this.findMaster();
    return master ? master.name : '';
  }

  findPlayers() {
    return this.players.filter(p => p.role === 'player');
  } 

  getPlayer(playerName: string) {
    return this.players.find((player) => player.name === playerName);
  }

  isMaster(playerName: string) {
    return this.getPlayer(playerName)?.role === 'master';
  }

  isPlayer(playerName: string) {
    return this.getPlayer(playerName)?.role === 'player';
  }

  getRole(playerName: string) {
    const p = this.getPlayer(playerName);
    if (p) {
      return p.role;
    }
    return '';
  }

  hasMaster(): boolean {
     return this.players.some(player => player.role === 'master');
  }

  getHand(playerName: string) {
    const p = this.getPlayer(playerName);
    if (p) {
      return p.hand;
    }
   
    return [];
  }

  getWhiteCard(cardId: String) {
    return whiteCards.find(card => card.id === cardId);
  }

  areDecksEmpty() {
    return this.isWhiteDeckEmpty() || this.isBlackDeckEmpty()
  }

  isWhiteDeckEmpty(): boolean {
    return this.whiteDeck.length < this.players.length - 1;
  }

  isBlackDeckEmpty(): boolean {
    return this.blackDeck.length === 0;
  }

  getLastRound(): Round | undefined {
    if (this.rounds.length === 0) {
      return undefined;
    }
    return this.rounds[this.rounds.length - 1];
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      whiteDeck: this.whiteDeck.map(c => c.toJSON()),
      blackDeck: this.blackDeck.map(c => c.toJSON()),
      blackCard: this.blackCard?.toJSON(),
      tableCards: this.tableCards.map(c => c.toJSON()),
      players: this.players.map(c => c.toJSON()),
      rounds: this.rounds.map(r => r.toJSON()),
      turn: this.turn
    };
  }

  static fromJSON(json: any) {
    const g = new Game(json.name);
    g.status = json.status;
    g.whiteDeck = json.whiteDeck.map((c: any) => Card.fromJSON(c));
    g.blackDeck = json.blackDeck.map((c: any) => Card.fromJSON(c));
    g.blackCard = Card.fromJSON(json.blackCard);
    g.tableCards = json.tableCards.map((c: any) => Card.fromJSON(c));
    g.players = json.players.map((p: any) => Player.fromJSON(p));
    g.rounds = json.rounds.map((r:any) => Round.fromJSON(r));
    g.turn = json.turn;
    return g;
  }
}
                                      