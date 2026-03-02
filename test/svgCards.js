// import * as Card from '../src/Card.js'

const Card = {
  NumRanks: 13,
  NumSuits: 4,
  Width: 150,
};

const image = new Image();
image.src = './images/Aisleriot_-_Anglo_playing_cards.svg';
await image.decode();

const imageCardWidth = image.width / Card.NumRanks;
const imageCardHeight = image.height / ( Card.NumSuits + 1 );   // additional line has jokers and card back

Card.Height = Card.Width * imageCardHeight / imageCardWidth;

// Grid of cards
const cards = [];

for ( let suit = 0; suit < Card.NumSuits; suit ++ ) {
  for ( let rank = 0; rank < Card.NumRanks; rank ++ ) {
    cards.push( {
      x: rank * Card.Width,
      y: suit * Card.Height,
      rank: rank,
      suit: suit,
    } );
  }
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

resizeCanvas( canvas, Card.Width * 13, Card.Height * 4 );

const ctx = canvas.getContext( '2d' );

function draw() {
  // scaleX, skewY, skewX, scaleY, translateX, translateY
  ctx.setTransform( devicePixelRatio, 0, 0, devicePixelRatio, 0, 0 );

  ctx.fillStyle = '#123';
  ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

  cards.forEach( card => {      
    ctx.drawImage(
      off,

      // source image is HiDPI
      card.rank * Card.Width * devicePixelRatio,
      card.suit * Card.Height * devicePixelRatio,
      Card.Width * devicePixelRatio,
      Card.Height * devicePixelRatio,
      
      // destination is screen location
      card.x,
      card.y,
      Card.Width, 
      Card.Height,
    );
  } );
}

draw();

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

let active;

canvas.addEventListener( 'pointerdown', e => {
  // for this test, we are scrolling around large canvas, so we want pageX/Y
  const mx = e.pageX;
  const my = e.pageY;

  cards.forEach( card => {
    if ( card.x <= mx && mx <= card.x + Card.Width &&
         card.y <= my && my <= card.y + Card.Height ) {
      active = card;
    }
  } );

  cards.push( cards.splice( cards.indexOf( active ), 1 )[ 0 ] );

  draw();
} );

canvas.addEventListener( 'pointerup', e => {
  active = null;
} );

canvas.addEventListener( 'pointercancel', e => {
  active = null;
} );

canvas.addEventListener( 'pointermove', e => {
  if ( active && e.buttons == 1 ) {
    active.x += e.movementX;
    active.y += e.movementY;

    draw();
  }
} );