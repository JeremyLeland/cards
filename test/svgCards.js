// import * as Card from '../src/Card.js'

const canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );

const image = new Image();
image.onload = async () => {

  const Card = {
    NumRanks: 13,
    NumSuits: 4,
  };

  const imageCardWidth = image.width / Card.NumRanks;
  const imageCardHeight = image.height / ( Card.NumSuits + 1 );   // additional line has jokers and card back

  Card.Width = 200;
  Card.Height = Card.Width * imageCardHeight / imageCardWidth;

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

  // Rasterize a larger version of SVG to use
  const scale = devicePixelRatio * Card.Width / imageCardWidth;
  const off = document.createElement( 'canvas' );
  off.width = image.width * scale;
  off.height = image.height * scale;

  const offCtx = off.getContext( '2d' );
  offCtx.scale( scale, scale );
  offCtx.drawImage( image, 0, 0 );

  // Draw the cards
  resizeCanvas( canvas, Card.Width * 13, Card.Height * 4 );

  const ctx = canvas.getContext( '2d' );

  // scaleX, skewY, skewX, scaleY, translateX, translateY
  ctx.setTransform( devicePixelRatio, 0, 0, devicePixelRatio, 0, 0 );

  cards.forEach( card => {      
    ctx.drawImage( 
      off,

      // source image is HiDPI
      card.rank * Card.Width * devicePixelRatio,
      card.suit * Card.Height * devicePixelRatio,
      Card.Width * devicePixelRatio,
      Card.Height * devicePixelRatio,
      
      // destination is screen location
      card.rank * Card.Width,
      card.suit * Card.Height, 
      Card.Width, 
      Card.Height,
    );
  } );
}

image.src = './images/Aisleriot_-_Anglo_playing_cards.svg';

function resizeCanvas( canvas, width, height ) {
  // HiDPI canvas needs larger image for same display size
  canvas.style.width = width + 'px'; 
  canvas.style.height = height + 'px'; 
  canvas.width = width * devicePixelRatio; 
  canvas.height = height * devicePixelRatio;
}