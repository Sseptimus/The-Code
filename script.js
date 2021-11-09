document.body.classList.add('js-loading');

window.addEventListener("load", showPage, false);

function showPage() {
    document.body.classList.remove('js-loading');
}

var simCanRun = false;

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
var dateElement;

var newCasesElement;
var newDeathsElement;
var newRecoveriesElement;

var simDate = new Date(Date.now());

function loaded() {
    resetSimulation();

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

    newCasesElement = document.getElementById("newCasesLabel")
    newDeathsElement = document.getElementById("newDeathsLabel")
    newRecoveriesElement = document.getElementById("newRecoveredLabel")

    dateElement = document.getElementById("date")
    dateElement.innerHTML = simDate.toLocaleDateString();

    showStatsOfRegion(selectedRegion);
    recalculateSimParams();

    recolorRegions()
    document.getElementById("loader").style.animation = "drop 1s ease forwards";

    if (getCookie("seen_disclaimer") == "True") {
        document.getElementById("disclaimer").style.display = "none"
        let wrapper = document.getElementsByClassName("wrapper")[0];

        wrapper.style.opacity = 1.0;
        wrapper.style["pointer-events"] = "auto";
    }
}

function switchToStats() {
    let stats = document.getElementById("statButton")

    if (state == 1) {
        state = 0
        stats.innerHTML = "Params"
        stats.style.color = "green"

        document.getElementById("stats").style.display = "block"
        document.getElementById("parameters").style.display = "none"
    } else {
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

function updatedist() {
    document.getElementById("distance").innerHTML = document.getElementById("distancerange").value + "%";
}

function updatevac() {
    document.getElementById("vac").innerHTML = document.getElementById("vacrange").value + "%";
    if (document.getElementById("vacrange").value > 1) {
        document.getElementById("popup").style.zIndex = "5";
    }
}

function updatetest() {
    document.getElementById("test").innerHTML = document.getElementById("testrange").value + "%";
}

function clicking(id) {
    d3.select(id).style("fill", "red");
}

function getTimestepInterval() {
    return 2000 / parseInt(document.getElementById("selectSpeed").value);
}

var runningSim = false
var timeoutMethod = 0;
function startStop() {
    if (runningSim) {
        runningSim = false;

        clearTimeout(timeoutMethod);
        animatePause();
    } else {
        if (!simCanRun) {
            console.error("Simulation cannot run");
            return;
        }

        runningSim = true
        timeoutMethod = setInterval(() => {
            timestep();
        }, getTimestepInterval())
        animatePlay();
    }
}

function updateSpeed() {
    if (runningSim) {
        clearTimeout(timeoutMethod);
        timeoutMethod = setInterval(() => {
            timestep();
        }, getTimestepInterval())
    }
}

function zooming(e) {
    d3.select("svg g").attr("transform", e.transform);
    var scale = e.transform["k"];
    var zoom = (Math.floor(scale * 100).toString()) + "%"
    document.getElementById("zoom").innerHTML = zoom;
    //524 30 - 330 572 = 1500km
    //574.34px = 1500km
    var kmToPx = (575.34 / 1500) * scale
    document.getElementById("px2km").innerHTML = Math.floor((575.34 / 1500) * (10000 / (scale * 100)) * 10).toString() + "Km";
}

function rgb(r, g, b) {
    return "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")"
}

function recolorRegions() {
    const regions = document.querySelectorAll("path");
    for (region of regions) {
        regionState = globalState.getRegion(region.getAttribute("name"));

        let redRate = (regionState.totalSize - regionState.susceptible) / regionState.totalSize;
        if (redRate < 0.01 && (regionState.totalSize - regionState.susceptible) != 0) {
            redRate = 0.01;
        }
        redRate = (Math.log(redRate + 0.01) - Math.log(0.01)) / (Math.log(1.01) - Math.log(0.01))

        region.setAttribute("fill", rgb(255 * redRate, 30, 30))
    }
}

function updateDate() {
    dateElement.innerHTML = simDate.toLocaleDateString();
}

var p

function lightToDark() {
    if (eyepain == "none") {
        eyepain = "ungodly"
        let root = document.documentElement;
        root.style.setProperty('--background', " #CFD0D5");
        root.style.setProperty('--grey-text', "black");
        root.style.setProperty('--title-outline', " 0px solid black");
        document.getElementById("body").style.backgroundColor = "#2f3336;"
        document.getElementById("body").style.animation = "fadeout2 1s ease forwards"
        document.getElementById("main").style.backgroundColor = "#cfd0d5";
        document.getElementById("lightVsDark").innerHTML = "Mode: Light";
        document.getElementById("lightVsDark").style.color = "black";
        document.getElementById("lightVsDark").style.backgroundColor = "white";
        document.getElementById("options1").style.backgroundColor = "white";
        document.getElementById("options1").style.color = "black";

        //document.getElementById("statButton").style.backgroundColor = "#1b1d21";
        let bigButtons = document.getElementsByClassName("bigButton")
        for (let item of bigButtons) {
            item.style.backgroundColor = "#1b1d21"
            item.style.color = "white";
        }
        document.getElementById("nzmap").style.fill = "	#fdfdfd";

        document.getElementById("body").style.animation = "fadein2 1s ease forwards"

    } else {
        eyepain = "none"
        let root = document.documentElement;
        root.style.setProperty('--background', "#202020");
        root.style.setProperty('--grey-text', "grey");
        root.style.setProperty('--title-outline', "2px solid black");
        document.getElementById("body").style.backgroundColor = "rgb(58, 49, 49);"
        document.getElementById("body").style.animation = "fadeout3 1s ease forwards"
        document.getElementById("lightVsDark").innerHTML = "Mode: Dark";
        document.getElementById("lightVsDark").style.color = "grey";
        document.getElementById("lightVsDark").style.backgroundColor = "#202020";
        document.getElementById("options1").style.backgroundColor = "#282b2e";
        document.getElementById("title").style.color = "rgb(58, 179, 166)";

        let bigButtons = document.getElementsByClassName("bigButton")
        for (let item of bigButtons) {
            item.style.backgroundColor = "rgb(58, 49, 49)";
            item.style.color = "orange";
        }

        document.getElementById("main").style.backgroundColor = "#2f3336";
        document.getElementById("nzmap").style.fill = "#52585d";
        document.getElementById("body").style.animation = "fadein3 1s ease forwards"
        document.getElementById("parameters").style.color = "grey";

    }
}


// variabales
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let zoom = d3.zoom()
    .scaleExtent([0.1, 5])
    .on("zoom", zooming);
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
            showStatsOfRegion(selectedRegion);
            if (state == 1) switchToStats();
        });
    });

function timestep() {
    globalState.timestep()
    showStatsOfRegion(selectedRegion);
    recolorRegions();

    simDate.setUTCSeconds(simDate.getUTCSeconds() + 86400); //Increment day
    updateDate();

    if (globalState.isStable()) {
        stopSim();
    }
}

function stopSim() {
    if (runningSim) {
        startStop()
    }

    simCanRun = false;
    clearTimeout(timeoutMethod);
    document.getElementById("sim-end").style.display = "block";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showStatsOfRegion(regionName) {
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

    let newCases = "NA", newDeaths = "NA", newRecoveries = "NA";

    if (data.length > 1) {
        const prevState = data[data.length - 2].getRegion(regionName);

        newCases = prevState.susceptible - regionState.susceptible;
        newDeaths = regionState.dead - prevState.dead;
        newRecoveries = regionState.immune - prevState.immune;
    }

    newCasesElement.innerHTML = "New Cases: " + newCases;
    newDeathsElement.innerHTML = "New Deaths: " + newDeaths;
    newRecoveriesElement.innerHTML = "New Recoveries: " + newRecoveries;
}

function hideDisclaimer() {
    document.getElementById("disclaimer").style.display = "none"
    let wrapper = document.getElementsByClassName("wrapper")[0];

    wrapper.style.opacity = 1.0;
    wrapper.style["pointer-events"] = "auto";

    const d = new Date();
    d.setTime(d.getTime() + 30 * 86400 * 1000);
    let cookie = "seen_disclaimer=True;expires=" + d.toUTCString();
    console.log(cookie);
    document.cookie = cookie;
}

function showDislaimer() {
    document.getElementById("disclaimer").style.display = "block";
    let wrapper = document.getElementsByClassName("wrapper")[0];

    wrapper.style.opacity = 0.5;
    wrapper.style["pointer-events"] = "none";
}

lightToDark()

var box_height = document.getElementById("progressbar").clientHeight
document.getElementById("box").style.height = box_height + "px";
var box_width = document.getElementById("susProgress").clientWidth
document.getElementById("box").style.width = box_width + 3 + "px";
console.log("box dimentions", box_width, box_height)

window.addEventListener('resize', function (event) {
    var box_height = document.getElementById("progressbar").clientHeight
    document.getElementById("box").style.height = box_height + "px";
    var box_width = document.getElementById("susProgress").clientWidth
    document.getElementById("box").style.width = box_width + 3 + "px";
    console.log("box dimentions", box_width, box_height)
});

var isKeyPressed = {
    t: false, // ASCII code for 'a'
    s: false // ASCII code for 'b'
    // ... Other keys to check for custom key combinations
};

var chart;
const maxItems = 300;
const wantedData = [
    ["Healthy", (region) => { return region.susceptible + region.exposed }, "darkBlue"],
    ["Unknown", (region) => { return region.symptomatic }, "red"],
    ["Found", (region) => { return region.found }, "orange"],
    ["Hospitalised", (region) => { return region.hospitalised }, "purple"],
    ["Dead", (region) => { return region.dead }, "#ddd"],
    ["Recovered", (region) => { return region.immune }, "green"]
]

const wantedDiffData = [
    ["New Cases", (prevState, newState) => { return prevState.susceptible - newState.susceptible }, "darkBlue"],
    ["New Deaths", (prevState, newState) => { return newState.dead - prevState.dead }, "gray"],
    ["New Recoveries", (prevState, newState) => { return newState.immune - prevState.immune }, "green"]
]

function createDiffGraphForRegion(regionName) {
    let datasets = [];
    const step = Math.floor(data.length / maxItems) + 1;

    for (let dataMetaData of wantedDiffData) {
        let dataList = [];

        for (var i = 0; i < data.length - 1; i += step) {
            const prevState = data[i].getRegion(regionName);
            const newState = data[i + 1].getRegion(regionName);

            dataList.push(dataMetaData[1](prevState, newState));
        }

        const dataset = {
            label: dataMetaData[0],
            data: dataList,
            borderColor: dataMetaData[2]
        }

        datasets.push(dataset);
    }

    createGraphOf(datasets, step);
}

function createGraphForRegion(regionName) {
    let datasets = []
    var step = Math.floor(data.length / maxItems) + 1;

    for (let dataMetaData of wantedData) {
        let dataList = [];

        var i = -1;
        for (let regionData of data) {
            i++;
            if (i % step != 0) continue;
            const region = regionData.getRegion(regionName);
            dataList.push(dataMetaData[1](region));
        }

        const dataset = {
            label: dataMetaData[0],
            data: dataList,
            fill: true,
            borderColor: dataMetaData[2],
            backgroundColor: dataMetaData[2]
        }

        datasets.push(dataset);
    }

    createGraphOf(datasets, step, true);
}

function createGraphOf(datasets, step, stacked = false) {
    if (chart != undefined) {
        chart.destroy();
    }

    let labels = [];
    var index = 0;
    for (var i = 0; i < data.length; i++) {
        if (i % step != 0) continue;
        labels.push("Day " + i);

        if(stacked){
            let total = 0;
            for (var j = datasets.length - 1; j >= 0; j--) {
                const value = datasets[j].data[index];
                datasets[j].data[index] += total;
                total += value;
            }
            index++;
        }
    }

    if(stacked){
        datasets.reverse();
    }

    let config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: false,
            interaction: {
                mode: 'index',
                acis: 'y'
            }
        }
    }

    if (stacked) {
        config.options = {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let value = context.parsed.y;
                        if (context.datasetIndex - 1 != -1) {
                            value -= datasets[context.datasetIndex - 1].data[context.dataIndex];
                        }
            
                        return context.dataset.label + ": " + value;
                    }
                }
            }
        }
    }

    document.getElementById("data-graph").style.display = 'block';

    chart = new Chart(
        document.getElementById("graph-canvas"),
        config
    );
}

const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
if (darkThemeMq.matches) {
    lightToDark();
}