var run=true;
var cellsize=10;
var wWidth = document.getElementById('gol').offsetWidth;
var wHeight=  document.getElementById('gol').offsetHeight;
//var wWidth=800;
var wScale=5;
var game_of_life=new world(wWidth,wHeight,wScale);

function setup() {
  // put setup code here
  frameRate(15);
  windowResized();
  var cnv=createCanvas(wWidth,wHeight);
  cnv.parent('gol');
  //cnv.center();
}

function draw() {
  background('#383c4a');


  if(run===true)
  {
    game_of_life.update();
  }
  game_of_life.draw();
  // put drawing code here
}
function mouseDragged()
{
  //console.log(mouseX,mouseY);
  if(mouseIsPressed===true)
  {
    //console.log(mouseX,mouseY,mouseIsPressed);
  var c=Math.floor(mouseX/cellsize);
  var r=Math.floor(mouseY/cellsize);
  //var cell=[r,c];
  //if(game_of_life.cells[r][c]==1){game_of_life.cells[r][c]=0;}else{game_of_life.cells[r][c]=1;}

  }
  game_of_life.draw();
}

function keyPressed()
{
  console.log(keyCode);
  if(keyCode===80)
  {
    console.log('enter');
    console.log(run);
    run=!run;
  }
  if(keyCode===78)
  {
    game_of_life=new world(windowWidth,windowHeight,wScale);
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
