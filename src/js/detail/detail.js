var Swiper = require("../common/swiper.js");
var goodTpl = require("./detail.mustache");
var goodInfoTpl = require("./show_detail.mustache");
function Page() {
    this.goodInfoElem = $(".js-content");
    this.infoElem = $(".js-info");
    this.addBtnElem = $(".js-add-btn");
}
$.extend(Page.prototype,{
    init:function() {
        this.bindEvents();
    },
    bindEvents:function(){
        this.getData();
    },
    getData:function() {
        $.ajax({
			url: "/mock/index.json",
			success: $.proxy(this.handleGetDataSucc, this)
		})
    },
    handleGetDataSucc:function(res) {
        var href=location.href;
        var id=href.slice(href.indexOf("=")+1);
        var data=res.data;
        for(var i=0,len=data.goods.length;i<len;i++){
            if(data.goods[i].goodId==id){
                this.good=data.goods[i];
                var goodInfoHtml = goodTpl({good:data.goods[i]});
                this.goodInfoElem.html(goodInfoHtml);
                var infoHtml = goodInfoTpl({info:data.goods[i]});
                this.infoElem.html(infoHtml);
                this.initSwiper();
                this.addBtnClick();
            }
        }
    },
    addBtnClick:function() {
        this.addBtnElem.on("click",$.proxy(this.addToCart,this));
    },
    addToCart:function(){
        var flag=true;
        var cart=[];
        var cartStorage={
            id:this.good.goodId,
            imgurl:this.good.imgUrl,
            price:this.good.price,
            brand:this.good.brand,
            title:this.good.title,
            count:1
        }
        if(window.localStorage.cart){
            cart=JSON.parse(window.localStorage.cart);
            for(var i=0;i<cart.length;i++){
                if(cart[i].id==this.good.goodId){
                    cart[i].count++;
                    flag=false;
                    break;
                }
            }
        }
        if(flag){
            cart.push(cartStorage);
        }
        window.localStorage.cart=JSON.stringify(cart);
    },
    initSwiper:function() {
        this.mySwiper=new Swiper('.swiper-container',{
            grabCursor : true,
            pagination : '.swiper-pagination',
            slidesPerView: 'auto',
            paginationClickable: true,
            freeMode:true
        });
    }
})
var page=new Page();
page.init();
