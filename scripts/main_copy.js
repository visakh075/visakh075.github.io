import * as p5 from 'p5'
class flock_world
{
    constructor(width,height,num,div)
        {
        new p5(function(p)
        {
            var run=true;
            var wScale=5;
            var pack;

            p.setup=function(){

            p.frameRate(30);
            var cnv=p.createCanvas(height, width);
            pack=new world(height,width,num,5,p);
            cnv.parent(div);
            }

            p.draw = function()
            {
                //background('#383c4a');
                p.background(0);

                if(run===true)
                {
                    pack.update();
                }
                pack.draw();
            }

            p.keyPressed=function()
            {
                console.log(keyCode);
                if(keyCode==80)
                {
                    run=!run;
                }
            }
            
            p.windowResized=function () {
                p.resizeCanvas(windowWidth, windowHeight);
                }

        },div);
    }
}

new flock_world(800,400,50,"gol");