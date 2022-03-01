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
    var nTypes=nPrey+1;

    // Speed Controls
    var curr=$('.speed_control').html("<div>speeds</div>");
    for(var i=0;i<nPrey;i++)
    {
        var domC="";
        domC+= "<div class='tune_bar' id='"+i+"' data-w='speed'>";
        domC+= "<div class='progress' id='"+i+"'style='background-color:"+prColor[i]+"'></div>";
        domC+= "</div>"
        var curr=$('.speed_control').html();
        $('.speed_control').html(curr+domC);
    }
        var domC="";
        domC+= "<div class='tune_bar' id='-1' data-w='speed'>";
        domC+= "<div class='progress' id='-1'style='background-color:"+pdColor+"'></div>";
        domC+= "</div>"
        var curr=$('.speed_control').html();
        $('.speed_control').html(curr+domC);

    // scale controls
    var curr=$('.scale_control').html("<div>size</div>");
    for(var i=0;i<nPrey;i++)
    {
        var domC="";
        domC+= "<div class='tune_bar' id='"+i+"' data-w='scale'>";
        domC+= "<div class='progress' id='"+i+"'style='background-color:"+prColor[i]+"'></div>";
        domC+= "</div>"
        var curr=$('.scale_control').html();
        $('.scale_control').html(curr+domC);
    }
        var domC="";
        domC+= "<div class='tune_bar' id='-1' data-w='scale'>";
        domC+= "<div class='progress' id='-1'style='background-color:"+pdColor+"'></div>";
        domC+= "</div>"
        var curr=$('.scale_control').html();
        $('.scale_control').html(curr+domC);
    
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
    
    $(".grid").scroll(function()
    {
        highlight_sitemap();
        //$(".site_map_sec").css("visibility","visible");
        //console.log("scrolling");
    });
    $(".grid .row").scroll(function()
    {
        highlight_sitemap();
        //$(".site_map_sec").css("visibility","visible");
        //console.log("scrolling");
    });
    

    $(this).keydown(function (e) { 
        /*
         *  left 37
            up 38
            right 39
            down 40 
         */
        var vH=$("main").height();
        var vW=$("main").width();
        
        var cTop=$(".grid").scrollTop();
        var iRow=Math.floor(cTop/vH);
        var q=".grid .row:nth-child("+(iRow+1)+")";
        var cRow=$(q);
        //console.log(cRow);
        //console.log(q);
        var cLeft=cRow.scrollLeft();
        var iCol=cLeft/vW;

        // console.log(iRow,iCol);
        // var pos=get_position();
        // var iRow=pos[0];
        // var iCol=pos[1];        
        switch(e.which)
        {
            case 37:
                // LEFT
                cRow.scrollLeft((iCol-1)*vW);
                //highlight_sitemap();
                break;
            case 39:
                // LEFT
                cRow.scrollLeft((iCol+1)*vW);
                //highlight_sitemap();
                break;

            case 38:
                // UP
                $(".grid").scrollTop((iRow-1)*vH);
                //highlight_sitemap();
                break;
            case 40:
                // DOWN
                $(".grid").scrollTop((iRow+1)*vH);
                //highlight_sitemap();
                break;
            
        }
        //$(".site_map_sec").css("visibility","hidden");//.delay(1000);

    });

    function load_icons()
    {
        var content_html="";
        icon_list.forEach(element => {
            content_html+="<object data='other/tools_icon/"+element[1]+"' height='80px' width='80px'></object>"
            //console.log(element);
        });
        $("#tools_sec").html(content_html);
        return(content_html);
    };
    load_icons();
    //console.log(load_icons());
    
}
function highlight_sitemap()
{
    $(".site_map_sec").css("opacity","1");//.delay(1000).css("visibility","hidden");

    setTimeout(function()
    {
        $(".site_map_sec").css("opacity",".2");  
    },1000);
}
function smap(i_min,i_max,o_min,o_max,value)
{
    return(o_min+(o_max-o_min)*(value-i_min)/(i_max-i_min));
}