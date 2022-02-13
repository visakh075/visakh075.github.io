
// GLOBALS
var dW=document.getElementById("flock_sim").offsetWidth;
var dH=document.getElementById("flock_sim").offsetHeight;
var dens=Math.min(Math.floor(dH*dW/2000),200);

var bgColor="#003049";
var pdColor="#D62828";
var dpdColor="#D6282866";

var prColor=["#F77F00","#FCBF49","#EAE2B7"];
var dprColor=["#F77F0022","#FCBF4922","#EAE2B722"]

class bird
{
  	constructor(_p5)
  	{
	this.p5=_p5;  
	this.pos=p5.Vector.random2D().mult(400);
	
	this.perc_rad=50;
	this.scale=10;
	this.friends=[];
	this.color=this.p5.color(0,0,0);
	this.dbColor=this.p5.color(0,0,0);
	
	this.type=0;
	this.max_vel=4;
	this.max_acc=.2;
	
	this.cW=1;
	this.aW=1.5;
	this.sW=1.5;
	this.eW=100;

	this.pos=new p5.Vector(Math.random(),Math.random(0));
	this.pos.mult(500);
	this.vel=p5.Vector.random2D().mult(5);
	this.acc=new p5.Vector(0,0);
	this.debug=false;
  	}

  	update()
  	{
		var sep=this.separation().mult(this.sW);
		var ali=this.align().mult(this.aW);
		var coh=this.cohision().mult(this.cW);
		var fle=this.evade_pred().mult(this.eW);

		var forces=[sep,ali,coh,fle];

		if(this.debug)
		{
			this.p5.stroke(this.dbColor);
			var temp=new p5.Vector(this.perc_rad/2,0);
			for(var i=0;i<4;i++)
			{	
				if(forces[i].mag()>0)
				{
				//temp.setMag(this.perc_rad);
				temp.setHeading(forces[i].heading());
				this.p5.line(this.pos.x,this.pos.y,this.pos.x+temp.x,this.pos.y+temp.y);
				}
			}
		}

		// var sep=this.separation().mult(0);
		// var ali=this.align().mult(0);
		// var coh=this.cohision().mult(0);
		//this.evade_pred();
		var total=p5.Vector.add(coh,ali);
		total.add(sep);

		total.add(fle);

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
		var x=this.pos.x;
		var y=this.pos.y;
		var theta=this.vel.heading();
		var st=this.scale*Math.sin(theta)/3;
		var ct=this.scale*Math.cos(theta)/3;
		
		// this.p5.fill("#5294e2");
		// this.p5.stroke("#5294e2");

		if(this.debug===true)
		{
		this.p5.stroke(this.dbColor);
		this.p5.circle(this.pos.x,this.pos.y,this.perc_rad);
		}

		this.p5.stroke(this.color);
		
		this.p5.noFill();
		this.p5.beginShape();
		this.p5.vertex(x-st,y+ct);
		this.p5.vertex(x+st,y-ct);
		this.p5.vertex(x+6*ct,y+6*st);
		this.p5.endShape(this.p5.CLOSE);
		


  	}
	applyForce(force)
	{
		this.acc.add(force);
		this.acc.limit(this.max_acc);
	}
  	seek(target,apply=false)
  	{
		if(target instanceof bird)
		{
			target=target.pos;
		}
		var desired=p5.Vector.sub(target,this.pos);
		desired.setMag(this.max_vel);
		desired.sub(this.vel);
		desired.setMag(this.max_acc);
		if(apply===true)
		{
			this.applyForce(desired);}
		else
		{
			return(desired);
		}
  	}
	flee(target,apply=false)
	{
		if(apply===true)
		{
			this.applyForce(this.seek(target).mult(-1));
		}
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
			{
			this.applyForce(seek.mult(d/this.arr_d));
			}
			else
			{
				return seek.mult(d/this.arr_d);
			}
		}
		else
		{
			if(apply)
			{
				this.applyForce(seek);}
			else
			{
				return seek;
			}
		}
	}
	pursuit(target,apply=false)
	{
		var future=p5.Vector.add(target.pos,target.vel);
		if(apply===true)
		{
		this.arrive(future,true);
		}
		else
		{
		return(this.arrive(future,false));
		}
	}
	evade(target,apply=false)
	{
		var future=p5.Vector.add(target.pos,target.vel);
		if(apply===true)
		{
		this.applyForce(this.flee(future));
		}
		else
		{
		return(this.flee(future));
		}
	}
	perception(birds)
	{
		this.friends=[];
		for(var i=0;i<birds.length;i++)
		{
		var d=this.p5.dist(this.pos.x,this.pos.y,birds[i].pos.x,birds[i].pos.y);
		//var d=400;
		if(d<this.perc_rad && this!=birds[i] && d!=0)
		{
			this.friends.push([birds[i],d,birds[i].type]);
		}
		}
	}
	separation(apply=false)
	{
		var desired=new p5.Vector(0,0);
		var lc=0;
		for(var i=0;i<this.friends.length;i++)
		{
			if(this.friends[i][2]==this.type)
			{
			var des=p5.Vector.sub(this.pos,this.friends[i][0].pos);
			des.div(this.friends[i][1]);
			des.setMag(this.max_vel);
			desired.add(des);
			lc++;
			}
		}
		if(lc>0)
		{
		desired.div(lc);
		desired.setMag(this.max_vel);
		desired.sub(this.vel);
		desired.limit(this.max_acc);
		}
		if(apply)
		{
			this.applyForce(desired);
		}
		return(desired);
	}
	align(apply=false)
	{
		var desired=new p5.Vector(0,0);
		var lc=0;
		for(var i=0;i<this.friends.length;i++)
		{
			if(this.friends[i][2]==this.type)
			{
			desired.add(this.friends[i][0].vel);
			lc++;
			}
			else
			{
				// if(this.type==0) // for prey
				// {
				// desired.add(this.flee(this.friends[i][0]));
				// }
			}
		}
		if(lc>0)
		{
			desired.div(lc);
			desired.setMag(this.max_vel);
			desired.sub(this.vel);
			desired.limit(this.max_acc);
		}
		if(apply)
		{
			this.applyForce(desired);
		}
		return(desired);
	}
	cohision(apply=false)
	{
		var desired=new p5.Vector(0,0);
		var lc=0;
		for(var i=0;i<this.friends.length;i++)
		{
			if(this.friends[i][2]==this.type || this.type<0) // predators attach
			{
			desired.add(this.friends[i][0].pos);
			lc++;
			}
		}
		if(lc>0)
		{

			desired.div(lc);
			desired.sub(this.pos);
			
			desired.setMag(this.max_vel);
			desired.sub(this.vel);
			desired.limit(this.max_acc);
		}
		if(apply)
		{
			this.applyForce(desired);
		}
		return(desired);
  	}
	evade_pred()
	{
		// prey predator machanics
		var desired=new p5.Vector(0,0);
		if(this.type>-1) // prey
		{
			var lc=0;
			for(var i=0;i<this.friends.length;i++)
			{
				if(this.friends[i][2]<0) // predators
				{
					desired.add(this.pursuit(this.friends[i][0],false).mult(-1));
					lc++;
				}
			}
			if(lc>0)
			{
				desired.div(lc);
				desired.setMag(this.max_vel);
				desired.sub(this.vel);
				desired.limit(this.max_acc);
			}
			
		}
		return(desired);
	}
	wander()
	{
		this.acc=new p5.Vector(Math.random(),Math.random());
		this.acc.setMag(this.max_acc);
	}
}
class world
{
	constructor(width,height,num_of_birds,scale,one_in,p5)
	{
		this.scale=scale;
		this.birds=[];
		this.num=num_of_birds;
		for(var i=0;i<this.num;i++)
		{
			this.birds.push(new bird(p5));
			this.birds[i].scale=scale;

			if(i<Math.floor(this.num/one_in))
			{
				// type predator < 0
				this.birds[i].scale=1.5*scale; //predator is 10% larger
				this.birds[i].type=-1;
				this.birds[i].max_vel=0.8*this.birds[i].max_vel;
				this.birds[i].color=p5.color(pdColor);
				this.birds[i].dbColor=p5.color(dpdColor);
			}
			else
			{
				// type prey >=0
				this.birds[i].type=i%2;
				this.birds[i].perc_rad=100;
				this.birds[i].color=p5.color(prColor[i%2]);
				this.birds[i].dbColor=p5.color(dprColor[i%2]);
			}
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
	tune(_aW,_sW,_cW,m_acc,m_vel)
	{
		for(var i=0;i<this.num;i++)
		{
			this.birds[i].aW=_aW;
			this.birds[i].sW=_sW;
			this.birds[i].cW=_cW;
			this.birds[i].max_acc=m_acc;
			this.birds[i].max_vel=m_vel;
		}
	}
	tune_normal()
	{
		for(var i=0;i<this.num;i++)
		{
			this.birds[i].aW=1.5;
			this.birds[i].sW=1.5;
			this.birds[i].cW=1;
			this.birds[i].max_acc=.2;
			this.birds[i].max_vel=4;
		}
	}
	set_debug()
	{
		for(var i=0;i<this.num;i++)
		{
			this.birds[i].debug=true;
		}
	}
	set_n_debug()
	{
		for(var i=0;i<this.num;i++)
		{
			this.birds[i].debug=false;
		}
	}
	set_seek(target)
	{
		for(var i=0;i<this.num;i++)
		{
			this.birds[i].seek(target,true);
		}
	}
	set_evade(target)
	{
		for(var i=0;i<this.num;i++)
		{
			this.birds[i].flee(target,true);
		}
	}
}
const s = (sketch) => {
	
	sketch.setup = () => {
		sketch.p=sketch.createCanvas(dW, dH);
		sketch.run=true;
		sketch.debug=false;

		sketch.p.parent("flock_sim");
		sketch.frameRate(30);
		sketch.pack=new world(sketch.width,sketch.height,dens,10,20,sketch);
		if(sketch.debug===true)
		{
			sketch.pack.set_debug();
		}
		else
		{
			sketch.pack.set_n_debug();
		}
	};
  
	sketch.draw = () =>  
	{
		sketch.background(bgColor);
		
		if(sketch.run===true)
		{
			// if(sketch.rep!=null)
			// {
			// sketch.pack.set_evade(sketch.rep);
			// //sketch.stroke(255,0,0);
			// //sketch.circle(sketch.rep.x,sketch.rep.y,50);
			// sketch.rep.wander();
			// sketch.rep.update();
			// sketch.rep.draw();
			// }
			sketch.pack.update();
		}
		sketch.pack.draw();
	};

	sketch.windowResized = () =>
	{
		var dW=document.getElementById("flock_sim").offsetWidth;
		var dH=document.getElementById("flock_sim").offsetHeight;
		sketch.resizeCanvas(dW, dH);
	};

	sketch.keyPressed = () =>
		{
		//console.log(sketch.keyCode);
		if(sketch.keyCode===80)
		{
		sketch.run=!sketch.run;
		//console.log(sketch.run);
		}
		else if(sketch.keyCode===68)
		{
		sketch.debug=!sketch.debug;
		//console.log(sketch.debug);
		if(sketch.debug===true)
		{
			sketch.pack.set_debug();
		}
		else
		{
			sketch.pack.set_n_debug();
		}
		}
	};
	sketch.mouseClicked=()=>
	{
		// for(var i=0;i<sketch.pack.num;i++)
		// {
		// 	sketch.rep=new bird(sketch);
		// 	sketch.rep.pos=sketch.createVector(sketch.mouseX,sketch.mouseY);
		// 	sketch.rep.color=sketch.color(255,0,0);
		// 	sketch.rep.scale=20;
		
		// //sketch.pack.birds[i].vel.add(sketch.pack.birds[i].seek(sketch.p5.Vector(sketch.mouseX,sketch.mouseY)));
		// }
	};
	
  };
let flock_world_sim = new p5(s);