class bird
{
  constructor()
  {
    var purple = color(101, 81, 147);
    var bluish = color(109, 128, 172);
    var reddish = color(252, 71, 51);
    var greenish = color(131, 153, 97);
    var brown = color(181, 98, 69);

    var colors = [purple, bluish, greenish, reddish, brown];
    //this.pos=p5.Vector.random2D().mult(400);
    this.perc_rad=50;
    this.scale=10;
    this.friends=[];
    // this.color=color(Math.random(255),Math.random(255),Math.random(255));
    this.color=random(colors);
    this.max_vel=4;
    this.max_acc=.2;
    this.pos=new p5.Vector(Math.random(),Math.random(0));
    this.pos.mult(500);
    this.vel=p5.Vector.random2D().mult(5);
    this.acc=new p5.Vector(0,0);
  }
  update()
  {
    var sep=this.separation().mult(1.5);
    var ali=this.align().mult(1.5);
    var coh=this.cohision().mult(1);
    var total=p5.Vector.add(coh,ali);
    total.add(sep);
    this.acc.add(total);
    this.acc.limit(this.max_acc);

    this.vel.add(this.acc);
    this.vel.setMag(this.max_vel);
    
    this.pos.add(this.vel);
    
    this.acc.mult(0);
    
    
    
    if(this.pos.x>width)
    {
      this.pos.x=0;
    }
    if(this.pos.x<0)
    {
      this.pos.x=width;
    }

    if(this.pos.y>height)
    {
      this.pos.y=0;
    }
    if(this.pos.y<0)
    {
      this.pos.y=height;
    }
  }
  draw()
  {
    
    //circle(this.pos.x,this.pos.y,10);
    noFill();

    var x=this.pos.x;
    var y=this.pos.y;
    var theta=this.vel.heading();
    var st=this.scale*sin(theta)/3;
    var ct=this.scale*cos(theta)/3;
    
    stroke(255);
    stroke(this.color);
    beginShape();
    vertex(x-st,y+ct);
    vertex(x+st,y-ct);
    vertex(x+6*ct,y+6*st);
    endShape(CLOSE);


    //circle(this.pos.x,this.pos.y,this.perc_rad);
  }
  
  perception(birds)
  {
    this.friends=[];
    for(var i=0;i<birds.length;i++)
    {
      var d=dist(this.pos.x,this.pos.y,birds[i].pos.x,birds[i].pos.y);
      if(d<this.perc_rad && this!=birds[i])
      {
        this.friends.push([birds[i],d]);
      }
    }
  }
  separation()
  {
    var desired=createVector(0,0);
    for(var i=0;i<this.friends.length;i++)
    {
      var des=p5.Vector.sub(this.pos,this.friends[i][0].pos);
      
      des.div(this.friends[i][1]);
      des.setMag(this.max_vel);
      desired.add(des);
    }
    if(this.friends.length>0)
    {
    desired.div(this.friends.length);
    desired.setMag(this.max_vel);
    desired.sub(this.vel);
    desired.limit(this.max_acc);
    }
    return(desired);
  }
  align()
  {
    var desired=createVector(0,0);
    for(var i=0;i<this.friends.length;i++)
    {
      desired.add(this.friends[i][0].vel);
    }
  if(this.friends.length>0)
  {
    desired.div(this.friends.length);
    desired.setMag(this.max_vel);
    desired.sub(this.vel);
    desired.limit(this.max_acc);
  }
  return(desired);
  }

  cohision()
  {
    var desired=createVector(0,0);
    for(var i=0;i<this.friends.length;i++)
    {
      desired.add(this.friends[i][0].pos);
    }
    if(this.friends.length>0)
    {

      desired.div(this.friends.length);
      desired.sub(this.pos);
      desired.setMag(this.max_vel);
      desired.sub(this.vel);
      desired.limit(this.max_acc);
    }
    return(desired);
  }
}
class world
{
  constructor(width,height,num_of_birds,scale)
  {
    this.scale=scale;
    this.birds=[];
    this.num=num_of_birds;
    for(var i=0;i<this.num;i++)
    {
      this.birds.push(new bird());
    }
  }
  draw()
  {
    for(var i=0;i<this.num;i++)
    {
      this.birds[i].draw();
    }
  }
  update()
  {
    for(var i=0;i<this.num;i++)
    {
      this.birds[i].perception(this.birds);
      this.birds[i].update();
    }
  }

}
class flock_world
{
    constructor()
        {
        new p5(function(p5)
        {
            var run=true;
            var wScale=5;
            var pack;

            p5.setup=function(){

            frameRate(30);
            var cnv=createCanvas(windowWidth, windowHeight);
            pack=new world(height,width,150,5);
            cnv.parent('gol');
            }

            p5.draw = function(){
            //background('#383c4a');
            background(0);

            if(run===true)
            {
                pack.update();
            }
            pack.draw();
            }
            keyPressed=function()
            {
            console.log(keyCode);
            if(keyCode==80)
            {
                run=!run;
            }
            }
            p5.windowResized=function () {
            resizeCanvas(windowWidth, windowHeight);
            }

        },div
        );
    }
}
export {flock_world};