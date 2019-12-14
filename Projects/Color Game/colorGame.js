var colors = [];
var squares = document.querySelectorAll(".square");
var h1 = document.querySelector("h1");
var diff = "hard";
var truth = document.getElementById("truth");

var easy = document.getElementById("easy");
easy.addEventListener("click", function()
{
	diff = "easy";
	easy.classList.add("selected");
	hard.classList.remove("selected");
	colors = [];
	h1.style.background = "steelblue";
	truth.textContent = "";
	new1.textContent = "New Game";
	main();
});

var hard = document.getElementById("hard");
hard.addEventListener("click", function()
{
	diff = "hard";
	hard.classList.add("selected");
	easy.classList.remove("selected");
	colors = [];
	h1.style.background = "steelblue";
	truth.textContent = "";
	new1.textContent = "New Game";
	main();
});

var new1 = document.getElementById("new");
new1.addEventListener("click", function()
{
	colors = [];
	h1.style.background = "steelblue";
	truth.textContent = "";
	new1.textContent = "New Game";
	main();
});

function random(number)
{
	for (var i = 0; i < number; i++)
	{
		var red = Math.floor(Math.random() * 256);
		var green = Math.floor(Math.random() * 256);
		var blue = Math.floor(Math.random() * 256);
		colors.push("rgb(" + red + ", " + green + ", " + blue + ")");
	}
}

function setAll(color)
{
	if (diff == "hard")
	{
		for (var i = 0; i < squares.length; i++)
		{
			squares[i].style.display = "inline";
			squares[i].style.backgroundColor = color;
		}
		h1.style.background = color;
	}
	else
	{		
		for (var i = 0; i < squares.length; i++)
		{
			squares[i].style.display = "inline";
			squares[i].style.backgroundColor = color;
		}
		for (var i = 3; i < squares.length; i++)
		{
			squares[i].style.display = "none";
		}
		h1.style.background = color;
	}
}

function click(pickedColor)
{
	truth = document.getElementById("truth");
	for (var i = 0; i < squares.length; i++)
	{
		squares[i].style.backgroundColor = colors[i];
		squares[i].addEventListener("click", function(){
			if (this.style.backgroundColor == pickedColor)
			{
				setAll(this.style.backgroundColor);
				truth.textContent = "Correct!";
				new1.textContent = "Play Again?";
			}
			else
			{
				this.style.display ="none";
				truth.textContent = "Try Again";
			}
		});
	}
}

function main()
{
	if (diff == "hard")
	{
		for (var i = 0; i < squares.length; i++)
		{
			squares[i].style.display = "inline";
		}
		random(6);
		var pickedNum = Math.floor(Math.random() * colors.length);
		var pickedColor = colors[pickedNum];
		var color = document.getElementById("color");
		color.textContent = pickedColor;
		click(pickedColor);
	}
	else
	{
		for (var i = 0; i < 2; i++)
		{
			squares[i].style.display = "inline";
		}
		for (var i = 3; i < squares.length; i++)
		{
			squares[i].style.display = "none";
		}
		random(3);
		var pickedNum = Math.floor(Math.random() * colors.length);
		var pickedColor = colors[pickedNum];
		var color = document.getElementById("color");
		color.textContent = pickedColor;
		click(pickedColor);
	}
}

main();