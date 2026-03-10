export const NumRanks = 13;
export const NumSuits = 4;

export const Width = 120;

const image = new Image();
image.src = './images/Aisleriot_-_Anglo_playing_cards.svg';
await image.decode();

const imageCardWidth = image.width / NumRanks;
const imageCardHeight = image.height / ( NumSuits + 1 );   // additional line has jokers and card back

export const Height = Width * imageCardHeight / imageCardWidth;


// Better or worse than createImageBitmap? Supposedly that goes to GPU...
// TODO: Maybe make an ImageBitmap from the offscreen canvas?
// Seemed like createImageBitmap scaling looked crappy before, but I might've been doing something else wrong

// Rasterize a larger version of SVG to use
const scale = devicePixelRatio;// * Card.Width / imageCardWidth;
const off = document.createElement( 'canvas' );
off.width = image.width * scale;
off.height = image.height * scale;

const offCtx = off.getContext( '2d' );
offCtx.scale( scale, scale );
offCtx.drawImage( image, 0, 0 );

//
// Draw card centered at x,y with scale sx,sy
// (this allows for some cheap flipping)
//

export function draw( ctx, card, x, y, sx = 1, sy = 1 ) {
  const srcCol = card.faceup ? card.rank : 2;
  const srcRow = card.faceup ? card.suit : 4;

  ctx.drawImage(
    off,

    // source image is HiDPI
    srcCol * devicePixelRatio * imageCardWidth, //Card.Width * devicePixelRatio,
    srcRow * devicePixelRatio * imageCardHeight, //Card.Height * devicePixelRatio,
    devicePixelRatio * imageCardWidth, //Card.Width * devicePixelRatio,
    devicePixelRatio * imageCardHeight, //Card.Height * devicePixelRatio,

    // destination is screen location
    x - Width * sx / 2,
    y - Height * sy / 2,
    Width * sx,
    Height * sy,
  );
}
