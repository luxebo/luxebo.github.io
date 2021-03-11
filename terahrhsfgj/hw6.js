var homeList = document.getElementsByClassName("home-button");
var homeBut = homeList[0];
var searchList = document.getElementsByClassName("search-button");
var searchBut = searchList[0];
var buttons = document.getElementsByClassName("pressable");

var homeList2 = document.getElementsByClassName("home");
var home = homeList2[0];
var searchList2 = document.getElementsByClassName("search");
var search = searchList2[0];

var keywordList = document.getElementsByClassName("keyword");
var keywordElem = keywordList[0];
var categoryList = document.getElementsByClassName("category");
var categoryElem = categoryList[0];
var realSearchList = document.getElementsByClassName("real-search-button");
var realSearchBut = realSearchList[0];
var clearList = document.getElementsByClassName("clear-button");
var clearBut = clearList[0];

var linkTrending = "/TMDBTrending";
var linkTVAiring = "/TMDBTVAiring";

var slideList = document.getElementsByClassName("slides");
var slides1 = slideList[0];
var slides2 = slideList[1];
//5 each
var slideMovieList = document.getElementsByClassName("imageMovie");
var captionMovieList = document.getElementsByClassName("captionMovie");
var slideTVList = document.getElementsByClassName("imageTV");
var captionTVList = document.getElementsByClassName("captionTV");

var searchResultsList = document.getElementsByClassName("search-results");
var searches = searchResultsList[0];

var popupList = document.getElementsByClassName("popup");
var popup = popupList[0];
var disableButList = document.getElementsByClassName("disable-button");
var disableBut = disableButList[0];

var x;
for (x = 0; x < buttons.length; ++x)
{
	buttons[x].addEventListener("click", swapPage);
}

async function fetchLink(link) {
	const response = await fetch(link, {method: "GET"});
	let resp = await response.text();
	return resp;
}

var slideIndex1 = 0;
var slideIndex2 = 0;
fetchLink(linkTrending).then(resp=>displaySlideshow1(resp));
fetchLink(linkTVAiring).then(resp=>displaySlideshow2(resp));
slideshow();

realSearchBut.addEventListener("click", searchResults);
clearBut.addEventListener("click", clearResults);
disableBut.addEventListener("click", disablePopup);

function swapPage() {
	this.classList.add("active2");
	this.parentElement.classList.add("active");
	if (this.parentElement.classList[0] == "home-button")
	{
		searchBut.classList.remove("active");
		var i;
		for (i = 0; i < searchBut.children.length; ++i)
		{
			searchBut.children[i].classList.remove("active2");
		}
		home.classList.remove("inactive");
		search.classList.add("inactive");

		clearResults();
		fetchLink(linkTrending).then(resp=>displaySlideshow1(resp));
		fetchLink(linkTVAiring).then(resp=>displaySlideshow2(resp));
	}
	else
	{
		homeBut.classList.remove("active");
		var i;
		for (i = 0; i < homeBut.children.length; ++i)
		{
			homeBut.children[i].classList.remove("active2");
		}
		search.classList.remove("inactive");
		home.classList.add("inactive");
	}
}

function displaySlideshow1(resp) {
	var json = JSON.parse(resp);
	var i = 0;
	for (i; i < json.requests.length; i++)
	{		
		var urlForImg = json.requests[i].backdrop_path;
		slideMovieList[i].src = "https://image.tmdb.org/t/p/w780/"+urlForImg;
		var yearList = json.requests[i].release_date.split("-");
		var year = yearList[0];
		captionMovieList[i].innerHTML = json.requests[i].title + " (" + year + ")";
	}
}

function displaySlideshow2(resp) {
	var json = JSON.parse(resp);
	var i = 0;
	for (i; i < json.requests.length; i++)
	{
		var urlForImg = json.requests[i].backdrop_path;
		slideTVList[i].src = "https://image.tmdb.org/t/p/w780/"+urlForImg;
		var yearList = json.requests[i].first_air_date.split("-");
		var year = yearList[0];
		captionTVList[i].innerHTML = json.requests[i].name + " (" + year + ")";
	}
}

function slideshow() {

	var i = 0;
	for (i; i < slideMovieList.length; i++)
	{
		slideMovieList[i].style.display = "none";
		captionMovieList[i].style.display = "none";
	}

	var j = 0;
	for (j; j < slideTVList.length; j++)
	{
		slideTVList[j].style.display = "none";
		captionTVList[j].style.display = "none";
	}

	slideIndex1++;
	if (slideIndex1 > slideMovieList.length-1)
	{
		slideIndex1 = 0;
	}
	slideMovieList[slideIndex1].style.display = "initial";
	captionMovieList[slideIndex1].style.display = "initial";

	slideIndex2++;
	if (slideIndex2 > slideTVList.length-1)
	{
		slideIndex2 = 0;
	}
	slideTVList[slideIndex2].style.display = "initial";
	captionTVList[slideIndex2].style.display = "initial";

	slides1.classList.remove("fade");
	slides1.offsetHeight;
	slides1.classList.add("fade");
	slides2.classList.remove("fade");
	slides2.offsetHeight;
	slides2.classList.add("fade");

	setTimeout(slideshow, 5000);
}

function searchResults() {
	if (keywordElem.value.replace(/\s/g, '').length == 0 || categoryElem.value == "None")
	{
		alert("Please enter valid values.");
		return 0;
	}
	var searchText = "";
	if (categoryElem.value == "Movies")
	{
		searchText = "/SearchMovie/" + keywordElem.value;
	}
	else if (categoryElem.value == "TVShows")
	{
		searchText = "/SearchTV/" + keywordElem.value;
	}
	else if (categoryElem.value == "Both")
	{
		searchText = "/MultiSearch/" + keywordElem.value;
	}
	fetchLink(searchText).then(resp=>displayResults(resp)).then(data=>setHandlers());
}

function displayResults(resp) {
	var json = JSON.parse(resp);
	if (json.requests.length == 0)
	{
		dictID = [];
		searches.innerHTML = '';
		var textNoResults = document.createElement("P");
		textNoResults.innerText = "No results found."
		textNoResults.classList.add("no-results-text");
		searches.appendChild(textNoResults);
		return 0;
	}
	dictID = [];
	searches.innerHTML = '';
	var textResults = document.createElement("P");
	textResults.innerText = "Showing results..."
	textResults.classList.add("yes-results-text");
	searches.appendChild(textResults);

	var i = 0;
	for (i; i < json.requests.length; i++)
	{
		var aSingleElem = document.createElement("DIV");
		var title = document.createElement("H1");
		var overview = document.createElement("P");
		var img = document.createElement("IMG");
		var firstRow = document.createElement("P");
		var secondRow = document.createElement("P");
		overview.classList.add("overview");
		firstRow.classList.add("no-bottom");
		secondRow.classList.add("no-top");

		if (i == 0)
		{
			aSingleElem.innerHTML += "<br><br>";
		}
		else
		{
			aSingleElem.innerHTML += "<br><br><br><br><br><br>";
		}

		var dict = json.requests[i];
		var keys = Object.keys(dict);
		var k = 0;
		for (k; k < keys.length; k++)
		{
			var key = keys[k];
			if (k == 0)
			{
				continue;
			}
			if (k == 1)
			{
				title.innerHTML += dict[key];
			}
			if (k == 2)
			{
				if (dict[key] == "" || dict[key] == null)
				{
					overview.innerHTML += "N/A";
				}
				else
				{
					overview.innerHTML += dict[key];
				}
			}
			if (k == 3)
			{
				if (dict[key] != null && dict[key] != "")
				{
					img.src = "https://image.tmdb.org/t/p/w185/" + dict[key];
				}
				else
				{
					img.src = "/static/movie_placeholder.png";
				}					
				img.classList.add("search-placed-images");
			}
			if (k == 4)
			{
				if (dict[key] == "" || dict[key] == null)
				{
					firstRow.innerHTML += "N/A";
					firstRow.innerHTML += " | ";
				}
				else
				{
					var year = dict[key].split("-");
					firstRow.innerHTML += year[0];
					firstRow.innerHTML += " | ";
				}
			}
			if (k == 5)
			{
				secondRow.innerHTML += ("<span class='red-star-text'>&#9733;" + dict[key] + "/5 </span>");
			}
			if (k == 6)
			{
				secondRow.innerHTML += (dict[key] + " votes");
			}
			if (k == 7)
			{
				if (dict[key].length == 0)
				{
					firstRow.innerHTML += "N/A";
				}
				else
				{
					var ck = 0;
					for (ck; ck < dict[key].length; ck++)
					{
						if (ck == dict[key].length - 1)
						{
							firstRow.innerHTML += (dict[key][ck]);
						}
						else
						{
							firstRow.innerHTML += (dict[key][ck] + ", ");
						}
					}
				}
			}
		}
		aSingleElem.appendChild(title);
		aSingleElem.appendChild(firstRow);
		aSingleElem.appendChild(secondRow);
		aSingleElem.appendChild(overview);

		var aSingleButton = document.createElement("BUTTON");
		var type = "";
		if (keys[1] == "title")
		{
			type = "movie";
		}
		else
		{
			type = "tv";
		}
		aSingleButton.innerHTML = "Show more";
		aSingleButton.classList.add("show-more-button");
		aSingleButton.setAttribute("objid", dict["id"]);
		aSingleButton.setAttribute("type", type);
		aSingleElem.appendChild(aSingleButton);

		aSingleElem.classList.add("move-all-text");
		aSingleElem.innerHTML += "<br><br><br><br>";
		searches.appendChild(aSingleElem);
		searches.appendChild(img);
	}
	searches.innerHTML += "<br><br><br><br><br><br><br><br>";
	return 0;
}

function setHandlers() {
	var showButtonList = document.getElementsByClassName("show-more-button");
	var i = 0;
	for (i; i < showButtonList.length; i++)
	{
		let x = "";
		x = showButtonList[i].getAttribute("objid");
		let y = "";
		y = showButtonList[i].getAttribute("type");
		showButtonList[i].addEventListener("click", function(){showPopupInfo(x, y);});
	}
}

function clearResults() {
	keywordElem.value = "";
	categoryElem.value = "None";
	searches.innerHTML = '';
}

function showPopupInfo(id, type) {
	popup.classList.remove("disabled");
	popup.classList.add("enabled");
	if (type == "movie")
	{
		fetchLink("/MovieDetails/"+id.toString()).then(resp=>showDetails(resp));
		fetchLink("/MovieCredits/"+id.toString()).then(resp=>showCredits(resp));
		fetchLink("/MovieReviews/"+id.toString()).then(resp=>showReviews(resp));
	}
	else if (type == "tv")
	{
		fetchLink("/TVDetails/"+id.toString()).then(resp=>showDetails(resp));
		fetchLink("/TVCredits/"+id.toString()).then(resp=>showCredits(resp));
		fetchLink("/TVReviews/"+id.toString()).then(resp=>showReviews(resp));
	}
}

function showDetails(resp) {
	var innerPopupList = document.getElementsByClassName("description");
	var innerPopup = innerPopupList[0];
	var dict = JSON.parse(resp);

	var aSingleElem = document.createElement("DIV");
	var title = document.createElement("P");
	var overview = document.createElement("P");
	var img = document.createElement("IMG");
	var firstRow = document.createElement("P");
	var secondRow = document.createElement("P");
	var thirdRow = document.createElement("P");
	title.classList.add("title-desc");
	thirdRow.classList.add("italic-third");
	img.classList.add("big-images");
	var rememberMe = "";

	var keys = Object.keys(dict);
	var k = 0;
	for (k; k < keys.length; k++)
	{
		var key = keys[k];
		if (k == 0)
		{
			rememberMe = dict[key];
		}
		if (k == 1)
		{
			title.innerHTML += dict[key];
			title.innerHTML += "<a href='https://www.themoviedb.org/movie/" + rememberMe + "' class='red-info-text'>    &#9432;</a>";
		}
		if (k == 2)
		{
			if (dict[key] == "" || dict[key] == null)
			{
				overview.innerHTML += "<br>";
				overview.innerHTML += "N/A";
			}
			else
			{
				overview.innerHTML += "<br>";
				overview.innerHTML += dict[key];
			}
		}
		if (k == 8)
		{
			if (dict[key] != null && dict[key] != "")
			{
				img.src = "https://image.tmdb.org/t/p/w780/" + dict[key];
			}
			else
			{
				img.src = "/static/movie-placeholder.jpg";
			}					
		}
		if (k == 3)
		{
			if (dict[key] == "" || dict[key] == null)
			{
				firstRow.innerHTML += "N/A";
				firstRow.innerHTML += " | ";
			}
			else
			{
				var year = dict[key].split("-");
				firstRow.innerHTML += year[0];
				firstRow.innerHTML += " | ";
			}
		}
		if (k == 5)
		{
			secondRow.innerHTML += ("<span class='red-star-text2'>&#9733;" + dict[key] + "/5 </span>");
		}
		if (k == 6)
		{
			secondRow.innerHTML += (dict[key] + " votes");
		}
		if (k == 9)
		{
			if (dict[key].length == 0)
			{
				firstRow.innerHTML += "N/A";
			}
			else
			{
				var ck = 0;
				for (ck; ck < dict[key].length; ck++)
				{
					if (ck == dict[key].length - 1)
					{
						firstRow.innerHTML += (dict[key][ck]);
					}
					else
					{
						firstRow.innerHTML += (dict[key][ck] + ", ");
					}
				}
			}
		}
		if (k == 4)
		{
			thirdRow.innerHTML += "Spoken Languages: ";
			if (dict[key].length == 0)
			{
				thirdRow.innerHTML += "N/A";
			}
			else
			{
				var lang = 0;
				for (lang; lang < dict[key].length; lang++)
				{
					if (lang == dict[key].length - 1)
					{
						thirdRow.innerHTML += (dict[key][lang]);
					}
					else
					{
						thirdRow.innerHTML += (dict[key][lang] + ", ");
					}
				}
			}
		}
	}
	aSingleElem.appendChild(title);
	aSingleElem.appendChild(firstRow);
	aSingleElem.appendChild(secondRow);
	aSingleElem.appendChild(overview);
	aSingleElem.appendChild(thirdRow);
	innerPopup.appendChild(img);
	innerPopup.appendChild(aSingleElem);
}

function showCredits(resp) {
	var innerPopupList = document.getElementsByClassName("cast");
	var innerPopup = innerPopupList[0];
	var json = JSON.parse(resp);

	innerPopup.innerHTML += "<br><br>";
	var castText = document.createElement("H1");
	castText.innerHTML = "Cast";
	innerPopup.appendChild(castText);

	if (json.requests.length == 0)
	{
		innerPopup.innerHTML += "N/A";
	}
	else
	{
		var theGrid = document.createElement("DIV");
		theGrid.classList.add("cast-grid")
		var i = 0;
		for (i; i < json.requests.length; i++)
		{
			var dict = json.requests[i];
			var keys = Object.keys(dict);

			var aSingleElem = document.createElement("DIV");
			var img = document.createElement("IMG");
			var firstRow = document.createElement("P");
			var secondRow = document.createElement("P");
			var thirdRow = document.createElement("P");
			img.classList.add("people-img");
			firstRow.classList.add("row-one-cast");
			secondRow.classList.add("row-two-cast");
			thirdRow.classList.add("row-three-cast");

			var k = 0;
			for (k; k < keys.length; k++)
			{
				var key = keys[k];
				if (k == 0)
				{
					if (dict[key] == "" || dict[key] == null)
					{
						firstRow.innerHTML += "N/A";
					}
					else
					{
						firstRow.innerHTML += dict[key];
					}
				}
				if (k == 1)
				{
					if (dict[key] != null && dict[key] != "")
					{
						img.src = "https://image.tmdb.org/t/p/w185/" + dict[key];
					}
					else
					{
						img.src = "/static/person-placeholder.png";
					}
				}
				if (k == 2)
				{
					if (dict[key] == "" || dict[key] == null)
					{
						thirdRow.innerHTML += "N/A";
					}
					else
					{
						thirdRow.innerHTML += dict[key];
					}
				}
			}
			secondRow.innerHTML += "AS";
			aSingleElem.appendChild(img);
			aSingleElem.appendChild(firstRow);
			aSingleElem.appendChild(secondRow);
			aSingleElem.appendChild(thirdRow);
			theGrid.appendChild(aSingleElem);
		}
		innerPopup.appendChild(theGrid);
	}
}

function showReviews(resp) {
	var innerPopupList = document.getElementsByClassName("reviews");
	var innerPopup = innerPopupList[0];
	var json = JSON.parse(resp);
	
	innerPopup.innerHTML += "<br><br>";
	var castText = document.createElement("H1");
	castText.innerHTML = "Reviews";
	innerPopup.appendChild(castText);

	if (json.requests.length == 0)
	{
		innerPopup.innerHTML += "N/A";
	}
	else
	{
		var i = 0;
		for (i; i < json.requests.length; i++)
		{
			var aSingleElem = document.createElement("DIV");
			var firstRow = document.createElement("P");
			var secondRow = document.createElement("P");
			var thirdRow = document.createElement("P");
			secondRow.classList.add("row-two-rev");
			thirdRow.classList.add("row-three-rev");

			var dict = json.requests[i];
			var keys = Object.keys(dict);
			var k = 0;
			for (k; k < keys.length; k++)
			{
				var key = keys[k];
				if (k == 0)
				{
					if (dict[key] == "" || dict[key] == null)
					{
						firstRow.innerHTML += "N/A";
					}
					else
					{
						firstRow.innerHTML += ("<span class='row-one-rev'>" + dict[key] + "</span>");
					}
				}
				if (k == 1)
				{
					if (dict[key] == "" || dict[key] == null)
					{
						thirdRow.innerHTML += "N/A";
					}
					else
					{
						thirdRow.innerHTML += dict[key];
					}
				}
				if (k == 2)
				{
					if (dict[key] != null)
					{
						secondRow.innerHTML += ("&#9733;" + dict[key] + "/5");
					}
				}
				if (k == 3)
				{
					if (dict[key] == "" || dict[key] == null)
					{
						firstRow.innerHTML += " on ";
						firstRow.innerHTML += "N/A";
					}
					else
					{
						firstRow.innerHTML += " on ";
						var date = dict[key].split("-");
						var string = date[1] + "/" + date[2].slice(0, 2) + "/" + date[0];
						firstRow.innerHTML += string;
					}
				}
			}
			aSingleElem.appendChild(firstRow);
			aSingleElem.appendChild(secondRow);
			aSingleElem.appendChild(thirdRow);
			aSingleElem.innerHTML += "<hr><br>";
			innerPopup.appendChild(aSingleElem);
		}
	}
	innerPopup.innerHTML += "<br><br><br><br><br><br><br><br>";
}

function disablePopup() {
	popup.classList.remove("enabled");
	popup.classList.add("disabled");
	popup.innerHTML = '<div class="inner-popup"><button class="disable-button">&times;</button><div class="description"></div><div class="cast"></div><div class="reviews"></div></div>';
	var disableButList2 = document.getElementsByClassName("disable-button");
	var disableBut2 = disableButList2[0];
	disableBut2.addEventListener("click", disablePopup);
}