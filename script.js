//functions 



function loaded() {
  document.getElementById("stats").style.display = "none";
}

function switchToStats() {
  if (state == 0) {
        state = 1;
        console.log("pressed button");
        document.getElementById("statButton").innerHTML = "Paramaters";
        document.getElementById("parameters").style.display = "none";
        document.getElementById("stats").style.display = "grid";
        if (eyepain == "none"){
            document.getElementById("options1").style.color = "orange";
            document.getElementById("statButton").style.color = "rgb(58, 179, 166)";
            
        }
  }else{
        state = 0;
        document.getElementById("parameters").style.display = "grid";
        document.getElementById("stats").style.display = "none";
        document.getElementById("statButton").innerHTML = "Stats";
        document.getElementById("region").innerHTML = "Region";
        document.getElementById("population").innerHTML = "Undefinded Inhabitants";
        if (eyepain == "none"){
            document.getElementById("options1").style.color = "rgb(58, 179, 166)";
            document.getElementById("statButton").style.color = "orange";
            document.getElementById("options1").style.color = "rgb(58, 179, 166)";
        }
    }
}

function updatedist(){
    document.getElementById("distance").innerHTML = document.getElementById("distancerange").value + "%";
}

function updatevac(){
    document.getElementById("vac").innerHTML = document.getElementById("vacrange").value + "%";
}

function clicking(id) {
    d3.select(id).style("fill", "red");
}

function zooming(e) {
    d3.select("svg g").attr("transform", e.transform);
}

function lightToDark(){
    if (eyepain == "none"){
        eyepain = "ungodly"
        document.getElementById("body").style.animation = "fadeout 1s ease forwards"
        document.getElementById("main").style.backgroundColor = "#add8e6";
        document.getElementById("lightVsDark").innerHTML = "&#9728;&nbsp;&nbsp;&nbsp;&nbsp;";
        document.getElementById("lightVsDark").style.color = "orange";
        document.getElementById("lightVsDark").style.backgroundColor = "white";
        document.getElementById("options1").style.backgroundColor = "white";
        document.getElementById("options1").style.color = "black";
        document.getElementById("statButton").style.backgroundColor = "#C9C9C9";
        document.getElementById("statButton").style.color = "black";
        document.getElementById("nzmap").style.fill = "	#98FB98";
        document.getElementById("body").style.animation = "fadein 1s ease forwards"

    }else{
        eyepain = "none"
        document.getElementById("body").style.animation = "fadeout 1s ease forwards"
        document.getElementById("lightVsDark").innerHTML = "&nbsp;&nbsp;&nbsp;&#127769;";
        document.getElementById("lightVsDark").style.color = "purple";
        document.getElementById("lightVsDark").style.backgroundColor = "black";
        document.getElementById("options1").style.backgroundColor = "#282b2e";
        document.getElementById("options1").style.color = "rgb(58, 179, 166)";
        document.getElementById("statButton").style.backgroundColor = "rgb(58, 49, 49)";
        document.getElementById("statButton").style.color = "orange";
        document.getElementById("main").style.backgroundColor = "#2f3336";
        document.getElementById("nzmap").style.fill = "#52585d";
        document.getElementById("body").style.animation = "fadein 1s ease forwards"

    }
}

// variabales
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let zoom = d3.zoom().on("zoom", zooming);
var state = 0;
var eyepain = "none"

//testing is mobile
if (isMobile) {// tests of the website is in mobile
        console.log("Mobile");
} else {
        console.log("other");
}



d3.select("svg").call(zoom);

toggled = {};
//Init all regions
d3.select("svg")
  .selectAll("path")
  .each(function () {
    let element = d3.select(this);
    let name = element.attr("name");
    console.log(name);
    console.log("Popultion:", populationsOfRegions[name]);
    toggled[name] = false;
    element.on("click", () => {
        console.log("Clicked " + name);
        if (!toggled[name]) {
            element.attr("fill", "#2e848b");
            element.attr("selected", "yes");
        } else {
            element.attr("fill", "#52585d");
            element.attr("selected", "no");
        }
        toggled[name] = !toggled[name];
        document.getElementById("region").innerHTML = name;
        document.getElementById("population").innerHTML = populationsOfRegions[name] + " Inhabitants";
    });
});

