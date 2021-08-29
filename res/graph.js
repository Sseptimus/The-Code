console.log("drawing graph")

var g = Snap("#graph")

var times = 10;
for(var i=0; i < times; i++){
    var line = g.line([0,i*10, 100, i*100])
    line.attr("stroke-width","0.1")
    line.attr("stroke","grey")
}

var times = 10;
for(var i=0; i < times; i++){
    var line = g.line([i*10,0, i*10,100])
    line.attr("stroke-width","0.1")
    line.attr("stroke","grey")
}