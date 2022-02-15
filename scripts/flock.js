
// GLOBALS
var dW=document.getElementById("flock_sim").offsetWidth;
var dH=document.getElementById("flock_sim").offsetHeight;

// desnsity function populate simulation depending on screen resolution
var dens=Math.min(Math.floor(dH*dW/2000),150);

// theme    background 
var cAlpha= "22";
var theme =["#24305E","#374785","A8D0E6","#f76c6c","#f8e9a1"];
var alpha_theme=[];
theme.forEach(
	function(item,index,array)
	{
		alpha_theme.push(item+cAlpha);
	}
);

var bgColor=theme[0];

var pdColor=theme[1];
var dpdColor=alpha_theme[1];

var prColor=theme.slice(2);
var dprColor=alpha_theme.slice(2);

var velRatio=[1,1.5,1.5];

var one_in=50;
var scale=10;
var acc_per_vel=1/10;
var perc_per_scale=10;

var g_min_vel=1;
var g_max_vel=20;
var g_min_sze=4;
var g_max_sze=15;

// classes
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
			var temp=new p5.Vector(this.perc_rad/3,0);
			for(var i=0;i<forces.length;i++)
			{	
				if(forces[i].mag()>0)
				{
					
					temp.x=-1*forces[i].x;
					temp.y=-1*forces[i].y;
					
					
					temp.setMag(this.perc_rad/2);
					//temp.setHeading(forces[i].heading());
				this.p5.line(this.pos.x,this.pos.y,this.pos.x+temp.x,this.pos.y+temp.y);
				}
			}
		}

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
		console.log("world >");
		this.scale=scale;
		this.birds=[];
		this.num=num_of_birds;
		var t_preys=prColor.length;
		for(var i=0;i<this.num;i++)
		{
			this.birds.push(new bird(p5));
			this.birds[i].scale=scale;

			if(i<Math.floor(this.num/one_in))
			{
				// type predator < 0
				this.birds[i].perc_rad=this.birds[i].scale*perc_per_scale;
				this.birds[i].type=-1;
				this.birds[i].max_vel=0.8*this.birds[i].max_vel;
				this.birds[i].max_acc=this.birds[i].max_vel*acc_per_vel;
				this.birds[i].color=p5.color(pdColor);
				this.birds[i].dbColor=p5.color(dpdColor);
			}
			else
			{
				// type prey >=0
				this.birds[i].type=i%t_preys;
				this.birds[i].perc_rad=this.birds[i].scale*perc_per_scale;
				this.birds[i].max_vel=this.birds[i].max_vel*velRatio[i%t_preys];
				this.birds[i].max_acc=this.birds[i].max_vel*acc_per_vel;
				this.birds[i].color=p5.color(prColor[i%t_preys]);
				this.birds[i].dbColor=p5.color(dprColor[i%t_preys]);
			}
		}
		console.log("world <");
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
	set_tune_type(type,coef,value)
	{
		for(var i=0;i<this.num;i++)
		{
			if(this.birds[i].type==type)
			{

				switch (coef) {
					case 'aW':
						this.birds[i].aW=value;
						break;
					case 'sW':
						this.birds[i].sW=value;
						break;
					case 'cW':
						this.birds[i].cW=value;
						break;
					case 'eW':
						this.birds[i].eW=value;
						break;
					case 'vel':
						this.birds[i].max_vel=value;
						break;
					case 'acc':
						this.birds[i].max_acc=value;
						break;
					case 'perc':
						this.birds[i].perc_rad=value;
						break;
					case 'scale':
						this.birds[i].scale=value;
						break;
					case 'color':
						this.birds[i].color=value;
						break;
				}
			}
		}
	}
	get_tune_type(type,coef)
	{
		for(var i=0;i<this.num;i++)
		{
			if(this.birds[i].type==type)
			{

				switch (coef) {
					case 'aW':
						return(this.birds[i].aW);
					case 'sW':
						return(this.birds[i].sW);
					case 'eW':
						return(this.birds[i].eW);
					case 'cW':
						return(this.birds[i].cW);
					case 'vel':
						return(this.birds[i].max_vel);
					case 'acc':
						return(this.birds[i].max_acc);
					case 'perc':
						return(this.birds[i].perc_rad);
					case 'scale':
						return(this.birds[i].scale);
					case 'color':
						return(this.birds[i].color);
				}
			}
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

// setting up the flock simulation sketch
const s = (sketch) => {
	
	sketch.setup = () => {
		sketch.p=sketch.createCanvas(dW, dH);
		sketch.run=true;
		sketch.debug=false;

		sketch.p.parent("flock_sim");
		sketch.frameRate(30);
		sketch.pack=new world(sketch.width,sketch.height,dens,scale,one_in,sketch);
		control_update();
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
		else
		{
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
		
		if(sketch.keyCode===80)
		{
		sketch.run=!sketch.run;
		
		}
		else if(sketch.keyCode===68)
		{
		sketch.debug=!sketch.debug;
		
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

function control_update()
{
	console.log("control update >");
	$(".tune_bar").each(
	function ()
		{
			var id=$(this).attr("id");
			var t_w = $(this).width();
			var type= $(this).attr("data-w");

			if(type=="speed")
			{
				var val = flock_world_sim.pack.get_tune_type(id,"vel");
				var w_map = smap(g_min_vel,g_max_vel,0,t_w,val);
				$(this).find('.progress').width(w_map);
			}
			else if(type=="scale")
			{
				var val = flock_world_sim.pack.get_tune_type(id,"scale");
				var w_map = smap(g_min_sze,g_max_sze,0,t_w,val);
				$(this).find('.progress').width(w_map);
			}
			console.log("control update <");

		}
	);
}