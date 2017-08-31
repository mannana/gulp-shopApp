var Input = require("../common/components/input.js").input;
var listTpl = require("./list.mustache");
function Item(data,container){
    this.listData=data;
    this.price = data.price;
    this.count = data.count;
    this.id = data.id;
    this.cartData=JSON.parse(window.localStorage.cart);
    this.container = $(container);
    this.init();
}
$.extend(Item.prototype,{
    init:function() {
        this.createDom();
        this.bindEvents();
    },
    createDom:function() {
        this.elem=$(listTpl({cartList:this.listData}));
        this.inputConElem = this.elem.find(".js-inputcon");
        this.deleteBtn = this.elem.find(".js-delete");
		this.input = new Input(this.inputConElem,this.count);
        this.container.append(this.elem);
    },
    bindEvents:function(){
        $(this.input).on("change",$.proxy(this.handleChange,this));
        this.deleteBtn.on("click",$.proxy(this.delete,this));
    },
    delete:function(){
        $(this.elem).remove();
        $(this).trigger("delete");
    },
    handleChange:function(){
        this.changeCartData();
        $(this).trigger("change");
    },
    changeCartData:function(){
        for(var i=0,len=this.cartData.length;i<len;i++){
            if(this.cartData[i].id==this.id){
                this.cartData[i].count=this.getTotalCount();
            }
        }
        window.localStorage.cart=JSON.stringify(this.cartData);
        $(this).trigger("change");
    },
    getTotalPrice: function() {
        return this.input.getNumber() * this.price;
    },
    getTotalCount: function() {
        return this.input.getNumber();
    }

})
module.exports = {
    item:Item
}
