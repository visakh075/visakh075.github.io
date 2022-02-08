class world
{
  constructor(width,height,scale)
  {
    this.scale=scale;
    this.cells=[];
    this.rows=Math.floor(height/this.scale);
    this.cols=Math.floor(width/this.scale);
    for(var r=0;r<this.rows;r++)
    {
      let col=[];
      for(var c=0;c<this.cols;c++)
      {
        //col.push(0);
        col.push(Math.floor(Math.random()*2));
      }
      this.cells.push(col);
    }
    console.log(this.cells);
  }
  draw()
  {
    let clr=0;
    let scl=this.scale;
    for(var r=0;r<this.rows;r++)
    {
      for(var c=0;c<this.cols;c++)
      {
        if(this.cells[r][c]==1)
        {

          stroke('#5294e2');
          fill('#5294e2')
          rect((scl*c)+clr,(scl*r)+clr,scl-2*clr,scl-2*clr);
          noFill();
          noStroke();
        }
      }

    }
  }
  update()
  {
    var tCells = [];
    var ccol=[];
    for(var r=0;r<this.rows;r++)
    {
      for(var c=0;c<this.cols;c++)
      {
        ccol.push(this.cells[r][c]);
      }
      tCells.push(ccol);
      ccol=[];
    }
    //let tCells=this.cells.clone();
    //console.log(tCells);
    for(var r=0;r<this.rows;r++)
    {
      for(var c=0;c<this.cols;c++)
      {
        // count neighbours
          let neighbours=0;

          for(var i=-1;i<2;i++)
          {
            for(var j=-1;j<2;j++)
            {
              neighbours+=tCells[(this.rows+r+i)%this.rows][(this.cols+c+j)%this.cols];
            }
          }
          neighbours-=tCells[r][c];
          if(tCells[r][c]==1)
          {
            if(neighbours<2 || neighbours >3)
            {
              this.cells[r][c]=0;
            }
          }
          else {
            if(neighbours==3)
            {
              this.cells[r][c]=1;
            }
          }
      }}
    }
}
