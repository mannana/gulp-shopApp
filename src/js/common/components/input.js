function Input(countainer) {
    this.container = countainer;
    this.numberInput=this.container.find(".js-num");
    this.number = parseInt(this.numberInput.html());
    this.addBtn = this.container.find(".js-add");
    this.minusBtn = this.container.find(".js-reduce");
    this.init();
}
$.extend(Input.prototype,{
    init:function() {
        this.bindEvents();
    },
    bindEvents:function(){
        this.minusBtn.on("click", $.proxy(this.handleMinus,this));
		this.addBtn.on("click", $.proxy(this.handleAdd,this));
    },
    handleMinus: function() {
		this.number<=1?this.number=1:this.number--;
		this.numberInput.html(this.number);
		$(this).trigger("change");
	},

	handleAdd: function() {
		this.number++;
		this.numberInput.html(this.number);
		$(this).trigger("change");
	},
	getNumber: function() {
		return this.number;
	}
})
module.exports = {
    input:Input
}
