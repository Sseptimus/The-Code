//functions 
var selectedRegion = "New Zealand";

var regionNameElement;
var regionPopulationElement;
var deadLabelElement;
var deadProgressElement;
var susceptibleLabelElement;
var susceptibleProgressElement;
var undiscoveredLabelElement;
var undiscoveredProgressElement;
var caseLabelElement;
var caseProgressElement;
var hospitalisedLabelElement;
var hospitalisedProgressElement;
var recProgressElement;
var recLabelElement;

function loaded() {
  document.getElementById("stats").style.display = "none";
  state = 1

  regionNameElement = document.getElementById("region")
  regionPopulationElement = document.getElementById("population")
  deadLabelElement = document.getElementById("deadLabel")
  deadProgressElement = document.getElementById("deadProgress")
  susceptibleProgressElement = document.getElementById("susProgress")
  susceptibleLabelElement = document.getElementById("susLabel")
  undiscoveredProgressElement = document.getElementById("undiscoveredProgress")
  undiscoveredLabelElement = document.getElementById("undiscoveredLabel")
  caseLabelElement = document.getElementById("casesLabel")
  caseProgressElement = document.getElementById("casesProgress")
  hospitalisedLabelElement = document.getElementById("hospitalLabel")
  hospitalisedProgressElement = document.getElementById("hospitalProgress")
  recLabelElement = document.getElementById("recoveredLabel")
  recProgressElement = document.getElementById("recoveredProgress")

  showStatsOfRegion(selectedRegion);
  recalculateSimParams();

  recolorRegions()
  document.getElementById("loader").style.animation = "drop 1s ease forwards";
}

function switchToStats() {
    let stats = document.getElementById("statButton")

    if (state == 1){
        state = 0
        stats.innerHTML = "Params"
        stats.style.color = "green"

        document.getElementById("stats").style.display = "block"
        document.getElementById("parameters").style.display = "none"
    }else{
        state = 1
        stats.innerHTML = "Stats"
        stats.style.color = "orange"

        document.getElementById("stats").style.display = "none"
        document.getElementById("parameters").style.display = "block"
    }
}

document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    startStop()
  }
})

function updatedist(){
    document.getElementById("distance").innerHTML = document.getElementById("distancerange").value + "%";
}

function updatevac(){
    document.getElementById("vac").innerHTML = document.getElementById("vacrange").value + "%";
    if (document.getElementById("vacrange").value > 1) {
    document.getElementById("popup").style.zIndex = "5";
    
    }
}

function clicking(id) {
    d3.select(id).style("fill", "red");
}

var runningSim = false
function startStop(){
        console.log("start/stop");
        if (runningSim){
            runningSim = false;
            animatePlay()


        }else{
            runningSim = true
            animatePause()
        }
}

function zooming(e) {
    d3.select("svg g").attr("transform", e.transform);
    var scale = e.transform["k"];
    var zoom = (Math.floor(scale*100).toString())+"%"
    document.getElementById("zoom").innerHTML = zoom;
    //524 30 - 330 572 = 1500km
    //574.34px = 1500km
    var kmToPx = (575.34/1500)*scale
    document.getElementById("px2km").innerHTML = Math.floor((575.34/1500)*(10000/(scale*100))*10).toString()+"Km";
}

function rgb(r, g, b){
    return "rgb("+Math.round(r)+","+Math.round(g)+","+Math.round(b)+")"
}

function recolorRegions(){
    const regions = document.querySelectorAll("path");
    for(region of regions){
        regionState = globalState.getRegion(region.getAttribute("name"));

        let redRate = (regionState.totalSize - regionState.susceptible) / regionState.totalSize;
        redRate = (Math.log(redRate + 0.01) - Math.log(0.01)) / (Math.log(1.01) - Math.log(0.01))

        region.setAttribute("fill", rgb(255 * redRate, 30, 30))
    }
}

function lightToDark(){
    if (eyepain == "none"){
        eyepain = "ungodly"
        let root = document.documentElement;
        root.style.setProperty('--background', " #CFD0D5");
        root.style.setProperty('--grey-text', "black");
        document.getElementById("body").style.backgroundColor = "#2f3336;"
        document.getElementById("body").style.animation = "fadeout2 1s ease forwards"
        document.getElementById("main").style.backgroundColor = "#cfd0d5";
        document.getElementById("lightVsDark").innerHTML = "Mode: Light";
        document.getElementById("lightVsDark").style.color = "black";
        document.getElementById("lightVsDark").style.backgroundColor = "white";
        document.getElementById("options1").style.backgroundColor = "white";
        document.getElementById("options1").style.color = "black";
        document.getElementById("statButton").style.backgroundColor = "#1b1d21";
        document.getElementById("statButton").style.color = "white";
        document.getElementById("nzmap").style.fill = "	#fdfdfd";
        
        document.getElementById("body").style.animation = "fadein2 1s ease forwards"

    }else{
        eyepain = "none"
        let root = document.documentElement;
        root.style.setProperty('--background', "#202020");
        root.style.setProperty('--grey-text', "grey");
        document.getElementById("body").style.backgroundColor = "rgb(58, 49, 49);"
        document.getElementById("body").style.animation = "fadeout3 1s ease forwards"
        document.getElementById("lightVsDark").innerHTML = "Mode: Dark";
        document.getElementById("lightVsDark").style.color = "grey";
        document.getElementById("lightVsDark").style.backgroundColor = "#202020";
        document.getElementById("options1").style.backgroundColor = "#282b2e";
        document.getElementById("title").style.color = "rgb(58, 179, 166)";
        document.getElementById("statButton").style.backgroundColor = "rgb(58, 49, 49)";
        document.getElementById("statButton").style.color = "orange";
        document.getElementById("main").style.backgroundColor = "#2f3336";
        document.getElementById("nzmap").style.fill = "#52585d";
        document.getElementById("body").style.animation = "fadein3 1s ease forwards"
        document.getElementById("parameters").style.color = "grey";

    }
}

var coolButtonState = "left"
function coolButtonPresed(){
    if (coolButtonState == "left"){
        coolButtonState = "right"
        document.getElementById("coolButtonIcon").style.animation = "leftToRight 1s ease forwards"
    }else{
        coolButtonState = "left"
        document.getElementById("coolButtonIcon").style.animation = "rightToLeft 1s ease forwards"
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
    element.on("click", () => {
        selectedRegion = name;
        showStatsOfRegion(selectedRegion)
    });
});

function timestep(){
    globalState.timestep()
    showStatsOfRegion(selectedRegion);
    recolorRegions();
}

function showStatsOfRegion(regionName){
    regionState = globalState.getRegion(regionName);

    regionNameElement.innerHTML = regionName
    regionPopulationElement.innerHTML = regionState.totalSize + " Inhabitants";

    const healthyPeople = regionState.susceptible + regionState.exposed;
    susceptibleLabelElement.innerHTML = healthyPeople + " Healthy People"
    susceptibleProgressElement.value = healthyPeople / regionState.totalSize * 100;

    undiscoveredLabelElement.innerHTML = regionState.symptomatic + " Unknown Cases"
    undiscoveredProgressElement.value = regionState.symptomatic / regionState.totalSize * 100

    deadLabelElement.innerHTML = regionState.dead + " Dead "
    deadProgressElement.value = regionState.dead / regionState.totalSize * 100;

    caseProgressElement.value = regionState.found / regionState.totalSize * 100
    caseLabelElement.innerHTML = regionState.found + " Cases Found"

    hospitalisedProgressElement.value = regionState.hospitalised / regionState.totalSize * 100;
    hospitalisedLabelElement.innerHTML = regionState.hospitalised + " Hospitalised"

    recLabelElement.innerHTML = regionState.immune + " Recovered"
    recProgressElement.value = regionState.immune / regionState.totalSize * 100;
}

var box_height = document.getElementById("progressbar").clientHeight
document.getElementById("box").style.height = box_height+"px";
var box_width = document.getElementById("susProgress").clientWidth
document.getElementById("box").style.width = box_width+3+"px";
console.log("box dimentions",box_width , box_height)

window.addEventListener('resize', function(event){
 var box_height = document.getElementById("progressbar").clientHeight
document.getElementById("box").style.height = box_height+"px";
var box_width = document.getElementById("susProgress").clientWidth
document.getElementById("box").style.width = box_width+3+"px";
console.log("box dimentions",box_width , box_height)
});