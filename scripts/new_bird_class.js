export class bird
{
    constructor(_p5)
    {
        this.p5=_p5;
        with(this.p5)
        {
            this.pos=createVector(random,height,width);
        }
    }
    draw()
    {
        with(this.p5)
        {
            stroke(255);
            circle(this.pos.x,this.pos.y,3);
        }
    }

}