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

// Klondike layout
const cards = [];

for ( let suit = 0; suit < Card.NumSuits; suit ++ ) {
  for ( let rank = 0; rank < Card.NumRanks; rank ++ ) {
    cards.push( {
      // x: 0,
      // y: 0,
      rank: rank,
      suit: suit,
      faceup: false,
    } );
  }
}

// TODO: Shuffle deck once then "deal" out in order (instead of calling this function a bunch)
function removeRandomCard() {
  return cards.splice( Math.floor( Math.random() * cards.length ), 1 )[ 0 ];
}

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

function deal() {
  for ( let i = 0; i < 3; i ++ ) {
    const card = removeRandomCard();
    card.faceup = true;

    // TODO: Some sort of "turn" animation here? maybe faceup has a timer for turn progress?

    board.waste.push( card );
  }
}

deal();

for ( let f = 0; f < 4; f ++ ) {
  for ( let i = 0; i <= f; i ++ ) {
    board.foundations[ f ].push( removeRandomCard() );
  }
  board.foundations[ f ].at( -1 ).faceup = true;
}

for ( let t = 0; t < 7; t ++ ) {
  for ( let i = 0; i <= t; i ++ ) {
    board.tableaus[ t ].push( removeRandomCard() );
  }
  board.tableaus[ t ].at( -1 ).faceup = true;
}

board.stock = cards;  // put rest of cards in stock


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

  // Draw the top 3 cards of the waste (or as many as we have)
  const wasteStartIndex = Math.max( 0, board.waste.length - 3 );
  const wasteDrawSize = Math.min( 3, board.waste.length );
  for ( let i = 0; i < wasteDrawSize; i ++ ) {
    const card = board.waste[ wasteStartIndex + i ];

    if ( card != active?.card ) {
      drawCard( ctx, card, HorizSpacing + WasteOffset.x * i, 0 );
    }
  }

  board.foundations.forEach( ( foundation, fIndex ) => {
    // just draw top card
    drawCard( ctx, foundation.at( -1 ), HorizSpacing * ( fIndex + 3 ), 0 );
  } );

  board.tableaus.forEach( ( tableau, tIndex ) => {
    tableau.forEach( ( card, cIndex ) => {
      if ( card != active?.card ) {
        drawCard( ctx, card, HorizSpacing * tIndex, VertSpacing + TableauOffset.y * cIndex );
      }
    } );
  } );

  if ( active ) {
    drawCard( ctx, active.card, active.pos.x, active.pos.y );
  }
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

  if ( board.stock.length > 0 ) {
    if ( 0 <= mx && mx <= Card.Width && 0 <= my && my <= Card.Height ) {
      deal();
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
        card: board.waste.at( -1 ),
        oldStack: board.waste,
        newStack: null,
        pos: { x: left, y: top },
      }
    }
  }

  // TODO: Can also bring down top card from foundation

  // TODO: This actually is more complicated. 
  // Apparently I need to move the entire stack of cards above whichever faceup card I click on
  // So this is going to need to change eventually

  board.tableaus.find( ( tableau, tIndex ) => {
    // TODO: Use the values from Positions instead?
    const left = HorizSpacing * tIndex;
    const top = VertSpacing + TableauOffset.y * ( tableau.length - 1 );
    const right = left + Card.Width;
    const bottom = top + Card.Height;

    if ( left <= mx && mx <= right && top <= my && my <= bottom ) {
      active = {
        card: tableau.at( -1 ),
        oldStack: tableau,
        newStack: null,
        pos: { x: left, y: top },
      }

      return true;
    };

    return false;
  } );

  draw();
} );

function cancelActive( e ) {
  if ( active ) {
    if ( active.newStack ) {
      active.oldStack.pop();
      active.newStack.push( active.card );
      
      if ( active.oldStack.length > 0 ) {
        active.oldStack.at( -1 ).faceup = true;
      }
    }
    // else {
    //   active.oldStack.push( active.card );
    // }
    
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