export const Width = 100;
export const Height = 1.5 * Width;

export const Rank = {
  Ace:    0,
  Two:    1,
  Three:  2,
  Four:   3,
  Five:   4,
  Six:    5,
  Seven:  6,
  Eight:  7,
  Nine:   8,
  Ten:    9,
  Jack:   10,
  Queen:  11,
  King:   12,
};

const RankLabels = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K' ];

export const NumRanks = RankLabels.length;

// English alphabetical order, for now
export const Suit = {
  Clubs:     0,
  Diamonds:  1,
  Hearts:    2,
  Spades:    3,
};

const SuitIcons = [ '♣️', '♦️', '♥️', '♠️' ];

export const NumSuits = SuitIcons.length;

const FontSize = Width / 5;

const FaceIcons = [
  [ '🧛🏻‍♂️', '🧛🏼‍♂️', '🧛🏽‍♂️', '🧛🏿‍♂️' ],   // Jack
  [ '👸🏻', '👸🏼', '👸🏽', '👸🏿' ],   // Queen
  [ '🤴🏻', '🤴🏼', '🤴🏽', '🤴🏿' ],   // King
];

// TODO: Shorten this up: create new lists by adding to earlier lists?
const Positions = [
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
];

export function draw( ctx, rank, suit ) {
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect( 0, 0, Width, Height, 10 );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = suit == Suit.Clubs || suit == Suit.Spades ? 'black' : 'red';
  ctx.font = `${ FontSize }px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const rankLabel = RankLabels[ rank ];
  const suitIcon = SuitIcons[ suit ];
  
  ctx.save(); {
    ctx.translate( FontSize / 2, FontSize );
    ctx.fillText( rankLabel, 0, 0 );
    ctx.translate( 0, 0.75 * FontSize );
    ctx.scale( 0.5, 0.5 );
    ctx.fillText( suitIcon, 0, 0 );
  }
  ctx.restore();

  ctx.save(); {
    ctx.translate( Width - FontSize / 2, Height - FontSize );
    ctx.rotate( Math.PI );
    ctx.fillText( rankLabel, 0, 0 );
    ctx.translate( 0, 0.75 * FontSize );
    ctx.scale( 0.5, 0.5 );
    ctx.fillText( suitIcon, 0, 0 );
  }
  ctx.restore();

  Positions[ rank ].forEach( pos => {
    ctx.save(); {
      ctx.translate( Width * pos[ 0 ], Height * pos[ 1 ] );
      
      // Flip lower icons
      if ( pos[ 1 ] > 0.5 ) {
        ctx.rotate( Math.PI );
      }

      // Make Aces bigger
      if ( rank == Rank.Ace ) {
        ctx.scale( 1.5, 1.5 );
      }

      if ( rank > Rank.Ten ) {
        ctx.scale( 2.5, 2.5 );
      }

      const icon = rank > Rank.Ten ? FaceIcons[ rank - Rank.Jack ][ suit ] : suitIcon;
      ctx.fillText( icon, 0, 0 );
    }
    ctx.restore();
  } );
}