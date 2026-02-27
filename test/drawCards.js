import * as Card from '../src/Card.js'

const canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );

resizeCanvas( canvas, Card.Width * 13, Card.Height * 4 );

const ctx = canvas.getContext( '2d' );



const cards = [];

for ( let rank = 0; rank < Card.NumRanks; rank ++ ) {
  for ( let suit = 0; suit < Card.NumSuits; suit ++ ) {
    cards.push( {
      x: rank * Card.Width,
      y: suit * Card.Height,
      rank: rank,
      suit: suit,
    } );
  }
}


function draw() {

  // scaleX, skewY, skewX, scaleY, translateX, translateY
  ctx.setTransform( devicePixelRatio, 0, 0, devicePixelRatio, 0, 0 );

  ctx.fillStyle = '#123';
  ctx.fillRect( 0, 0, canvas.width * devicePixelRatio, canvas.height * devicePixelRatio );

  cards.forEach( card => {
    ctx.save(); {
      ctx.translate( card.x, card.y );
      Card.draw( ctx, card.rank, card.suit );
    }
    ctx.restore();
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