//所有的数据
var list = [{
		height: 950,
		width: 800,
		img: "imgs/1.jpg"
	},
	{
		height: 1187,
		width: 900,
		img: "imgs/2.jpg"
	},
	{
		height: 766,
		width: 980,
		img: "imgs/3.jpg"
	},
	{
		height: 754,
		width: 980,
		img: "imgs/4.jpg"
	},
	{
		height: 493,
		img: "imgs/5.jpg",
		width: 750
	},
	{
		height: 500,
		img: "imgs/6.jpg",
		width: 750
	},
	{	
		height: 600,
		img: "imgs/7.jpg",
		width: 400
	}];

function Slider(opts) {
	this.dom = opts.dom;
	this.list = opts.list;
	this.init();
	this.createDom(this.currentIndex);
	this.bindDom();
}

Slider.prototype.init = function() {
	this.radio = window.innerHeight / window.innerWidth;//计算窗口的长宽比
	this.radioW = window.innerWidth;//窗口的滚动一次的距离
	this.index = 0;//表示当前图片的索引
	this.currentIndex = 0;
};

Slider.prototype.createDom = function() {
	var dom = this.dom;//最外层的canvas画布
	var data = this.list;
	var len = data.length;
	var radioW = this.radioW;
	var screanHeight = window.innerHeight;
	var screanWidth = window.innerWidth;
	this.ul = document.createElement("ul");
	for(var i = 0; i < len; i++) {
		var item = data[i];
		var li = document.createElement("li");
		if(item) {
			if(item.height / item.width > this.radio) {
				li.innerHTML = "<img src=" + item.img + " height=" + screanHeight + ">";
			}else {
				li.innerHTML = "<img src=" + item.img + " width" + screanWidth + ">";
			}
		}
		li.style.webkitTransform = "translate3d(" + (i * this.radioW) + "px, 0, 0)";
		this.ul.appendChild(li);
	}
	dom.style.height = window.innerHeight + "px";
	dom.appendChild(this.ul);

};

Slider.prototype.bindDom = function() {
	var self = this;
	var radioW = self.radioW;//屏幕宽度
	var dom = self.dom;//最外层的canvas节点
	var len = self.list.length;
	var lis = dom.getElementsByTagName("li");
	var startHandle = function(evt) {

		self.startX = evt.touches[0].pageX;
		self.offsetX = 0;
		self.startTime = new Date() * 1;//转为数值
	};
	var moveHandle = function(evt) {
		evt.preventDefault();//保险起见~阻止不同浏览器的原生的默认事件
		self.offsetX = evt.touches[0].pageX - self.startX;
		var i = self.index - 1;
		var end = i + 3;//滑动图片时~只是影响当前图片的前一张到后一张这3张图片
		for(i; i < end; i++) {
			lis[i] && (lis[i].style.webkitTransform = "translate3d(" + ((i - self.index) * radioW + self.offsetX) + "px, 0, 0)");
			lis[i] && (lis[i].style.webkitTransition = "none");//避免滑动时图片的延时
		}
	};
	var endHandle = function(evt) {
		var boundary = radioW / 6;//设定当图片移动了屏幕的1/6的距离的时候就跳转到下一张
		var endTime = new Date() * 1;
		if(endTime - self.startTime > 800) {
			if(self.offsetX >= boundary) {
				//进入上一页
				self.go("-1");
			
			}else if(self.offsetX < -boundary) {
				//进入下一页
				self.go("+1");
			}else {
				//留在本页
				self.go("0");
			}
		}else {
			//用户很快地滑动了页面~可能滑动距离没有到上面定义的页面跳转的边界值的距离~但是本意也是想滑动的~这时做一个交互的优化
			if(self.offsetX > 50) {
				self.go("-1");
			}else if(self.offsetX < -50) {
				self.go("+1");
			}else {
				self.go("0");
			}
		}
		
	};
	dom.addEventListener("touchstart", startHandle);
	dom.addEventListener("touchmove", moveHandle);
	dom.addEventListener("touchend", endHandle);
}
Slider.prototype.go = function(n) {
	var index = this.index;
	var newIndex;
	var lis = this.dom.getElementsByTagName("li");
	var len = lis.length;
	var radioW = this.radioW;
	if(typeof n == "number") {
		newIndex = n;
		this.currentIndex = n;
	}else if(typeof n == "string") {
		newIndex = index + n * 1;
		this.currentIndex = this.currentIndex + n * 1;
	}
	if(newIndex > len - 1) {
		newIndex = len - 1;
	}else if(newIndex < 0) {
		newIndex = 0;
	}
	this.index = newIndex;
	lis[newIndex].style.webkitTransition = "-webkit-Transform 0.2s ease-out";//需要过渡的效果的名称，动画时间，动画效果
	lis[newIndex - 1] && (lis[newIndex - 1].style.webkitTransition = "-webkit-Transform 0.2s ease-out");
	lis[newIndex + 1] && (lis[newIndex + 1].style.webkitTransition = "-webkit-Transform 0.2s ease-out");
	lis[newIndex].style.webkitTransform = "translate3d(0, 0, 0)";
	lis[newIndex - 1] && (lis[newIndex - 1].style.webkitTransform = "translate3d(-" + radioW + "px, 0, 0)");
	lis[newIndex + 1] && (lis[newIndex + 1].style.webkitTransform = "translate3d(" + radioW + "px, 0, 0)");
}
new Slider({
	"dom": document.getElementById("canvas"),
	"list": list,
})