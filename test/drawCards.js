import * as Card from '../src/Card.js'

const canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );

resizeCanvas( canvas, 2000, 1000 );

const ctx = canvas.getContext( '2d' );

ctx.fillStyle = '#123';
ctx.fillRect( 0, 0, canvas.width * devicePixelRatio, canvas.height * devicePixelRatio );

Card.draw( ctx, Card.Rank[ '7' ], Card.Suit.Club );

ctx.translate( 100, 100 );

Card.draw( ctx, Card.Rank[ '3' ], Card.Suit.Heart );

ctx.translate( 200, 100 );

Card.draw( ctx, Card.Rank.Ace, Card.Suit.Diamond );

ctx.translate( 200, 100 );

Card.draw( ctx, Card.Rank.Queen, Card.Suit.Spade );

ctx.translate( 200, -100 );

Card.draw( ctx, Card.Rank[ 'Jack' ], Card.Suit.Heart )


function resizeCanvas( canvas, width, height ) {
  // HiDPI canvas needs larger image for same display size
  canvas.style.width = width + 'px'; 
  canvas.style.height = height + 'px'; 
  canvas.width = width * devicePixelRatio; 
  canvas.height = height * devicePixelRatio;
}