import { GameCanvas } from '../src/common/GameCanvas.js';

import * as Card from '../src/SVGCard.js';

const gameCanvas = new GameCanvas();
gameCanvas.bounds = [ 0, 0, Card.Width * Card.NumRanks, Card.Height * Card.NumSuits ];
gameCanvas.backgroundColor = '#123';

let time = 0;

gameCanvas.update = ( dt ) => {
  time += dt;
}

gameCanvas.draw = ( ctx ) => {
  for ( let suit = 0; suit < Card.NumSuits; suit ++ ) {
    for ( let rank = 0; rank < Card.NumRanks; rank ++ ) {
      const scale = Math.cos( time / 200 + rank + suit );

      Card.draw( ctx, { rank: rank, suit: suit, faceup: scale > 0 }, ( rank + 0.5 ) * Card.Width, ( suit + 0.5 ) * Card.Height, scale, 1 );
    }
  }
}

gameCanvas.start();