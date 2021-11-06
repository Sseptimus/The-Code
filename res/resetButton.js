function resetSim() {
    setTimeout(function () {
        if(confirm("Are you sure you want to reset the simulation?")) {
            window.location.href = "index.html";
        }
    }, 200);
}
