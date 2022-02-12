const p = (sketch)=>
{
    sketch.setup=()=>
    {
        sketch.canvas=sketch.createCanvas(500,500);
    };
    sketch.draw=()=>
    {
        sketch.background(0);

    };
};
let world=new p5(p);