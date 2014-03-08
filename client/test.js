// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x000000);

// create a renderer instance
var screenx = 1024;
var screeny = 768;

var renderer = new PIXI.WebGLRenderer(screenx, screeny);//autoDetectRenderer(400, 300);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

requestAnimFrame( animate );

function randomRange(x, y) {
  return x + (y-x) * Math.random();
}

function rectangle( width, height, backgroundColor, borderColor, borderWidth ) { 
  var box = new PIXI.Graphics();
  box.beginFill(backgroundColor);
  box.lineStyle(borderWidth , borderColor);
  box.drawRect(0, 0, width - borderWidth, height - borderWidth);
  box.endFill();
  return box;
};

function circle(radius, backgroundColor, borderColor, borderWidth ) { 
  var circle = new PIXI.Graphics();
  circle.beginFill(backgroundColor);
  circle.lineStyle(borderWidth, borderColor);
  circle.drawCircle(0, 0, radius);
  circle.endFill();
  return circle;
};

var ACC = 0.05;
var SPEEDRANGE = 2;
var AMOUNT = 10;

var PARTICLE = function() {
  this.sprite = new circle(10, 0xFF0000, 0xFFFFFF, 0)
  
  this.sprite.position.x = screenx/2;
  this.sprite.position.y = screeny;

  this.acceleration = $V([0, ACC]);
  console.log(this.acceleration.elements[1]);
  this.speed = $V([randomRange(-SPEEDRANGE,SPEEDRANGE), randomRange(-10,0)]);
  this.age = 0;
  this.life = 60 * 3 * Math.random();
  
  return this;
}

var g = 9.80665/100;

function updateParticle(b) {
  b.age++;
  b.sprite.alpha = 1 -(b.age/b.life);
  b.speed.add(b.acceleration);
  b.sprite.position.x += b.speed.elements[0];
  b.sprite.position.y += b.speed.elements[1];

  if(b.sprite.position.x > screenx || b.sprite.position.y > screeny || (b.age > b.life)) {
    stage.removeChild(b.sprite);
    objects.remove(b);
  }
}

var objects = [];

objects.remove = function(o) {
  var i = this.indexOf(o);
  if(i > -1) {
    this.splice(i, 1);
    return this;
  }
};

for(var i = 0; i < AMOUNT; i++) {
  objects.push(new PARTICLE());
}

objects.push(new PARTICLE());

function animate() {
  requestAnimFrame(animate);

  for(var i = 0; i < objects.length; i++) {
    stage.addChild(objects[i].sprite);
    updateParticle(objects[i]);
  }

  for(var i = 0; i < AMOUNT; i++) {
    objects.push(new PARTICLE);
  }
  // render the stage
  renderer.render(stage);
}

var speedSlider = document.getElementById("speed");
var speedChange = function(e) {
  SPEEDRANGE = e.srcElement.value/10;
}
speedSlider.onchange = speedChange;

var accSlider = document.getElementById("acc");
var accChange = function(e) {
  ACC = e.srcElement.value/10000;
}
accSlider.onchange = accChange;

var amountSlider = document.getElementById("amount");
var amountChange = function(e) {
  AMOUNT = e.srcElement.value;
}
amountSlider.onchange = amountChange;