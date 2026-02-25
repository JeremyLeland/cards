const CARD_WIDTH = 0.64;
const CARD_HEIGHT = 1;

const SHEET_COLS = 13;
const SHEET_ROWS = 5;


import { Canvas } from '../src/common/Canvas.js';

const canvas = new Canvas();
canvas.backgroundColor = '#123';
canvas.bounds = [ 0, 0, 1, 1 ];


// const canvas = document.createElement( 'canvas' );
// canvas.width = 800;
// canvas.height = 600;
// document.body.appendChild( canvas );

const ctx = canvas.ctx;//getContext( '2d' );
const image = new Image();

image.onload = async () => {

  const size = 200;

  const bitmap = await createImageBitmap( 
    image, 
    { 
      resizeWidth:  size * SHEET_COLS * CARD_WIDTH,
      resizeHeight: size * SHEET_ROWS * CARD_HEIGHT, 
      resizeQuality: 'high' 
    } 
  );

  for ( let i = 0; i < 10; i ++ ) {
    ctx.drawImage( bitmap, 
      i * size * CARD_WIDTH, 0, size * CARD_WIDTH, size * CARD_HEIGHT, 
      i * size * CARD_WIDTH / 3, i * size * CARD_HEIGHT / 4, size * CARD_WIDTH, size * CARD_HEIGHT,
    );
  }
}

image.src = '../images/Aisleriot_-_Anglo_playing_cards.svg';