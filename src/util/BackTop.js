/**
 * @author HB
 * @date 2018/5/30
 * @fileName BackTop.js
 * @Description:  回到顶部
*/
$(function () {
//返回顶部
window.onscroll = function() {

    var distance = document.documentElement.scrollTop || document.body.scrollTop; //距离页面顶部的距离

    if (distance >= 500) { //当距离顶部超过500px时，显示图片
        document.getElementById('backTop').style.display = "";
    } else { //距离顶部小于500px，隐藏图片
        document.getElementById('backTop').style.display = "none";
    }
    ;

    // 判断滚动条是否到达底部
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if (scrollTop + windowHeight == scrollHeight) {
        //当滚动到底部时,执行此代码框中的代码
        document.getElementById('backTop').style.display = "none";
    }

    // 点击 返回顶部
    var backTop = document.getElementById("backTop"); //获取图标所在的div

    backTop.onclick = function () { //点击时触发的点击事件
        // document.documentElement.scrollTop = document.body.scrollTop = 0; //页面移动到顶部
        $('body,html').animate({scrollTop: 0}, 500);
        return false;
    }
}
});