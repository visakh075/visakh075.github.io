class bird
{
    constructor(_p5)
    {
        this.p5=_p5;
        this.max_acc=.5;
        this.max_vel=4;
        this.arr_d=8;
        this.color=this.p5.color(255,136,0);
        
        this.acc=this.p5.createVector(0,0);
        this.pos=this.p5.createVector(Math.random()*this.p5.height,Math.random()*this.p5.width);
        this.vel=p5.Vector.random2D();
        
        this.vel.setMag(this.max_vel);

        this.deb=true;
    }

    // Functions

    seek(target,apply=false)
    {
        if(target instanceof bird)
        {
            target=target.pos;
        }
        var desired=p5.Vector.sub(target,this.pos);
        desired.limit(this.max_vel);
        desired.sub(this.vel);
        //return desired;
        if(apply===true)
        {this.applyForce(desired);}
        else
        {
            return(desired);
        }
    }
    flee(target,apply=false)
    {
        if(apply===true)
        //return(this.seek(target));
        {this.applyForce(this.seek(target).mult(-1));}
        else
        {
            this.seek(target).mult(-1);
        }
    }

    arrive(target,apply=false)
    {
        if(target instanceof bird)
        {
            target=target.pos;
        }
        var seek=this.seek(target);
        var d=this.p5.dist(this.pos.x,this.pos.y,target.x,target.y);
        if(d<this.arr_d && d>0 && seek!=null)
        {
            if(apply)
            {this.applyForce(seek.mult(d/this.arr_d));}
            else
            {
                return seek.mult(d/this.arr_d);
            }
        }
        else
        {
            if(apply)
            {this.applyForce(seek);}
            else
            {
                return seek;
            }
        }
    }
    pursuit(target)
    {
        var future=p5.Vector.add(target.pos,target.vel);
        //target.pos=future;
        this.arrive(future);
    }
    evade(target_o)
    {
        var future=p5.Vector.add(target_o.pos,target_o.vel);
        //target.pos=future;
        this.flee(future);
    }
    draw()
    {
        this.p5.stroke(this.color);
        this.p5.noFill();
        this.p5.circle(this.pos.x,this.pos.y,10);
        this.p5.line(this.pos.x,this.pos.y,this.pos.x+this.vel.x,this.pos.y+this.vel.y);
    }
    applyForce(force)
    {
        this.acc.add(force);
        this.acc.limit(this.max_acc);
    }
    update()
    {
        //this.applyForce(this.seekf());

        this.vel.add(this.acc);
        this.vel.limit(this.max_vel);
        this.pos.add(this.vel);

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
        this.acc.mult(0);
    }

}
const p = (sketch)=>
{
    //var tar;
    sketch.setup=()=>
    {
        sketch.canvas=sketch.createCanvas(500,500);
        sketch.tar=sketch.createVector(0,0);
        sketch.bird_x=new bird(sketch);
        sketch.tar= new bird(sketch);
        sketch.tar.vel.mult(0);
        sketch.bird_x.max_vel=0;
    };
    sketch.draw=()=>
    {
        sketch.background(0);
        if(sketch.tar!=null)
        {
            //sketch.tar.vel()
            sketch.bird_x.flee(sketch.tar,true);
            sketch.tar.pursuit(sketch.bird_x,true);
            //sketch.tar.seeko(sketch.bird_x);
            sketch.tar.draw();
            sketch.circle(sketch.tar.x,sketch.tar.y,10);
            sketch.tar.update();
            
        }
        sketch.bird_x.update();
        sketch.bird_x.draw();
        sketch.stroke(255,0,0);

        
        
    };
    sketch.keyPressed=()=>
    {
        if(sketch.keyCode===67)
        {
            sketch.tar=null;
        }
    }
    sketch.mouseClicked=()=>
    {
        sketch.tar=new bird(sketch);
        sketch.tar.color=sketch.color(0,255,0);
        //sketch.tar.max_vel=2;
        sketch.tar.pos=sketch.createVector(sketch.mouseX,sketch.mouseY);
        
        console.log(sketch.mouseX,sketch.mouseY);
    };
};
let world=new p5(p);