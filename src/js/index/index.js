require("../common/lazyload.js");

var IScroll = require("../common/iscroll.js");
var categoryTpl = require("./category_item.mustache");
var goodsTpl = require("./goods.mustache");
function Classify() {
	this.categoryItemElem=$(".js-category-item");
	this.categoryListElem=$(".js-category");
	this.index=0;
}
$.extend(Classify.prototype,{
	init:function() {
		this.bindEvents();
	},
	bindEvents:function() {
		$(this.categoryItemElem[this.index]).addClass("category-item-active");
		$(this.categoryListElem).on("click",$.proxy(this.bindClickItem,this));
	},
	bindClickItem:function(e){
		this.index=$(e.target).index();
		$(this.categoryItemElem[this.index]).addClass("category-item-active").siblings().removeClass("category-item-active");
	}

});

function Page() {
	this.categoryElem = $(".js-category");
	this.contentElem = $(".js-content");
	this.countElem = $(".js-count");
}

$.extend(Page.prototype, {
	init: function() {
		this.promoteEfficiency();
		this.getCategoryData();
		this.initIscroll();
		this.getTotalCount();
	},

	promoteEfficiency: function() {
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, this.isPassive() ? {
			capture: false,
			passive: false
		} : false);
	},

	getCategoryData: function(){
		$.ajax({
			url: "/mock/index.json",
			success: $.proxy(this.handleGetDataSucc, this)
		})
	},

	handleGetDataSucc: function(response) {
		var data = response.data;
		var	classifyHtml = categoryTpl({categories: data.category});
		var contentHtml = goodsTpl({goods:  data.goods});
			this.categoryElem.html(classifyHtml);
			this.contentElem.html(contentHtml);
			this.classifyScroll.refresh();
			this.contentScroll.refresh();
			this.lazyload();
			this.classify=new Classify();
			this.classify.init();
	},

	initIscroll: function() {
		this.classifyScroll = new IScroll('.classify-wrapper', {
			scrollX: true,
			scrollY: false
		});

		this.contentScroll = new IScroll('.content-wrapper', {
			scrollX: false,
			scrollY: true,
			probeType: 3
		});

		this.contentScroll.on("scroll", $.proxy(this.handleScrollEnd, this));
	},

	handleScrollEnd: function() {
		$(window).trigger("scroll");
	},

	lazyload: function() {
		$(".lazy").lazyload();
	},

	isPassive: function() {
	    var supportsPassiveOption = false;
	    try {
	        addEventListener("test", null, Object.defineProperty({}, 'passive', {
	            get: function () {
	                supportsPassiveOption = true;
	            }
	        }));
	    } catch(e) {}
	    return supportsPassiveOption;
	},
	getTotalCount:function(){
		var count=0;

		if(window.localStorage.cart){
			var	cartData=JSON.parse(window.localStorage.cart),
				len=cartData.length;
				for(var i=0;i<len;i++){
		            count+= cartData[i].count;
		        }
		        this.countElem.html(count);
				console.log(this.contentElem);
				this.countElem.removeClass("hide");
		}else {
			this.countElem.addClass("hide");
		}

    }

});

var page = new Page();
page.init();
