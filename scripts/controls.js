// Schedule only after flock

/*
    var bgColor="#24305E";
    var pdColor="#f76c6c";
    var dpdColor="#f76c6c66";

    var prColor=["#A8D0E6",theme[4]];//,"#EAE2B7"];
    var dprColor=["#A8D0E622","#37478522"];//,"#EAE2B722"];

 */

$(document).ready(main);

function main()
{
    // control panel create in runtime
    console.log("document ready >");
    var nPrey=prColor.length;
    var nTypes=nPrey+1;
    var curr=$('.speed_control').html("<div>speed</div>");
    for(var i=0;i<nPrey;i++)
    {
        var domC="";
        domC+= "<div class='tune_bar' id='"+i+"'>";
        domC+= "<div class='progress' id='"+i+"'style='background-color:"+prColor[i]+"'></div>";
        domC+= "</div>"
        var curr=$('.speed_control').html();
        $('.speed_control').html(curr+domC);
    }
    
    // adjust tune_bars
    // on bird constructor
    $(".tune_bar").click(function (event) { 
        var offset = $(this).offset();
        var left = offset.left;
        var t_w=$(this).width();
        var type=$(this).attr("id");
        var val=event.pageX-left;
        $(this).find(".progress").css("width",val);
        flock_world_sim.pack.set_tune_type(type,'vel',smap(0,t_w,0,10,val));
        
    });
    $(".tune_bar").mousemove(
        function(event)
        {
            var offset = $(this).offset();
            var left = offset.left;
            var t_w=$(this).width();
            var type=$(this).attr("id");
            var val=event.pageX-left;
            
            if(event.buttons==1)
            {
                $(this).find(".progress").css("width",val);
                flock_world_sim.pack.set_tune_type(type,'vel',smap(0,t_w,0,10,val));
                flock_world_sim.pack.set_tune_type(type,'acc',smap(0,t_w,0,10,val)/8);
            }
        }
    );
    console.log("document ready <")

}
function smap(i_min,i_max,o_min,o_max,value)
{
    return(o_min+(o_max-o_min)*value/(i_max-i_min));
}

//console.log(flock_world_sim.pack);