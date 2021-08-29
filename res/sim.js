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
    "Southland" : 102600
}

const strains = {
    "original" : {"R" : 2.5, "hospitalisation" : 0.0243, "death" : 0.0066},
    "alpha" : {"R" : 3.225, "hospitalisation" : 0.03, "death" : 0.01},
    "gamma" : {"R" : 3.125, "hospitalisation" : 0.0347, "death" : 0.0099},
    "delta" : {"R" : 4.925, "hospitalisation" : 0.06845, "death" : 0.015642}
}

function randint(upper, lower){
    return Math.floor(Math.random() * (upper - lower) + lower);
}

function binomial(n, p){ //Aproxximated by a gaussian bell curve
    mu = n*p
    sigma = Math.sqrt(n*p*(1-p))
    var u =0, v = 0;
    while (u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.max(0, Math.round(Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * sigma + mu));
}

function choose(list){
    return list[randint(0, list.length)];
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
        console.log("Called timestep! (", this.name, ")")

        const currentR = 2.5; //Will be calculated from parameters
        const currentDeathRate = 0.0066;
        const currentHospitalisationRate = 0.0243;
        const currentFindingRate = 0.01;

        //Calculate changes
        const newExposed = binomial(this.symptomatic, currentR / (SYMPTOM_LENGTH + 1) * this.symptomatic / this.totalSize);
        const newInfectuous = binomial(this.exposed, 1 / (ASYMPTOMATIC_PERIOD + 1))
        const newFound = binomial(this.symptomatic, currentFindingRate)
        const newHospitalised = binomial(this.found, currentHospitalisationRate / (SYMPTOM_LENGTH + 1))

        const removalsFromHospitals = binomial(this.hospitalised, 1 / (SYMPTOM_LENGTH + 1))
        const deathsFromHospital = binomial(removalsFromHospitals, currentDeathRate / currentHospitalisationRate)
        const recoveriesFromHospital = removalsFromHospitals - deathsFromHospital

        const recoveriesFromFound = binomial(this.found, 1 / (SYMPTOM_LENGTH + 1))
        const recoveriesFromUnfound = binomial(this.symptomatic, 1 / (SYMPTOM_LENGTH + 1))

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
}