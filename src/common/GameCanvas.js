// Making a simpler version of my custom Canvas class
// This helps keep the HiDPI tricks and a few common settings in one place
// (but hopefully won't get as long winded as the other one) 

export class GameCanvas {
  constructor( width, height ) {
    this.canvas = document.createElement( 'canvas' );
    document.body.appendChild( this.canvas );

    this.canvas.oncontextmenu = () => { return false };

    this.ctx = this.canvas.getContext( '2d' );

    this.resize( width, height );
  }

  resize( width, height ) {
    // HiDPI canvas needs larger image for same display size
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.width = width * devicePixelRatio;
    this.canvas.height = height * devicePixelRatio;

    this.redraw();
  }

  redraw() {
    // Use setTransform to make sure no old transform is left behind if exception was thrown
    // scaleX, skewY, skewX, scaleY, translateX, translateY
    this.ctx.setTransform( devicePixelRatio, 0, 0, devicePixelRatio, 0, 0 );

    this.draw( this.ctx );
  }

  draw( ctx ) {}
}
