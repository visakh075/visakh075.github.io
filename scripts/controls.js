// Schedule only after flock
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
$(document).ready(main);
function main()
{
    // update the background css
    
    $(":root").css("--main-bg",bgColor);
    $(":root").css("--main-bg-tr",bgColorTr);

    // control panel create in runtime
    console.log("document ready >");
    var nPrey=prColor.length;
 
    // Speed Controls
    var curr=$('.speed_control').html("<div>speeds</div>");
    for(var i=-1;i<nPrey;i++)
    {
        var domC="";
        domC+= "<div class='tune_bar' id='"+i+"' data-w='speed'>";
        if(i==-1)
        {
            domC+= "<div class='progress' id='"+i+"'style='background-color:"+pdColor+"'></div>"; 
        }
        else{
            domC+= "<div class='progress' id='"+i+"'style='background-color:"+prColor[i]+"'></div>";
        }
        domC+= "</div>"
        var curr=$('.speed_control').html();
        $('.speed_control').html(curr+domC);
    }

    // scale controls
    var curr=$('.scale_control').html("<div>size</div>");
    for(var i=-1;i<nPrey;i++)
    {
        var domC="";
        domC+= "<div class='tune_bar' id='"+i+"' data-w='scale'>";
        if(i==-1)
        {
            domC+= "<div class='progress' id='"+i+"'style='background-color:"+pdColor+"'></div>"; 
        }
        else{
            domC+= "<div class='progress' id='"+i+"'style='background-color:"+prColor[i]+"'></div>";
        }
        domC+= "</div>"
        var curr=$('.scale_control').html();
        $('.scale_control').html(curr+domC);
    }
    
    // pause cand debug
    $(".control_box li").click(
        function()
        {
            if($(this).attr("id")=='p_bttn')
            {
                flock_world_sim.run=!flock_world_sim.run;
            }
            if($(this).attr("id")=='d_bttn')
            {
                flock_world_sim.debug=!flock_world_sim.debug;
                if(flock_world_sim.debug===true)
                {
                    flock_world_sim.pack.set_debug();
                }
                else
                {
                    flock_world_sim.pack.set_n_debug();
                }
            }
        }
    );
    
    // adjust tune_bars
    // on bird constructor
    $(".tune_bar").click(function (event) { 
        var offset = $(this).offset();
        var left = offset.left;
        var t_w=$(this).width();
        var type=$(this).attr("id");
        var val=event.pageX-left;
        
        console.log($(this).attr("data-w"));

        if($(this).attr("data-w")=='speed')
        {
            var spd=smap(0,t_w,g_min_vel,g_max_vel,val);
            flock_world_sim.pack.set_tune_type(type,'vel',spd);
            flock_world_sim.pack.set_tune_type(type,'acc',spd*acc_per_vel);
        }
        else if($(this).attr("data-w")=='scale')
        {
            var scl=smap(0,t_w,g_min_sze,g_max_sze,val);
            flock_world_sim.pack.set_tune_type(type,'scale',scl);
            flock_world_sim.pack.set_tune_type(type,'perc',scl*perc_per_scale);            
        }
        $(this).find(".progress").css("width",val);
        
    });
    $(".tune_bar").mousemove(
        function(event)
        {
            var offset = $(this).offset();
            var left = offset.left;
            var t_w=$(this).width();
            //var type=$(this).attr("id");
            var val=event.pageX-left;
            var type=$(this).attr("data-w");
            if(event.buttons==1)
            {
                $(this).find(".progress").css("width",val);
                if(type=='speed')
                {
                    var spd=smap(0,t_w,g_min_vel,g_max_vel,val);
                    flock_world_sim.pack.set_tune_type(type,'vel',spd);
                    flock_world_sim.pack.set_tune_type(type,'acc',spd*acc_per_vel);
                }
                else if(type=='scale')
                {
                    var scl=smap(0,t_w,g_min_sze,g_max_sze,val);
                    flock_world_sim.pack.set_tune_type(type,'scale',scl);
                    flock_world_sim.pack.set_tune_type(type,'perc',scl*perc_per_scale);   
                }
            }
            
        }
       
    );
    console.log("document ready <");
    
    map=get_sitemap();
    max_col=Math.max(...map);
    max_row=map.length;


    $(".grid").scroll(function()
    {
        highlight_sitemap();
        $("#hlt_txt").css("visibility","hidden");
    });
    $(".grid .row").scroll(function()
    {
        highlight_sitemap();
        $("#hlt_txt").css("visibility","hidden");
    });
    

    $(this).keydown(function (e) { 
        var vH=$("main").height();
	    var vW=$("main").width();
	
        var cTop=$(".grid").scrollTop();
        var iRow=Math.floor(cTop/vH);
        var q=".grid .row:nth-child("+(iRow+1)+")";
        var cRow=$(q);
        var cLeft=cRow.scrollLeft();
        var iCol=cLeft/vW;
        
        switch(e.which)
        {
            case 37:
                // LEFT
                cRow.scrollLeft((iCol-1)*vW);
                break;
            case 39:
                // LEFT
                cRow.scrollLeft((iCol+1)*vW);
                break;

            case 38:
                // UP
                $(".grid").scrollTop((iRow-1)*vH);
                break;
            case 40:
                // DOWN
                $(".grid").scrollTop((iRow+1)*vH);
                break;
            
        }
    });

    load_icons();
}
