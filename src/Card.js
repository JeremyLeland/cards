export const Rank = {
  'Ace': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  '10': 9,
  'Jack': 10,
  'Queen': 11,
  'King': 12,
};

const RankLabels = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K' ];

// English alphabetical order, for now
export const Suit = {
  'Club': 0,
  'Diamond': 1,
  'Heart': 2,
  'Spade': 3,
};

const SuitIcons = [ '♣️', '♦️', '♥️', '♠️' ];

const FaceIcons = [
  [ '🧛🏻‍♂️', '🧛🏼‍♂️', '🧛🏽‍♂️', '🧛🏿‍♂️' ],   // Jack
  [ '👸🏻', '👸🏼', '👸🏽', '👸🏿' ],   // Queen
  [ '🤴🏻', '🤴🏼', '🤴🏽', '🤴🏿' ],   // King
];

const Card = {
  Width: 200,
  Height: 300,
  FontSize: 40,

  // TODO: Shorten this up: create new lists by adding to earlier lists?
  Positions: [
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
  
};

export function draw( ctx, rank, suit ) {
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect( 0, 0, Card.Width, Card.Height, 10 );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = suit == Suit.Club || suit == Suit.Spade ? 'black' : 'red';
  ctx.font = `${ Card.FontSize }px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const rankLabel = RankLabels[ rank ];
  const suitIcon = SuitIcons[ suit ];
  
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
      if ( rank == Rank.Ace ) {
        ctx.scale( 1.5, 1.5 );
      }

      if ( rank > Rank[ '10' ] ) {
        ctx.scale( 2.5, 2.5 );
      }

      const icon = rank > Rank[ '10' ] ? FaceIcons[ rank - Rank.Jack ][ suit ] : suitIcon;
      ctx.fillText( icon, 0, 0 );
    }
    ctx.restore();
  } );
}