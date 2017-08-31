var Input = require("../common/components/input.js").input;
function Total(elem,total){
    this.elem = elem;
    this.totalPrice = total.price;
    this.totalCount = total.count;
    this.init();
}
$.extend(Total.prototype,{
    init:function() {
        this.bindEvents();
    },
    bindEvents:function() {
        this.setTotalPrice();
        this.setTotalCount();
    },
    setTotalPrice:function() {
        if(this.totalPrice || this.totalPrice === 0){
            var totalPriceArea = this.elem.find(".js-price");
            totalPriceArea.html("&yen;"+this.totalPrice);
        }
    },
    setTotalCount:function() {
        if(this.totalCount || this.totalCount === 0){
            var totalCountArea = this.elem.find(".js-count");
            totalCountArea.html(this.totalCount);
        }
    }
});
module.exports = {
    total:Total
}
