var run=true;
var wWidth = document.getElementById('gol').offsetWidth;
var wHeight=  document.getElementById('gol').offsetHeight;
var wScale=5;
var pack=new world(wWidth,wHeight,250,5);

function setup() {
  // put setup code here
  frameRate(30);
  windowResized();
  var cnv=createCanvas(wWidth,wHeight);
  cnv.parent('gol');
}

function draw() {
  background('#383c4a');


  if(run===true)
  {
    pack.update();
  }
  pack.draw();
  // put drawing code here
}
// function mouseDragged()
// {
//   //console.log(mouseX,mouseY);
//   if(mouseIsPressed===true)
//   {
//   var c=Math.floor(mouseX/wScale);
//   var r=Math.floor(mouseY/wScale);
//   if(game_of_life.cells[r][c]==1){game_of_life.cells[r][c]=0;}else{game_of_life.cells[r][c]=1;}
//   }
//   game_of_life.draw();
// }

// function keyPressed()
// {
//   console.log(keyCode);
//   if(keyCode===80)
//   {
//     console.log('enter');
//     console.log(run);
//     run=!run;
//   }
//   if(keyCode===78)
//   {
//     game_of_life=new world(windowWidth,windowHeight,wScale);
//   }
// }
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
