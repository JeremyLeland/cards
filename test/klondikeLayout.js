// import * as Card from '../src/Card.js'

const Card = {
  NumRanks: 13,
  NumSuits: 4,
  Width: 120,
};

const image = new Image();
image.src = './images/Aisleriot_-_Anglo_playing_cards.svg';
await image.decode();

const imageCardWidth = image.width / Card.NumRanks;
const imageCardHeight = image.height / ( Card.NumSuits + 1 );   // additional line has jokers and card back

Card.Height = Card.Width * imageCardHeight / imageCardWidth;


const Gap = 20;
const HorizSpacing = Card.Width + Gap;
const VertSpacing = Card.Height + Gap;

const WasteOffset = { x: 30, y: 0 };
const FoundationOffset = { x: 0, y: 0 };
const TableauOffset = { x: 0, y: 24 };

// https://en.wikipedia.org/wiki/Klondike_(solitaire)#Rules
const Positions = {
  Stock: { x: 0, y: 0 },
  Waste: { x: HorizSpacing, y: 0 },
  Foundations: [ 3, 4, 5, 6 ].map( i => ( { x: HorizSpacing * i, y: 0 } ) ),
  Tableaus: [ 0, 1, 2, 3, 4, 5, 6 ].map( i => ( { x: HorizSpacing * i, y: VertSpacing } ) ),
}

let active;

const board = {
  stock: [],
  waste: [],
  foundations: Array.from( Array( 4 ), _ => [] ),
  tableaus:    Array.from( Array( 7 ), _ => [] ),
}

// Add all possible cards to stock, then shuffle
for ( let suit = 0; suit < Card.NumSuits; suit ++ ) {
  for ( let rank = 0; rank < Card.NumRanks; rank ++ ) {
    board.stock.push( {
      rank: rank,
      suit: suit,
      faceup: false,
    } );
  }
}

// Shuffle deck
// TODO: More thorough shuffle? (or just do this a few more times)
board.stock.sort( ( a, b ) => Math.random() - 0.5 );

for ( let t = 0; t < 7; t ++ ) {
  for ( let i = 0; i <= t; i ++ ) {
    board.tableaus[ t ].push( board.stock.pop() );
  }
  board.tableaus[ t ].at( -1 ).faceup = true;
}



// Rasterize a larger version of SVG to use
const scale = devicePixelRatio * Card.Width / imageCardWidth;
const off = document.createElement( 'canvas' );
off.width = image.width * scale;
off.height = image.height * scale;

const offCtx = off.getContext( '2d' );
offCtx.scale( scale, scale );
offCtx.drawImage( image, 0, 0 );

// Prepare canvas
const canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );

resizeCanvas( canvas, HorizSpacing * 7, Math.round( VertSpacing * 3 ) );

const ctx = canvas.getContext( '2d' );

function draw() {
  // scaleX, skewY, skewX, scaleY, translateX, translateY
  ctx.setTransform( devicePixelRatio, 0, 0, devicePixelRatio, 0, 0 );

  ctx.fillStyle = '#123';
  ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

  if ( board.stock.length > 0 ) {
    drawCard( ctx, board.stock.at( -1 ), 0, 0 );
  }
  else {
    drawCardOutline( ctx, 0, 0 );
  }

  // Draw the top 3 cards of the waste (or as many as we have)
  drawCardOutline( ctx, HorizSpacing, 0 );

  if ( board.waste.length > 0 ) {
    const wasteStartIndex = Math.max( 0, board.waste.length - 3 );
    const wasteDrawSize = Math.min( 3, board.waste.length );

    for ( let cIndex = 0; cIndex < wasteDrawSize; cIndex ++ ) {
      const wasteCardIndex = wasteStartIndex + cIndex;

      if ( board.waste == active?.oldStack && wasteCardIndex == active.oldStartIndex ) {
        break;
      }

      drawCard(
        ctx,
        board.waste[ wasteCardIndex ],
        HorizSpacing + WasteOffset.x * cIndex,
        0
      );
    }
  }

  board.foundations.forEach( ( foundation, fIndex ) => {
    drawCardOutline( ctx, HorizSpacing * ( fIndex + 3 ), 0 );

    // just draw top card
    if ( foundation.length > 0 ) {
      drawCard(
        ctx,
        foundation.at( -1 ),
        HorizSpacing * ( fIndex + 3 ),
        0
      );
    }
  } );

  board.tableaus.forEach( ( tableau, tIndex ) => {
    for ( let cIndex = 0; cIndex < tableau.length; cIndex ++ ) {
      if ( tableau == active?.oldStack && cIndex == active.oldStartIndex ) {
        break;
      }

      drawCard(
        ctx,
        tableau[ cIndex ],
        HorizSpacing * tIndex,
        VertSpacing + TableauOffset.y * cIndex
      );
    }
  } );

  if ( active ) {
    for ( let cIndex = active.oldStartIndex; cIndex < active.oldStack.length; cIndex ++ ) {
      drawCard(
        ctx,
        active.oldStack[ cIndex ],
        active.pos.x,
        active.pos.y + TableauOffset.y * ( cIndex - active.oldStartIndex )
      );
    }
  }
}

function drawCardOutline( ctx, x, y ) {
  ctx.beginPath();
  ctx.roundRect( x, y, Card.Width, Card.Height, 5 );
  ctx.strokeStyle = 'white';
  ctx.stroke();
}

draw();

// If card is null, draw back
function drawCard( ctx, card, x, y ) {

  const srcCol = card.faceup ? card.rank : 2;
  const srcRow = card.faceup ? card.suit : 4;

  ctx.drawImage(
    off,

    // source image is HiDPI
    srcCol * Card.Width * devicePixelRatio,
    srcRow * Card.Height * devicePixelRatio,
    Card.Width * devicePixelRatio,
    Card.Height * devicePixelRatio,

    // destination is screen location
    x,
    y,
    Card.Width,
    Card.Height,
  );
}

function resizeCanvas( canvas, width, height ) {
  // HiDPI canvas needs larger image for same display size
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
}

//
// Input
//

canvas.addEventListener( 'pointerdown', e => {
  // for this test, we are scrolling around large canvas, so we want pageX/Y
  const mx = e.pageX;
  const my = e.pageY;

  // Stock
  if ( 0 <= mx && mx <= Card.Width && 0 <= my && my <= Card.Height ) {
    if ( board.stock.length > 0 ) {
      for ( let i = 0; i < 3 && i < board.stock.length; i ++ ) {
        const card = board.stock.pop();
        card.faceup = true;
        board.waste.push( card );

        // TODO: Some sort of "turn" animation here? maybe faceup has a timer for turn progress?
      }
    }
    else {
      while ( board.waste.length > 0 ) {
        const card = board.waste.pop();
        card.faceup = false;
        board.stock.push( card );
      }
    }
  }

  // TODO: Elegent way to avoid copying this below?
  // act on array of [ 'waste', 'tableau' ] and iterate into positions based on this?
  if ( board.waste.length > 0 ) {
    const left = HorizSpacing + WasteOffset.x * Math.min( 2, board.waste.length - 1 );
    const top = 0;
    const right = left + Card.Width;
    const bottom = top + Card.Height;

    if ( left <= mx && mx <= right && top <= my && my <= bottom ) {
      active = {
        // card: board.waste.at( -1 ),
        oldStack: board.waste,
        oldStartIndex: board.waste.length - 1,
        newStack: null,
        pos: { x: left, y: top },
      }
    }
  }

  // TODO: Can also bring down top card from foundation


  board.tableaus.find( ( tableau, tIndex ) => {

    // Start with top-most cards so we don't accidently match something lower down the stack
    for ( let cIndex = tableau.length - 1; cIndex >= 0; cIndex -- ) {
      // TODO: Use the values from Positions instead?
      const left = HorizSpacing * tIndex;
      const top = VertSpacing + TableauOffset.y * cIndex;
      const right = left + Card.Width;
      const bottom = top + Card.Height;

      if ( left <= mx && mx <= right && top <= my && my <= bottom ) {
        active = {
          // card: card,
          oldStack: tableau,
          oldStartIndex: cIndex,
          newStack: null,
          pos: { x: left, y: top },
        }

        break;
      };
    }
  } );

  draw();
} );

function cancelActive( e ) {
  if ( active ) {
    if ( active.newStack && active.oldStack != active.newStack ) {
      active.newStack.splice( active.newStack.length, 0, ...active.oldStack.splice( active.oldStartIndex ) );

      if ( active.oldStack.length > 0 ) {
        active.oldStack.at( -1 ).faceup = true;
      }
    }

    active = null;

    draw();
  }
}

canvas.addEventListener( 'pointerup', cancelActive );
canvas.addEventListener( 'pointercancel', cancelActive );

canvas.addEventListener( 'pointermove', e => {
  if ( active && e.buttons == 1 ) {
    active.pos.x += e.movementX;
    active.pos.y += e.movementY;

    const mx = e.pageX;
    const my = e.pageY;

    active.newStack = board.foundations.find ( ( foundation, fIndex ) => {
      const left = HorizSpacing * ( fIndex + 3 );
      const top = 0;
      const right = left + Card.Width;
      const bottom = top + Card.Height;

      return left <= mx && mx <= right && top <= my && my <= bottom;
    } ) ?? board.tableaus.find( ( tableau, tIndex ) => {
      const left = HorizSpacing * tIndex;
      const top = VertSpacing + TableauOffset.y * ( tableau.length - 1 );
      const right = left + Card.Width;
      const bottom = top + Card.Height;

      return left <= mx && mx <= right && top <= my && my <= bottom;
    } );

    draw();
  }
} );
