class bubble
{
    constructor(_angle,_rad,_anchor,_p5)
    {
        this.p5=_p5;
        this.anchor=_anchor;
        this.angle=_angle;
        this.rad=_rad;
        this.rad_b=_rad*2;
        this.rad_a=_rad;
        var x=this.anchor.mx+(this.anchor.rad/2*Math.cos(this.angle));
        var y=this.anchor.my+(this.anchor.rad/2*Math.sin(this.angle));
        this.pos=new p5.Vector(x,y);
        
    }
    draw()
    {
        this.p5.noFill();
        this.p5.stroke(255,0,0);
        this.p5.circle(this.pos.x,this.pos.y,this.rad);


        this.p5.fill(0,255,0);
        //this.p5.stroke(255,0,0);
        this.p5.circle(this.pos.x,this.pos.y,this.rad-3);
        this.p5.noFill();

    }
    mOver()
    {
        if(this.rad<this.rad_b)
        {this.rad++;}
        this.draw();
    }
    nmOver()
    {
        if(this.rad>this.rad_a)
        {this.rad--;}
        this.draw();
    }
}
class brow{
    constructor(_rad,_points,_p5)
    {
        this.rad=_rad;
        this.p5=_p5;
        this.points=_points;
        this.phase=2*3.14/this.points;
        this.mx=this.p5.width/2;
        this.my=this.p5.height/2;
        this.bubbles=[];

        for(var i=0;i<this.points;i++)
        {
            this.bubbles.push(new bubble(this.phase*i,10,this,this.p5));
        }
    }
    draw()
    {
        this.p5.stroke(0,255,0);
        this.p5.circle(this.mx,this.my,this.rad);
        this.p5.stroke(255,0,0);
        for(var i=0;i<this.bubbles.length;i++)
        {
           this.bubbles[i].draw();
        }
    }
}
const m = (sketch) =>
{
  sketch.setup = () =>{
  sketch.p=sketch.createCanvas(400,400);
  sketch.p.parent("othr");
  sketch.round=new brow(200,6,sketch);
  sketch.p.mouseMoved(sketch.mosue_func);
  };
  sketch.draw = () =>
  {
    sketch.background(255);
    sketch.stroke(124);
    sketch.round.draw();
  };
  sketch.mosue_func = () =>
  {
    for(var i=0;i<sketch.round.bubbles.length;i++)
    {
       if(sketch.dist(sketch.round.bubbles[i].pos.x,sketch.round.bubbles[i].pos.y,sketch.mouseX,sketch.mouseY)<sketch.round.bubbles[i].rad)
       {
           sketch.round.bubbles[i].mOver();
           //console.log(i);
       }
       else
       {
        sketch.round.bubbles[i].nmOver();
       }
    }
  };
  
};
let round_dial = new p5(m);