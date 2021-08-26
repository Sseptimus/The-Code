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
    "World":7895000000
}

class RegionState{
    constructor(populationSize){
        this.totalSize = populationSize;

        this.susceptible = populationSize;
        this.exposed = 0;
        this.synptomatic = 0;
        this.found = 0;
        this.dead = 0;
        this.immune = 0;
    }
}


