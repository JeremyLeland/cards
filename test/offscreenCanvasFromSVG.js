const SHEET_COLS = 13;
const SHEET_ROWS = 5;

const cssWidth = 1400;
const cssHeight = 700;

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

  for ( let suit = 0; suit < 4; suit ++ ) {
    for ( let rank = 1; rank <= 13; rank ++ ) {
      ctx.drawImage( 
        off,

        // source image is HiDPI
        ( rank - 1 ) * CARD_WIDTH * scale, 
        suit * CARD_HEIGHT * scale, 
        CARD_WIDTH * scale,
        CARD_HEIGHT * scale,
        
        // destination is css location
        ( rank - 1 ) * CARD_WIDTH / 2,
        suit * CARD_HEIGHT / 2, 
        CARD_WIDTH / 2, 
        CARD_HEIGHT / 2,
      );
    }
  }
}

image.src = '../images/Aisleriot_-_Anglo_playing_cards.svg';