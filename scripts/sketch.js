var run=true;
var wScale=5;
var pack;

function setup() {

  frameRate(30);
  var cnv=createCanvas(windowWidth, windowHeight);
  pack=new world(height,width,150,5);
  cnv.parent('gol');
}

function draw() {
  //background('#383c4a');
  background(0);

  if(run===true)
  {
    pack.update();
  }
  pack.draw();
}
function keyPressed()
{
  console.log(keyCode);
  if(keyCode==80)
  {
    run=!run;
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
