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

  // Rasterize a larger version of SVG to use
  const scale = devicePixelRatio * 2;
  const off = document.createElement("canvas");
  off.width = image.width * scale;
  off.height = image.height * scale;

  const offCtx = off.getContext("2d");
  offCtx.scale(scale, scale);
  offCtx.drawImage(image, 0, 0);

  // Draw the cards
  const CARD_WIDTH = image.width / SHEET_COLS;
  const CARD_HEIGHT = image.height / SHEET_ROWS;

  for ( let i = 0; i < 13; i ++ ) {
    ctx.drawImage( 
      off,

      // source image is HiDPI
      i * CARD_WIDTH * scale, 
      0 * CARD_HEIGHT * scale, 
      CARD_WIDTH * scale,
      CARD_HEIGHT * scale,
      
      // destination is css location
      i * CARD_WIDTH, 
      ( i % 2 ) * CARD_HEIGHT, 
      CARD_WIDTH, 
      CARD_HEIGHT,
    );
  }
}

image.src = '../images/Aisleriot_-_Anglo_playing_cards.svg';