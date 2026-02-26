const CARD_WIDTH = 0.64;
const CARD_HEIGHT = 1;

const SHEET_COLS = 13;
const SHEET_ROWS = 5;

function resizeCanvas( canvas, width, height ) {
  // HiDPI canvas needs larger image for same display size
  canvas.style.width = width + 'px'; 
  canvas.style.height = height + 'px'; 
  canvas.width = width * devicePixelRatio; 
  canvas.height = height * devicePixelRatio;
}

const canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );

const gl = canvas.getContext( 'webgl2' );
if ( !gl ) {
  throw new Error( 'WebGL2 not supported' );
}

resizeCanvas( canvas, 800, 800 );


//
// ----- Shaders -----
//

const vertexShaderSource = /*glsl*/`
attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texcoord = a_texcoord;
}
`;

const fragmentShaderSource = /*glsl*/`
precision mediump float;

varying vec2 v_texcoord;
uniform sampler2D u_texture;

void main() {
  gl_FragColor = texture2D(u_texture, v_texcoord);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
}

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

//
// ----- Geometry (Rectangle made of 2 triangles) -----
//

// Positions in clip space (-1 to +1)
const positions = new Float32Array([
  -0.5, -0.75,
   0.5, -0.75,
  -0.5,  0.75,
  -0.5,  0.75,
   0.5, -0.75,
   0.5,  0.75,
]);

// Texture coordinates
const suit = 1, rank = 4;

const texcoords = new Float32Array([
  ( rank - 1 ) / SHEET_COLS, ( suit + 1 ) / SHEET_ROWS,
  rank         / SHEET_COLS, ( suit + 1 ) / SHEET_ROWS,
  ( rank - 1 ) / SHEET_COLS, suit / SHEET_ROWS,
  ( rank - 1 ) / SHEET_COLS, suit / SHEET_ROWS,
  rank         / SHEET_COLS, ( suit + 1 ) / SHEET_ROWS,
  rank         / SHEET_COLS, suit / SHEET_ROWS,
]);

function createBuffer(gl, data, attribute, size) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const location = gl.getAttribLocation(program, attribute);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}

createBuffer(gl, positions, "a_position", 2);
createBuffer(gl, texcoords, "a_texcoord", 2);

//
// ----- Texture -----
//

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);

// Temporary 1x1 pixel while image loads
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  1,
  1,
  0,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  new Uint8Array([0, 0, 255, 255])
);

const image = new Image();
image.src = "../images/Aisleriot_-_Anglo_playing_cards.svg";

image.onload = async () => {
  const scale = 2;

  const off = document.createElement("canvas");
  off.width = image.width * scale;
  off.height = image.height * scale;

  const offCtx = off.getContext("2d");
  offCtx.scale(scale, scale);
  offCtx.drawImage(image, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    off
  );

  gl.generateMipmap(gl.TEXTURE_2D);

  draw();
};

//
// ----- Draw -----
//

function draw() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.3, 0.2, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // gl.clearDepth( 1.0 );
// gl.enable( gl.DEPTH_TEST );
// gl.depthFunc( gl.LEQUAL );

// gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );


  gl.drawArrays(gl.TRIANGLES, 0, 6);
}