const SYMPTOM_LENGTH = 7
const ASYMPTOMATIC_PERIOD = 3
const BASE_TRAVEL_RATE = 0.02;

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

const travelFactor = 100;

const travel = {
    "Manawatu-Wanganui" : {
        "Auckland": 400,
        "Wellington": 300,
        "Canterbury": 200,
        "Taranaki": 100,
        "Waikato": 200,
        "Bay of Plenty": 100,
        "Hawke's Bay": 100
    },
    "Gisborne District" :{
        "Auckland": 200,
        "Wellington": 150,
        "Canterbury": 100,
        "Bay of Plenty": 50,
        "Hawke's Bay": 50
    },
    "Northland": {
        "Auckland": 500,
        "Wellington": 300,
        "Canterbury": 200
    },
    "Auckland": {
        "Manawatu-Wanganui": 400,
        "Gisborne District": 200,
        "Northland": 500,
        "Waikato": 600,
        "Bay of Plenty": 500,
        "Hawke's Bay": 200,
        "Taranaki": 200,
        "Wellington": 2000,
        "Tasman District": 100,
        "Nelson City": 100,
        "Marlborough District": 100,
        "West Coast": 80,
        "Canterbury": 1200,
        "Otago": 500,
        "Southland": 200
    },
    "Waikato": {
        "Auckland": 500,
        "Canterbury": 300,
        "Wellington": 400,
        "Taranaki": 200,
        "Manawatu-Wanganui": 200,
        "Hawke's Bay": 150,
        "Bay of Plenty": 150
    },
    "Bay of Plenty": {
        "Auckland": 500,
        "Canterbury": 200,
        "Wellington": 300,
        "Waikato": 200,
        "Manawatu-Wanganui": 100,
        "Gisborne District": 50,
        "Hawke's Bay": 100
    },
    "Hawke's Bay": {
        "Auckland": 200,
        "Canterbury": 50,
        "Wellington": 100,
        "Gisborne District": 50,
        "Waikato": 80,
        "Manawatu-Wanganui": 100,
        "Bay of Plenty": 100
    },
    "Taranaki": {
        "Auckland": 200,
        "Canterbury": 100,
        "Wellington": 150,
        "Waikato": 80,
        "Manawatu-Wanganui":  100
    },
    "Wellington": {
        "Manawatu-Wanganui": 300,
        "Gisborne District": 150,
        "Northland": 300,
        "Auckland": 2000,
        "Waikato": 400,
        "Bay of Plenty": 300,
        "Hawke's Bay": 100,
        "Taranaki": 100,
        "Tasman District": 50,
        "Nelson City": 70,
        "Marlborough District": 200,
        "West Coast": 40,
        "Canterbury": 1000,
        "Otago": 250,
        "Southland": 100
    },
    "Tasman District": {
        "Auckland": 100,
        "Canterbury": 30,
        "Wellington": 50,
        "Marlborough District": 50,
        "West Coast": 50,
        "Nelson City": 50
    },
    "Nelson City": {
        "Auckland": 100,
        "Canterbury": 30,
        "Wellington": 70,
        "Tasman District": 50,
        "Marlborough District": 60
    },
    "Marlborough District": {
        "Auckland": 100,
        "Wellington": 200,
        "Canterbury": 100,
        "Tasman District": 50,
        "Nelson City": 60
    },
    "West Coast": {
        "Auckland": 80,
        "Wellington": 40,
        "Canterbury": 40,
        "Tasman District":50,
        "Otago": 50,
        "Southland": 40
    },
    "Canterbury": {
        "Manawatu-Wanganui": 200,
        "Gisborne District": 100,
        "Northland": 200,
        "Auckland": 1200,
        "Waikato": 300,
        "Bay of Plenty": 200,
        "Hawke's Bay": 50,
        "Taranaki": 100,
        "Wellington": 1000,
        "Tasman District": 30,
        "Nelson City": 30,
        "Marlborough District": 100,
        "West Coast": 40,
        "Otago": 200,
        "Southland": 100
    },
    "Otago": {
        "Auckland": 500,
        "Wellington": 250,
        "Canterbury": 200,
        "Southland": 50,
        "West Coast": 40,
    },
    "Southland": {
        "Auckland": 200,
        "Wellington": 100,
        "Canterbury": 100,
        "Otago": 50,
        "West Coast": 40
    }
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
var travelRate = 1;

function randint(upper, lower){
    return Math.floor(Math.random() * (upper - lower) + lower);
}

function binomial(n, p){ //App roximated by a gaussian bell curve
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
    R *= (1 - 0.00815 * vaccination)

    if(document.getElementById("maskBox").checked){
        R *= 0.7
    }

    currentFindingRate = document.getElementById("testrange").value / 500;

    const vacRate = Math.max(0, vaccination / 100 - 0.01);

    currentR = R;
    currentHospitalisationRate = HR * (1 - vacRate * vacRate);
    currentDeathRate = DR * (1 - vacRate * vacRate * vacRate * vacRate);

    travelRate = document.getElementById("travelBox").checked ? 0.005 : 1;

    console.log("Basic Reproductive Index: " + R)
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

    getStateAsArray(){
        return [
            this.susceptible, this.exposed, this.symptomatic,
            this.found, this.hospitalised, this.dead, this.immune
        ];
    }

    setStateFromArray(arr){
        this.susceptible = arr[0];
        this.exposed = arr[1];
        this.symptomatic = arr[2];
        this.found = arr[3];
        this.hospitalised = arr[4];
        this.dead = arr[5];
        this.immune = arr[6];
    }

    isStable(){
        return (this.exposed + this.symptomatic + this.found + this.hospitalised) == 0;
    }

    timestep(){
        //Calculate changes
        const newExposed = binomial(this.susceptible, currentR / (SYMPTOM_LENGTH + 1) * this.symptomatic / this.totalSize);
        const newInfectuous = binomial(this.exposed, 1 / (ASYMPTOMATIC_PERIOD + 1))
        /*if(this.exposed > 0){
            console.log(this.name +": " + newExposed + " new infections")
        }*/
        let newFound = binomial(this.symptomatic, currentFindingRate)
        let newHospitalised = binomial(this.found, currentHospitalisationRate / (SYMPTOM_LENGTH + 1))
        let newHospitalisedFromUnfound = binomial(this.symptomatic, 3 * currentHospitalisationRate / (SYMPTOM_LENGTH + 1))

        let removalsFromHospitals = binomial(this.hospitalised, 2 / (SYMPTOM_LENGTH))
        if(removalsFromHospitals > this.hospitalised) removalsFromHospitals = this.hospitalised
        const deathsFromHospital = binomial(removalsFromHospitals, currentDeathRate / currentHospitalisationRate)
        const recoveriesFromHospital = removalsFromHospitals - deathsFromHospital

        let recoveriesFromFound = binomial(this.found, 1 / (SYMPTOM_LENGTH + 1))
        let recoveriesFromUnfound = binomial(this.symptomatic, 1 / (SYMPTOM_LENGTH + 1))

        if(newHospitalised + recoveriesFromFound  > this.found){
            let w1 = currentHospitalisationRate / (SYMPTOM_LENGTH + 1);
            let w2 = 1 / (SYMPTOM_LENGTH + 1);
            let total = w1 + w2;

            w1 /= total;

            newHospitalised = Math.floor(this.found * w1);
            recoveriesFromFound = this.found - newHospitalised;
        }

        if(newFound + recoveriesFromUnfound + newHospitalisedFromUnfound> this.symptomatic){
            let w1 = currentFindingRate;
            let w2 = 1 / (SYMPTOM_LENGTH + 1)
            let w3 = 3 * currentFindingRate / (SYMPTOM_LENGTH + 1);

            w1 /= (w1 + w2 + w3);
            w2 /= (w1 + w2 + w3)

            newFound = Math.floor(this.symptomatic * w1);
            recoveriesFromUnfound = Math.floor(this.symptomatic * w2);
            newHospitalisedFromUnfound = this.symptomatic - newFound - recoveriesFromUnfound;
        }

        if(newFound + recoveriesFromUnfound + newHospitalisedFromUnfound> this.symptomatic){
            console.log("There's beem an error")
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
        this.hospitalised += newHospitalised + newHospitalisedFromUnfound;

        this.found -= newHospitalised + recoveriesFromFound;
        this.found += newFound;

        this.symptomatic -= newFound + recoveriesFromUnfound + newHospitalisedFromUnfound;
        this.symptomatic += newInfectuous;

        this.exposed -= newInfectuous;
        this.exposed += newExposed;

        this.susceptible -= newExposed;
    }

    copy(){
        let clone = new RegionState(this.totalSize, this.name);

        clone.susceptible = this.susceptible;
        clone.exposed = this.exposed;
        clone.symptomatic = this.symptomatic;
        clone.found = this.found;
        clone.hospitalised = this.hospitalised;
        clone.dead = this.dead;
        clone.immune = this.immune;

        return clone;
    }
}

var data = []

function min(a, b){
    if(a < b) return a;
    return b;
}

const excludedFromTravel = [1, 1, 1, 0, 0, 0, 1];

class SimulationState{
    constructor(copyFrom){
        this.regions = {};
        this.totalPop = 0;
        if(copyFrom == undefined){
            for(const entry in populationsOfRegions){
                //console.log(entry);
                this.regions[entry] = new RegionState(populationsOfRegions[entry], entry)
            }
        }else{
            for(let entry in copyFrom.regions){
                this.regions[entry] = copyFrom.regions[entry].copy();
            }
        }

        for(let entry in Object.values(this.regions)){
            this.totalPop += entry.totalSize;
        }
        
        this.started = false;
    }

    infect(amount){
        choose(Object.entries(this.regions))[1].infect(amount);
    }

    timestep(){
        if(!this.started){
            this.infect(5);
            this.started = true;
        }

        Object.entries(this.regions).forEach(entry => {entry[1].timestep();});
        this.doTravel();

        data.push(this.copy());
    }

    doTravel(){
        let done = [];

        for(let entry of Object.entries(travel)){
            let travels = entry[1];
            let regionName = entry[0];
            let from = this.regions[regionName];
            for(let travelEntry of Object.entries(travels)){
                let to = this.regions[travelEntry[0]];

                let lookupKey = to.name < from.name ? from.name + "|" + to.name : to.name + "|" + from.name;
                //console.log(lookupKey);
                if(done.includes(lookupKey)) continue;

                let amount = travelEntry[1] * BASE_TRAVEL_RATE * travelRate;

                let stateOne = from.getStateAsArray();
                let stateTwo = to.getStateAsArray();

                let weightsOne = [];
                let weightsTwo = [];
                let moveFromOne = [];
                let moveFromTwo = [];

                let totalOne = 0;
                let totalTwo = 0;

                for(var i = 0; i < stateOne.length; i++){
                    totalOne += weightsOne[i] = Math.random() * stateOne[i] * excludedFromTravel[i];
                    totalTwo += weightsTwo[i] = Math.random() * stateTwo[i] * excludedFromTravel[i];
                }

                let totalFromOne = 0;
                let totalFromTwo = 0;

                for(var i = 0; i < stateOne.length; i++){
                    totalFromOne += moveFromOne[i] = min(randomRound(weightsOne[i] * amount / totalOne), stateOne[i]);
                    totalFromTwo += moveFromTwo[i] = min(randomRound(weightsTwo[i] * amount / totalTwo), stateTwo[i]);
                }

                amount = min(totalFromOne, totalFromTwo);

                let diffOne = amount - totalFromOne;
                if(diffOne != 0){
                    let sign = diffOne < 0 ? -1 : 1;
                    let I = 0;
                    while(diffOne != 0){
                        let index = randint(0, stateOne.length);
                        if(moveFromOne[index] != 0){
                            moveFromOne[index] += sign;

                            if(moveFromOne[index] > stateOne[index]){
                                moveFromOne[index] -= sign;
                                continue;
                            }

                            diffOne -= sign;
                        }
                        I++;
                        if(I > 10000){
                            console.log("This shouldn't happen");
                            return;
                        }
                    }
                }

                let diffTwo = amount - totalFromTwo;
                if(diffTwo != 0){
                    let sign = diffTwo < 0 ? -1 : 1;
                    while(diffTwo != 0){
                        let index = randint(0, stateTwo.length);
                        if(moveFromTwo[index] != 0){
                            moveFromTwo[index] += sign;
                            if(moveFromTwo[index] > stateTwo[index]){
                                moveFromTwo[index] -= sign;
                                continue;
                            }
                            diffTwo -= sign;
                        }
                    }
                }

                //console.log(moveFromOne);
                //console.log(moveFromTwo);

                for(var i = 0; i < stateOne.length; i++){
                    stateOne[i] += moveFromTwo[i];
                    stateOne[i] -= moveFromOne[i];

                    stateTwo[i] += moveFromOne[i];
                    stateTwo[i] -= moveFromTwo[i];
                }

                if(stateOne.filter(x => x < 0).length != 0){
                    console.log("Travel made a stat negative");
                }

                if(stateTwo.filter(x => x < 0).length != 0){
                    console.log("Travel made a stat negative");
                }

                from.setStateFromArray(stateOne);
                to.setStateFromArray(stateTwo);

                done.push(lookupKey);
            }
        }
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
            stats.found += region.found;
            stats.hospitalised += region.hospitalised;
        })

        return stats;
    }

    isStable(){
        let stable = true;
        Object.values(this.regions).forEach(region => {
            if(!region.isStable()) stable = false;
        })
        return stable;
    }

    copy(){
        return new SimulationState(this);
    }
}

var globalState;

function resetSimulation(){
    data = [];
    globalState = new SimulationState();
    data.push(globalState.copy());
    simCanRun = true;
}
function test(){
    Object.entries(globalState.regions).forEach((entry) => {
        entry[1].infect(5);
    })

    for(var i = 0; i < 200; i++){
        timestep();
    }
}