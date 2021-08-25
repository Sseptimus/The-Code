var g = Snap("#graph")

console.log("drawing graph")
var linetop = g.line([0,0, 100,0])
linetop.attr("stroke-width","0.1")
linetop.attr("stroke","black")
var lineleft = g.line([0,0, 0,100])
lineleft.attr("stroke-width","0.1")
lineleft.attr("stroke","black")
var linebottom = g.line([100,0, 100,100])
linebottom.attr("stroke-width","0.1")
linebottom.attr("stroke","black")
var lineright = g.line([100,0, 100,100])
lineright.attr("stroke-width","0.1")
lineright.attr("stroke","black")

var times = 10;
for(var i=0; i < times; i++){
    var line = g.line([0,i*10, 100, i*100])
    line.attr("stroke-width","0.1")
    line.attr("stroke","grey")
}