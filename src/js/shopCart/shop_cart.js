
var Total = require("./total.js").total;
var Item = require("./item.js").item;
function Page(){
    this.countElem=$(".js-count");
}
$.extend(Page.prototype,{
    init:function(){
        this.getCartData();
        this.createTotal();
        this.createItems();
    },
    getCartData:function(){
        if(window.localStorage.cart){
            this.cartData=JSON.parse(window.localStorage.cart);
        }else {
            this.cartData=[];
        }
    },
    createTotal:function(){
        var price=0,
            count=0,
            len=this.cartData.length;
        for(var i=0;i<len;i++){
            price+= this.cartData[i].price*this.cartData[i].count;
            count+= this.cartData[i].count;
        }
        this.countElem.html(count);
        this.total = new Total($(".js-total"),{price:price,count:count});
    },
    createItems:function(){
        this.items = [];
        for(var i=0,len=this.cartData.length;i<len;i++){
            var item = new Item(this.cartData[i],".js-cart-list");
            this.items.push(item);
            $(item).on("change",$.proxy(this.handleNumberChange,this));
            $(item).on("delete",$.proxy(this.delete,this));
        }
    },
    delete:function(e) {
        var id=e.target.id;
        var cart=JSON.parse(window.localStorage.cart);
        for(var i=0;i<cart.length;i++){
            if(cart[i].id==id){
                cart.splice(i,1);
                this.items.splice(i,1);
                window.localStorage.cart=JSON.stringify(cart);
                this.handleNumberChange();
            }
        }
    },
    handleNumberChange:function(){
        var totalPrice = 0;
        var totalCount = 0;
        for (var i = 0; i < this.items.length; i++) {
            totalPrice += this.items[i].getTotalPrice();
            totalCount += this.items[i].getTotalCount();
        }
        this.total = new Total($(".js-total"),{price:totalPrice,count:totalCount});
        this.countElem.html(totalCount);
    }
})
var page=new Page();
page.init();
