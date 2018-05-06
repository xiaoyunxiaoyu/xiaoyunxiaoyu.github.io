/**
 * Created by hezhiyun on 2017/11/4.
 */
$(function(){

    //nav特效
    var liNav = $(".nav>ul>li");
    liNav.on("mouseenter",function(){

        /*$(this).addClass("navShow").siblings("li").removeClass("navShow").end().children("ul").show().end().siblings("li").children("ul").hide().end().on("mouseleave",function(){
            $(this).removeClass("navShow").children("ul").hide();
        });*/
        $(this).addClass("navShow").siblings("li").removeClass("navShow").end().children("ul").show().end().siblings("li").children("ul").hide();
        //让a标签字体显示黄色
        $(this).children("a").css({"color":"#ffd100"}).end().on("mouseleave",function(){
            $(this).children("a").css({"color":"#222"})
    });

    liNav.on("mouseleave",function(){
        $(this).removeClass("navShow").children("ul").hide();
    });
    /*liNav.eq(0).on("mouseenter",function(){

       });*/
    });


    //轮播图
    //步骤1：添加square方块并绑定current类
    var $ulLi = $(".loopbanner ul>li");
    var $ol = $(".loopbanner ol");
    for(var i=0; i<$ulLi.length; i++){
        var $newOlLi = $("<li></li>");
        $ol.append($newOlLi);
    }
    $newOlLi = $ol.children();
    /*//$newOlLi[0]已经变成了js的节点，而不是jq的，所以不能用jq的addClass()添加类,只能用回js的方法
    $newOlLi[0].className = "select";*/
    $newOlLi.eq(0).addClass("select");
    var count = 0;
    $newOlLi.on("mouseover",function(){
        //步骤2：对应的ul>li动效实现
        $(this).addClass("select").siblings().removeClass("select").parents(".loopbanner").children("ul").children("li").eq($(this).index()).stop().fadeIn(1000).siblings("li").stop().fadeOut(1000);
        //让自动轮播接着当前图片轮播,解决bug:最后一张播放时间加倍
        //count = $(this).index()>3?$(this).index():($(this).index()+1);
        count = $(this).index();
    });

    //步骤3：定时无缝滑动动效实现
    var timer = setInterval(autoPlay,3000);

    function autoPlay(){
        if(count>$ulLi.length-2){
            count=-1;
        }
        count++;
        $ulLi.eq(count).fadeIn(1000).siblings().fadeOut(1000);
        $newOlLi.eq(count).addClass("select").siblings().removeClass("select");


    }

    //步骤4：鼠标放到.loopbanner的ul上，清除定时器，移开恢复定时器
    var $loopbanner = $(".loopbanner");
    var $loopLeft = $(".loopLeft");
    var $loopRight = $(".loopRight");
    $loopbanner.on("mouseover",function(){
        clearInterval(timer);
        $loopLeft.show();
        $loopRight.show();
    });
    $loopbanner.on("mouseout",function(){
        timer = setInterval(autoPlay,3000);
        $loopLeft.hide();
        $loopRight.hide();
    });

    //步骤4：左右滑动动效实现
    /*                <div class="loopLeft"><</div>
     <div class="loopRight">></div>*/
    var $loopLeft = $(".loopLeft");
    var $loopRight = $(".loopRight");
    $loopRight.on("click",function(){
        autoPlay();
    });
    $loopLeft.on("click",function(){
        //点击向左按钮，图片向右移动
        autoPlayLeft();
    });

    //向右移动函数
    function autoPlayLeft(){
        if(count<0){
            count=$ulLi.length-1;
        }
        count--;
        $ulLi.eq(count).fadeIn(1000).siblings().fadeOut(1000);
        $newOlLi.eq(count).addClass("select").siblings().removeClass("select");

    }
/*    $loopLeft.addClass("loopLeft");
    $loopRight.addClass("loopRight");
    $loopbanner.append($loopLeft);
    $loopbanner.append($loopRight);*/


    /*************************************************返回顶部***************************************************************/
    //原理：
    //步骤1：创建返回顶部按钮
    //步骤2：屏幕大于1屏，显示按钮
    //步骤3：缓动动画返回顶部
    //核心：window.scrollTo(x,y);

    //步骤1：创建返回顶部按钮
    var $wrap = $(".wrap");
    var $topRock = $('<div class="topRock"><img src="images/top-n.png"></div>');
    $topRock.addClass("topRock");
    $wrap.prepend($topRock);

    //步骤2：被卷去的高度大于300px时显示按钮
    window.onscroll = function(){
        lader = scrollTo().top;
        if(scrollTo().top>=300){
            $topRock.show();
        }else{
            $topRock.hide();
        }

        var footer = $(".footer")[0].offsetTop;
        if(lader>footer-900){
            $topRock.css({"top":(footer-900)});
        }else{
            $topRock.removeClass("rockfix");
        }
    };
    //步骤3：点击按钮，缓动动画返回顶部
    var step = 0;//步长
    var lader = 0;//显示区域自身的位置,设置为全局变量为了滑动界面、点击火箭时能获取显示区域自身的位置
    $topRock.on("click",function(){
        animateTop(lader);
    });

    //缓动动画（返回顶部）
    function animateTop(lader){
        clearInterval(timer);
        var timer = setInterval(function(){
            var step = Math.ceil(lader/10);
            lader = lader - step;
            window.scrollTo(0,lader);
            if(lader===0){
                clearInterval(timer);
            }
        },30)
    }
    //步骤4：

    //获取屏幕被卷去的头部高度和左边被卷去的宽兼容写法
    function scrollTo(){
        return{
            "top":document.documentElement.scrollTop||document.body.scrollTop||window.pageYOffset,
            "left":document.documentElement.scrollLeft||document.body.scrollLeft||window.pageXOffset
        }
    }

    //鼠标放上返回顶部按钮更换图片
    var $rockImg = $topRock.children("img");
    $topRock.on("mouseenter",function(){
        $rockImg.attr("src","images/top-h.png");
    });
    $topRock.on("mouseleave",function(){
        $rockImg.attr("src","images/top-n.png");
    });

/************************************鼠标经过显示半透明遮罩层*******************************************************/
    //获取元素
    var $main = $(".main");
    var $mainImg = $main.find("li img");
    //绑定事件
    $mainImg.on("mouseover",function(){
        console.log($(this).index());
        $(this).css({"opacity":".7"}).on("mouseleave",function(){
            $(this).css({"opacity":"1"});
        })
    });


    /*$mian.mouseleave(function(){
        $(this).find("li").css({"opacity":1});
    })*/

    /*********************************************懒加载***************************************************************/
    //lazyload插件的使用方法：选择器.lazyload();
    $("img.lazy").lazyload();
});

