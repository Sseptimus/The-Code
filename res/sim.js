const SYMPTOM_LENGTH = 7
const ASYMPTOMATIC_PERIOD = 3

const populationsOfRegions = {
    "Manawatu-Wanganui" : 250400,
    "Gisborne District" : 49300,
    "Northland" : 194600,
    "Auckland" : 1717500,
    "Waikato" : 496700,
    "Bay of Plenty" : 337300,
    "Hawke's Bay" : 178600,
    "Taranaki" : 124600,
    "Wellington" : 542000,
    "Tasman District" : 56400,
    "Nelson City" : 54600,
    "Marlborough District" : 50200,
    "West Coast" : 32400,
    "Canterbury" : 645900,
    "Otago" : 245300,
    "Southland" : 102600,
    //"World":7895000000
}

const strains = {
    "original" : {"R" : 2.5, "hospitalisation" : 0.0243, "death" : 0.0066},
    "alpha" : {"R" : 3.225, "hospitalisation" : 0.03, "death" : 0.01},
    "beta" : {"R" : 3.125, "hospitalisation" : 0.03, "death" : 0.01},
    "gamma" : {"R" : 3.125, "hospitalisation" : 0.0347, "death" : 0.0099},
    "delta" : {"R" : 4.925, "hospitalisation" : 0.06845, "death" : 0.015642}
}

var currentR = 2.5; //Will be calculated from parameters
var currentDeathRate = 0.0066;
var currentHospitalisationRate = 0.0243;
var currentFindingRate = 0.01;

function randint(upper, lower){
    return Math.floor(Math.random() * (upper - lower) + lower);
}

function binomial(n, p){ //Aproxximated by a gaussian bell curve
    mu = n*p
    sigma = Math.sqrt(n*p*(1-p))
    var u =0, v = 0;
    while (u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    let value = Math.max(0, randomRound(Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * sigma + mu));
    if(isNaN(value)){
        console.log("Binomial returned NaN N = " + n + " P = " + p)
    }

    if(value == undefined){
        console.log("Binomial returned Undefined N = " + n + " P = " + p)
    }
    return Math.min(n, value);
}

//0.25 has a 1/4 chance of becoming 1 and a 3/4 chance of becoming 0
function randomRound(n){
    if(Math.random() < (n % 1)){
        return Math.ceil(n)
    }else{
        return Math.floor(n)
    }
}

function choose(list){
    return list[randint(0, list.length)];
}

function recalculateSimParams(){
    const rbs = document.querySelectorAll('input[name="radiostrain"]')
    let selected
    for(const rb of rbs){
        if(rb.checked){
            selected = rb;
            break;
        }
    }
    const strain = strains[selected.id];
    let R = strain.R
    let HR = strain.hospitalisation
    let DR = strain.death

    let distancing = document.getElementById("distancerange").value;
    R *= (1 - 0.006 * distancing)

    let vaccination = document.getElementById("vacrange").value;
    R *= (1 - 0.006 * vaccination)

    if(document.getElementById("maskBox").checked){
        R *= 0.7
    }

    currentR = R;
    currentHospitalisationRate = HR;
    currentDeathRate = DR;
}

class RegionState{
    constructor(populationSize, name){
        this.totalSize = populationSize;

        this.susceptible = populationSize;
        this.exposed = 0;
        this.symptomatic = 0;
        this.found = 0;
        this.hospitalised = 0;
        this.dead = 0;
        this.immune = 0;

        this.name = name;
    }

    infect(amount){
        amount = Math.min(amount, this.susceptible);
        this.exposed += amount;
        this.susceptible -= amount;
    }

    timestep(){
        //Calculate changes
        const newExposed = binomial(this.susceptible, currentR / (SYMPTOM_LENGTH + 1) * this.symptomatic / this.totalSize);
        const newInfectuous = binomial(this.exposed, 1 / (ASYMPTOMATIC_PERIOD + 1))
        if(this.exposed > 0){
            console.log(this.name +": " + newExposed + " new infections")
        }
        let newFound = binomial(this.symptomatic, currentFindingRate)
        let newHospitalised = binomial(this.found, currentHospitalisationRate / (SYMPTOM_LENGTH + 1))

        let removalsFromHospitals = binomial(this.hospitalised, 2 / (SYMPTOM_LENGTH))
        if(removalsFromHospitals > this.hospitalised) removalsFromHospitals = this.hospitalised
        const deathsFromHospital = binomial(removalsFromHospitals, currentDeathRate / currentHospitalisationRate)
        const recoveriesFromHospital = removalsFromHospitals - deathsFromHospital

        let recoveriesFromFound = binomial(this.found, 1 / (SYMPTOM_LENGTH + 1))
        let recoveriesFromUnfound = binomial(this.symptomatic, 1 / (SYMPTOM_LENGTH + 1))

        if(newHospitalised + recoveriesFromFound > this.found){
            let w1 = currentHospitalisationRate / (SYMPTOM_LENGTH + 1);
            let w2 = 1 / (SYMPTOM_LENGTH + 1);
            let total = w1 + w2;

            w1 /= total;

            newHospitalised = Math.floor(this.found * w1);
            recoveriesFromFound = this.found - newHospitalised;
        }

        if(newFound + recoveriesFromUnfound > this.symptomatic){
            let w1 = currentFindingRate;
            let w2 = 1 / (SYMPTOM_LENGTH + 1)

            w1 /= (w1 + w2);

            newFound = Math.floor(this.symptomatic * w1);
            recoveriesFromUnfound = this.symptomatic - newFound;
        }

        if(isNaN(newExposed)) console.log("New Exposed is NaN")
        if(isNaN(newInfectuous)) console.log("New Infectuous is NaN")
        if(isNaN(newFound)) console.log("New Found is NaN")
        if(isNaN(newHospitalised)) console.log("New Hospitalised is NaN")
        if(isNaN(deathsFromHospital)) console.log("Deaths from hospitalised is NaN")
        if(isNaN(recoveriesFromHospital)) console.log("Recoveries from hospitalised is NaN")
        if(isNaN(recoveriesFromUnfound)) console.log("Recoveries from unfound is NaN")
        if(isNaN(recoveriesFromFound)) console.log("Recoveries from found is NaN")

        if(isNaN(newExposed) || isNaN(newInfectuous) || isNaN(newFound) || isNaN(newHospitalised) || isNaN(deathsFromHospital) || isNaN(recoveriesFromHospital) || isNaN(recoveriesFromUnfound) || isNaN(recoveriesFromFound)){
            return; //Skip updates
        }

        //Apply changes
        this.immune += recoveriesFromUnfound + recoveriesFromFound + recoveriesFromHospital;
        this.dead += deathsFromHospital;

        this.hospitalised -= removalsFromHospitals;
        this.hospitalised += newHospitalised;

        this.found -= newHospitalised + recoveriesFromFound;
        this.found += newFound;

        this.symptomatic -= newFound + recoveriesFromUnfound;
        this.symptomatic += newInfectuous;

        this.exposed -= newInfectuous;
        this.exposed += newExposed;

        this.susceptible -= newExposed;
    }
}

class SimulationState{
    constructor(){
        this.regions = {};
        for(const entry in populationsOfRegions){
            console.log(entry);
            this.regions[entry] = new RegionState(populationsOfRegions[entry], entry)
        }
    }

    infect(amount){
        choose(Object.entries(this.regions))[1].infect(amount);
    }

    timestep(){
        Object.entries(this.regions).forEach(entry => {entry[1].timestep();});
    }

    getRegion(name){
        if(name == "New Zealand"){
            return this.totalStats();
        }
        return this.regions[name]
    }

    totalStats(){
        let stats = {
            name : "New Zealand",
            totalSize : 0,
            susceptible : 0,
            immune : 0,
            exposed : 0,
            symptomatic : 0,
            dead : 0,
            found : 0,
            hospitalised : 0,
        }
        Object.entries(this.regions).forEach(entry => {
            let region = entry[1];
            stats.totalSize += region.totalSize;
            stats.susceptible += region.susceptible;
            stats.immune += region.immune;
            stats.exposed += region.exposed;
            stats.symptomatic += region.symptomatic;
            stats.dead += region.dead;
            stats.found += stats.found;
            stats.hospitalised += region.hospitalised;
        })

        return stats;
    }
}

var globalState = new SimulationState();

function test(){
    Object.entries(globalState.regions).forEach((entry) => {
        entry[1].infect(5);
    })

    for(var i = 0; i < 200; i++){
        timestep();
    }
}