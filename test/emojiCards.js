const SuitIcon = {
  Spade: '♠️',
  Heart: '♥️',
  Diamond: '♦️',
  Club: '♣️',
};

function resizeCanvas( canvas, width, height ) {
  // HiDPI canvas needs larger image for same display size
  canvas.style.width = width + 'px'; 
  canvas.style.height = height + 'px'; 
  canvas.width = width * devicePixelRatio; 
  canvas.height = height * devicePixelRatio;
}

const canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );

resizeCanvas( canvas, 900, 600 );

const ctx = canvas.getContext( '2d' );

ctx.fillStyle = 'tan';
ctx.fillRect( 0, 0, canvas.width * devicePixelRatio, canvas.height * devicePixelRatio );

ctx.fillStyle = 'white';
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;
ctx.roundRect( 0, 0, 200, 300, 10 );
ctx.fill();
ctx.stroke();

ctx.fillStyle = 'black';
ctx.font = '40px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

const rankLabel = 'A';
const suitIcon = SuitIcon.Spade;

ctx.save(); {
  ctx.translate( 40, 40 );
  ctx.fillText( rankLabel, 0, 0 );
  ctx.translate( 0, 30 );
  ctx.scale( 0.5, 0.5 );
  ctx.fillText( suitIcon, 0, 0 );
}
ctx.restore();

ctx.save(); {
  ctx.translate( 100, 150 );
  ctx.fillText( suitIcon, 0, 0 );
}
ctx.restore();

ctx.save(); {
  ctx.translate( 200 - 40, 300 - 40 );
  ctx.rotate( Math.PI );
  ctx.fillText( rankLabel, 0, 0 );
  ctx.translate( 0, 30 );
  ctx.scale( 0.5, 0.5 );
  ctx.fillText( suitIcon, 0, 0 );
}
ctx.restore();