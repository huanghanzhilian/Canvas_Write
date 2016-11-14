

var canvaswidth=Math.min(800,$(window).width()-20);
var canvasheight=canvaswidth;

var isousedown=false;
var lastloc={x:0,y:0};
var lastlo=0;  //初始化按下时间开始
var lastlopol=-1;
var strok='block';

var canvas=document.getElementById("canvas");
canvas.width=canvaswidth;
canvas.height=canvasheight;
var context=canvas.getContext("2d");              //得到绘图上下文环境

drawGrid();
$("#clear_btn").click(function(e){
	context.clearRect(0,0,canvaswidth,canvasheight);     //清除指定的矩形
	drawGrid();
});

$(".yans").click(function(){
	$(".yans").removeClass('on');
	$(this).addClass('on');
	strok=$(this).css('background-color')
})

$("#controller").css({'width':canvaswidth+'px'})


function beginstroke(point){
	isousedown=true;
	//console.log(isousedown)
	lastloc=windowtocanvas(point.x,point.y);  //鼠标按住时记住开始绘制点
	lastlo=new Date().getTime();
}

function endstroke(){
	isousedown=false;
	//console.log(isousedown)
}

function movestroke(point){
	//console.log(isousedown)
	var curloc=windowtocanvas(point.x,point.y);
	var ydlastlo=new Date().getTime();  //移动时的时间
	var s=colcDistance(curloc,lastloc);
	var t=ydlastlo-lastlo;   //计算出每次移动开始到结束的时间
	var lineWindth=calcl(t,s);  //计算时间和路程 算出绘制仿真
	
	context.beginPath()
	context.moveTo(lastloc.x,lastloc.y);     //鼠标按住记住点开始绘图
	context.lineTo(curloc.x,curloc.y);       //鼠标移动每次都会触发函数所以要记住上一个点
	//context.closePath();
	
	context.strokeStyle=strok;
	context.lineWidth=lineWindth;
	context.lineCap="round";    //绘制圆形的结束线帽：
	context.lineJoin="round";   //当两条线条交汇时，创建圆形边角：
	context.stroke(); 
	
	lastloc=curloc;                          //每次移动一次lastloc==curloc结束点，进来就会记住curloc在加新值，就达到效果
	lastlo=ydlastlo;
	lastlopol=lineWindth
	//console.log(lineWindth)
}

canvas.onmousedown=function(e){
	e.preventDefault();//阻止默认的事件响应
	beginstroke({x:e.clientX,y:e.clientY})
}//鼠标按下事件

canvas.onmouseup=function(e){
	e.preventDefault();//阻止默认的事件响应
	endstroke();
}//鼠标左键抬起事件

canvas.onmouseout=function(e){
	e.preventDefault();//阻止默认的事件响应
	endstroke();
	//console.log(isousedown)
}//鼠标离开事件

canvas.onmousemove=function(e){
	e.preventDefault();//阻止默认的事件响应
	if(isousedown){
	    //主体	
		movestroke({x:e.clientX,y:e.clientY})
	}
}//鼠标移动事件

canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	touch=e.touches[0];    //防止多手指点击
	beginstroke({x:touch.pageX,y:touch.pageY});
});//手指按下监听器

canvas.addEventListener('touchmove',function(e){
	e.preventDefault();
	if(isousedown){
		touch=e.touches[0];
		movestroke({x:touch.pageX,y:touch.pageY})
	}
});//手指触摸监听器

canvas.addEventListener('touchend',function(e){
	e.preventDefault();
	endstroke();
});//手指抬起监听器



//获取canvas坐标返回函数
function windowtocanvas(x,y){
	var bbox=canvas.getBoundingClientRect();
	return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)}
}

//速度仿真实写字
function colcDistance(loc1,loc2){
	return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y)); //参数 x 的平方根。如果 x 小于 0，则返回 NaN。  sqrt() 方法可返回一个数的平方根。
}

//计算时间和路程 算出绘制仿真
function calcl(t,s){
	var v=s/t;   //v==路程除以时间等于时间均值
	var reultlin;
	if(v<=0.1){
		reultlin=20;
	}else if(v>=10){
		reultlin=1
	}else{
		reultlin=20-(v-0.1)/(10-0.1)*(20-1)
	}
	if(lastlopol==-1){
		return reultlin
	}else{
		return lastlopol*2/3+reultlin*1/3;
	}
	
}

function drawGrid(){
	
	context.save();//保存最原始的状态
    
    context.strokeStyle='rgb(230,11,9)';    //设置线条颜色
    context.beginPath()
	context.moveTo(3,3);
	context.lineTo(canvaswidth-3,3);
	context.lineTo(canvaswidth-3,canvasheight-3);
	context.lineTo(3,canvasheight-3);
	context.closePath();
	
	context.lineWidth=5;          //定义线条宽度
	context.stroke();             //先设置状态，最后进行绘制函数   绘制笔画线条
	
	
	context.beginPath()
	context.moveTo(0,0);
	context.lineTo(canvaswidth,canvasheight);
	
	context.moveTo(canvaswidth,0);
	context.lineTo(0,canvasheight);
	
	context.moveTo(0,canvasheight/2);
	context.lineTo(canvaswidth,canvasheight/2);
	
	context.moveTo(canvaswidth/2,0);
	context.lineTo(canvaswidth/2,canvasheight);
	
	
	
	context.closePath();
	
	context.lineWidth=1;          //定义线条宽度
	
	context.stroke();             //先设置状态，最后进行绘制函数   绘制笔画线条
	
	context.restore();//用来恢复Canvas之前保存的状态
	
}
	
	