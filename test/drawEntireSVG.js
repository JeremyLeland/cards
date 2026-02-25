import { Canvas } from '../src/common/Canvas.js';

const canvas = new Canvas();
canvas.backgroundColor = '#123';
canvas.bounds = [ 0, 0, 1, 1 ];


const image = new Image();
image.src = '../images/Aisleriot_-_Anglo_playing_cards.svg';

image.onload = function() {
  console.log('loaded!')
  canvas.redraw();
};


canvas.draw = ( ctx ) => {
  // ctx.drawImage( image, 0, 0, 13 * 0.64, 5 * 1 );    // close up
  ctx.drawImage( image, 0, 0, 1, 0.64 );
}