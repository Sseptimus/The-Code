function resetSim() {
    setTimeout(function () {
        if(confirm("Are you sure you want to reset the simulation?")) {
            resetSimulation();
            selectedRegion = "New Zealand"
            showStatsOfRegion(selectedRegion);
            recolorRegions()
            document.getElementById("sim-end").style.display = "none";
            simDate = new Date(Date.now())
            updateDate()
        }
    }, 200);
}
