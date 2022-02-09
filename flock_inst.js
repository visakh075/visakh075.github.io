import world from "./flock_.js"
import bird from "./flock_.js"

export default class flock_world
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