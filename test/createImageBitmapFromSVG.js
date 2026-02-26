// This still seems blurry, possibly due to innacurate CARD_WIDTH or inexactness of rasterizing SVG

const CARD_WIDTH = 0.64;
const CARD_HEIGHT = 1;

const SHEET_COLS = 13;
const SHEET_ROWS = 5;

const cssWidth = 900;
const cssHeight = 600;

// HiDPI canvas needs larger image for same display size
const canvas = document.createElement( 'canvas' );
canvas.style.width = cssWidth + 'px';
canvas.style.height = cssHeight + 'px';
canvas.width = cssWidth * devicePixelRatio;
canvas.height = cssHeight * devicePixelRatio;                             

document.body.appendChild( canvas );

const ctx = canvas.getContext( '2d' );
ctx.scale( devicePixelRatio, devicePixelRatio );

const image = new Image();
image.onload = async () => {

  const size = 300;

  // Need to create HiDPI image to draw from
  const bitmap = await createImageBitmap( 
    image, 
    { 
      resizeWidth:  size * SHEET_COLS * CARD_WIDTH * devicePixelRatio,
      resizeHeight: size * SHEET_ROWS * CARD_HEIGHT * devicePixelRatio,
      resizeQuality: 'high' 
    } 
  );

  for ( let i = 0; i < 13; i ++ ) {
    ctx.drawImage( 
      bitmap, 

      // source image is HiDPI
      i * size * CARD_WIDTH * devicePixelRatio, 
      0, 
      size * CARD_WIDTH * devicePixelRatio,   
      size * CARD_HEIGHT * devicePixelRatio,
      
      // destination is css location
      i * size * CARD_WIDTH, 
      ( i % 2 ) * size * CARD_HEIGHT, 
      size * CARD_WIDTH, 
      size * CARD_HEIGHT,
    );
  }
}

image.src = '../images/Aisleriot_-_Anglo_playing_cards.svg';