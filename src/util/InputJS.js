/**
 * @author HB
 * @date 2018/5/22
 * @fileName InputJS.js
 * @Description:  输入框交互样式
*/

/*------------------------------------- 输入框交互--------------------------------------*/
//输入框获得焦点时
$("input").focus(function(event) {
    //label动态上升，升至顶部
    $(this).siblings("label").stop().animate({"bottom": "30px"}, 500);
    //div模拟的下边框伸出，其width动态改变至input的width
    $(this).next(".bottom-line").stop().animate({"width": "76%","left":"12%"}, 500);
});
//输入框失去焦点时
$("input").blur(function(event) {
    // 假如输入框为空，则label恢复原位
    if ($(this).val() =="") {
        //label动态下降，恢复原位
        $(this).siblings("label").stop().animate({bottom: "10px"}, 500);
        //用div模拟的下边框缩回，其width动态恢复为默认宽度0
        $(this).next(".bottom-line").stop().animate({"width": "0"}, 500);
    }
    else{
        //用div模拟的下边框缩回，其width动态恢复为默认宽度0
        $(this).next(".bottom-line").stop().animate({"width": "0"}, 500);
    }
});