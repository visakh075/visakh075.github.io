console.log("hai");
$(document).ready(main);

function main()
{
    
    $(".tune_bar").mousemove(
        function(event)
        {
            var offset = $(this).offset();
            var top = offset.top;
            var left = offset.left;
            
            var t_w=$(this).width();
            var t_h=$(this).height();

            if(event.buttons==1)
            {
                $(this).find(".progress").css("width",(event.pageX-left));
                console.log($(this).attr('id'));
            }
        }
    );

}