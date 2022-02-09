//import {dist} from Math;
class bird
{
    
    constructor(_p5)
    {
        // var purple = p5.color(101, 81, 147);
        // var bluish = p5.color(109, 128, 172);
        // var reddish = p5.color(252, 71, 51);
        // var greenish = p5.color(131, 153, 97);
        // var brown = p5.color(181, 9, 69);

        // var colors = [purple, bluish, greenish, reddish, brown];
        // //this.pos=p5.Vector.random2D().mult(400);
        this.p5=_p5;
        this.perc_rad=50;
        this.scale=10;
        this.friends=[];
        // this.color=color(Math.random(255),Math.random(255),Math.random(255));
        //this.color=random(colors);
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
        
        
    
            if(this.pos.x>this.p5.width)
            {
            this.pos.x=0;
            }
            if(this.pos.x<0)
            {
            this.pos.x=this.p5.width;
            }

            if(this.pos.y>this.p5.height)
            {
            this.pos.y=0;
            }
            if(this.pos.y<0)
            {
            this.pos.y=this.p5.height;
            }
    }
    draw()
    {
        
        //circle(this.pos.x,this.pos.y,10);
        this.p5.noFill();

        var x=this.pos.x;
        var y=this.pos.y;
        var theta=this.vel.heading();
        var st=this.scale*Math.sin(theta)/3;
        var ct=this.scale*Math.cos(theta)/3;
        
        this.p5.stroke(255);
        //stroke(this.color);
        this.p5.beginShape();
        this.p5.vertex(x-st,y+ct);
        this.p5.vertex(x+st,y-ct);
        this.p5.vertex(x+6*ct,y+6*st);
        this.p5.endShape(this.p5.CLOSE);


        //circle(this.pos.x,this.pos.y,this.perc_rad);
    }
    
  perception(birds)
  {
    this.friends=[];
    for(var i=0;i<birds.length;i++)
    {
      var d=this.p5.dist(this.pos.x,this.pos.y,birds[i].pos.x,birds[i].pos.y);
      //var d=400;
      if(d<this.perc_rad && this!=birds[i])
      {
        this.friends.push([birds[i],d]);
      }
    }
  }
  separation()
  {
    var desired=new p5.Vector(0,0);
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
    var desired=new p5.Vector(0,0);
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
    var desired=new p5.Vector(0,0);
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
    constructor(width,height,num_of_birds,scale,p5)
    {
        this.scale=scale;
        this.birds=[];
        this.num=num_of_birds;
        for(var i=0;i<this.num;i++)
        {
            this.birds.push(new bird(p5));
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
var dW=document.getElementById("gol").offsetWidth;
var dH=document.getElementById("gol").offsetHeight;
dens=100;
var dens=Math.min(Math.floor(dH*dW/2000),200);
const s = (sketch) => {

    var run=true;
    var width=dW;
    var height=dH;
    
    sketch.setup = () => {
        sketch.p=sketch.createCanvas(dW, dH);
        sketch.p.parent("gol");
        sketch.frameRate(30);
        sketch.pack=new world(sketch.width,sketch.height,dens,10,sketch);
    };
  
    sketch.draw = () =>  {
        //background('#383c4a');
        sketch.background(0);

        if(run===true)
        {
            sketch.pack.update();
        }
        sketch.pack.draw();
    };
  };
  

  let myp5 = new p5(s);