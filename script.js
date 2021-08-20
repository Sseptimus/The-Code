function loaded() {
  document.getElementById("stats").style.display = "none";
}

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  console.log("Mobile");
} else {
  console.log("other");
}
function zooming(e) {
  d3.select("svg g").attr("transform", e.transform);
}

function clicking(id) {
  d3.select(id).style("fill", "red");
}
let zoom = d3.zoom().on("zoom", zooming);
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
      document.getElementById("population").innerHTML =
        populationsOfRegions[name] + " Inhabitants";
    });
  });
var state = 0;

function switchToStats() {
  if (state == 0) {
    state = 1;
    console.log("pressed button");
    document.getElementById("statButton").innerHTML = "Paramaters";
    document.getElementById("parameters").style.display = "none";
    document.getElementById("options1").style.color = "orange";
    document.getElementById("statButton").style.color = "rgb(58, 179, 166)";
    document.getElementById("stats").style.display = "grid";
  } else {
    state = 0;
    document.getElementById("parameters").style.display = "grid";
    document.getElementById("stats").style.display = "none";
    document.getElementById("statButton").innerHTML = "Stats";
    document.getElementById("region").innerHTML = "Region";
    document.getElementById("population").innerHTML = "Undefinded Inhabitants";
    document.getElementById("options1").style.color = "rgb(58, 179, 166)";
    document.getElementById("statButton").style.color = "orange";
  }
}

function updatedist(){
    document.getElementById("distance").innerHTML = document.getElementById("distancerange").value + "%";
}
function updatevac(){
    document.getElementById("vac").innerHTML = document.getElementById("vacrange").value + "%";
}
