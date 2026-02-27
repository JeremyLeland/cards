const Suit = {
  'Club': '♣️', 
  'Diamond': '♦️',
  'Heart': '♥️',
  'Spade': '♠️',
};

const Card = {
  Width: 200,
  Height: 300,
  FontSize: 40,
  Suits: [ 'Club', 'Diamond', 'Heart', 'Spade' ],  // English alphabetical order, for now
  Ranks: [ '', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K' ],

  // TODO: Shorten this up: create new lists by adding to earlier lists?
  Positions: [
    [],   // no rank 0
    // A
    [
      [ 0.5, 0.5 ],
    ],

    // 2
    [
      [ 0.5, 0.25 ],
      [ 0.5, 0.75 ],
    ],

    // 3
    [
      [ 0.5, 0.25 ],
      [ 0.5, 0.5 ],
      [ 0.5, 0.75 ],
    ],

    // 4
    [
      [ 0.3, 0.25 ],
      [ 0.7, 0.25 ],
      [ 0.3, 0.75 ],
      [ 0.7, 0.75 ],
    ],

    // 5
    [
      [ 0.3, 0.25 ],
      [ 0.7, 0.25 ],
      [ 0.5, 0.5 ],
      [ 0.3, 0.75 ],
      [ 0.7, 0.75 ],
    ],

    // 6
    [
      [ 0.3, 0.25 ],
      [ 0.7, 0.25 ],
      [ 0.3, 0.5 ],
      [ 0.7, 0.5 ],
      [ 0.3, 0.75 ],
      [ 0.7, 0.75 ],
    ],

    // 7
    [
      [ 0.3, 0.25 ],
      [ 0.7, 0.25 ],
      [ 0.5, 0.375 ],
      [ 0.3, 0.5 ],
      [ 0.7, 0.5 ],
      [ 0.3, 0.75 ],
      [ 0.7, 0.75 ],
    ],

    // 8
    [
      [ 0.3, 0.25 ],
      [ 0.7, 0.25 ],
      [ 0.5, 0.375 ],
      [ 0.3, 0.5 ],
      [ 0.7, 0.5 ],
      [ 0.5, 0.625 ],
      [ 0.3, 0.75 ],
      [ 0.7, 0.75 ],
    ],

    // 9
    [
      [ 0.3, 0.25 ],
      [ 0.7, 0.25 ],
      [ 0.3, 0.425 ],
      [ 0.7, 0.425 ],
      [ 0.5, 0.5 ],
      [ 0.3, 0.575 ],
      [ 0.7, 0.575 ],
      [ 0.3, 0.75 ],
      [ 0.7, 0.75 ],
    ],

    // 10
    [
      [ 0.3, 0.25 ],
      [ 0.7, 0.25 ],
      [ 0.5, 0.35 ],
      [ 0.3, 0.425 ],
      [ 0.7, 0.425 ],
      [ 0.3, 0.575 ],
      [ 0.7, 0.575 ],
      [ 0.5, 0.65 ],
      [ 0.3, 0.75 ],
      [ 0.7, 0.75 ],
    ],

    // J
    [
      [ 0.5, 0.3 ],
      [ 0.5, 0.7 ],
    ],

    // Q
    [
      [ 0.5, 0.3 ],
      [ 0.5, 0.7 ],
    ],

    // K
    [
      [ 0.5, 0.3 ],
      [ 0.5, 0.7 ],
    ],
  ],
  Faces: [
    [ '🧛🏻‍♂️', '👸🏻', '🤴🏻' ],   // clubs
    [ '🧛🏼‍♂️', '👸🏼', '🤴🏼' ],   // diamonds
    [ '🧛🏽‍♂️', '👸🏽', '🤴🏽' ],   // hearts
    [ '🧛🏿‍♂️', '👸🏿', '🤴🏿' ],   // spades
  ],
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

resizeCanvas( canvas, 2000, 1000 );

const ctx = canvas.getContext( '2d' );

ctx.fillStyle = 'tan';
ctx.fillRect( 0, 0, canvas.width * devicePixelRatio, canvas.height * devicePixelRatio );


for ( let suit = 0; suit < 4; suit ++ ) {
  for ( let rank = 1; rank < Card.Positions.length; rank ++ ) {
    ctx.save(); {
      ctx.translate( Card.Width * ( rank - 1 ), Card.Height * suit );
      drawCard( rank, suit );
    }
    ctx.restore();
  }
}

function drawCard( rank, suit ) {
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect( 0, 0, Card.Width, Card.Height, 10 );
  ctx.fill();
  ctx.stroke();

  const suitName = Card.Suits[ suit ];

  ctx.fillStyle = suitName == 'Club' || suitName == 'Spade' ? 'black' : 'red';
  ctx.font = `${ Card.FontSize }px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const rankLabel = Card.Ranks[ rank ];
  const suitIcon = Suit[ suitName ];
  
  ctx.save(); {
    ctx.translate( Card.FontSize / 2, Card.FontSize );
    ctx.fillText( rankLabel, 0, 0 );
    ctx.translate( 0, 0.75 * Card.FontSize );
    ctx.scale( 0.5, 0.5 );
    ctx.fillText( suitIcon, 0, 0 );
  }
  ctx.restore();

  ctx.save(); {
    ctx.translate( Card.Width - Card.FontSize / 2, Card.Height - Card.FontSize );
    ctx.rotate( Math.PI );
    ctx.fillText( rankLabel, 0, 0 );
    ctx.translate( 0, 0.75 * Card.FontSize );
    ctx.scale( 0.5, 0.5 );
    ctx.fillText( suitIcon, 0, 0 );
  }
  ctx.restore();

  Card.Positions[ rank ].forEach( pos => {
    ctx.save(); {
      ctx.translate( Card.Width * pos[ 0 ], Card.Height * pos[ 1 ] );
      
      // Flip lower icons
      if ( pos[ 1 ] > 0.5 ) {
        ctx.rotate( Math.PI );
      }

      // Make Aces bigger
      if ( rank == 1 ) {
        ctx.scale( 1.5, 1.5 );
      }

      if ( rank > 10 ) {
        ctx.scale( 2.5, 2.5 );
      }

      const icon = rank > 10 ? Card.Faces[ suit ][ rank - 11 ] : suitIcon;
      ctx.fillText( icon, 0, 0 );
    }
    ctx.restore();
  } );
}