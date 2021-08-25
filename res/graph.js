var g = Snap("#graph")

var triangle4 = s.polygon([1,1, 1,9, 7,5])
var square4 = [6,1, 7,9, 7,1]
triangle4.attr("fill", "transparent");
triangle4.attr("stroke-width","0.5")
triangle4.attr("stroke","black")

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