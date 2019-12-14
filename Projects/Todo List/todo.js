//Use $(parent).on("click", child, function) to 
//allow new (added) things to work as well.
//need to do more than just on click, need parent into child to designate the actual place to click.

//strike through clicked items on list (and remove strike through when needed)

$("ul").on("click", "li", function(){
	$(this).toggleClass("strike");
});

//deleting items off the list

$("ul").on("click", "span", function(event){

	//this.parent is the li: need to fade out and then remove
	//second this is the li as well
	$(this).parent().fadeOut(500, function(){
		$(this).remove();
	});
	//event stop prop will not trigger other click events
	event.stopPropagation();
});

//adding an element to list

$("input[type='text'").keypress(function(event){
	//If enter pushed
	if(event.which ===13)
	{
		//get the text input
		var text = $(this).val();
		//add an li
		//append allows the element to take in that particular html
		$("ul").append("\t<li><span><i class='fa fa-trash'></i></span> " + text + "</li>");
	}
});

//pushing up or down the input field

$(".fa-plus").click(function(){
	$("input[type='text'").fadeToggle();
});