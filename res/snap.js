var s = Snap("#svgStartIcon")
var triangle1 = s.polygon([1,1, 1,9, 7,5])
var square1 = [0,1, 0,9, 1,9]
var trianglePTS = [1,1, 1,9, 7,5]
triangle1.attr("stroke-width","0.5")
triangle1.attr("stroke","black")
triangle1.attr("fill", "transparent");
var triangle2 = s.polygon([1,1, 1,9, 7,5])
var square2 = [0,1, 1,9, 1,1]
triangle2.attr("stroke-width","0.5")
triangle2.attr("stroke","black")
triangle2.attr("fill", "transparent");
var triangle3 = s.polygon([1,1, 1,9, 7,5])
var square3 = [6,1, 6,9, 7,9]
triangle3.attr("stroke-width","0.5")
triangle3.attr("stroke","black")
triangle3.attr("fill", "transparent");
var triangle4 = s.polygon([1,1, 1,9, 7,5])
var square4 = [6,1, 7,9, 7,1]
triangle4.attr("fill", "transparent");
triangle4.attr("stroke-width","0.5")
triangle4.attr("stroke","black")



function animatePlay() {
    triangle1.animate({"points":square1},100,mina.linear);
    triangle2.animate({"points":square2},100,mina.linear);
    triangle3.animate({"points":square3},100,mina.linear);
    triangle4.animate({"points":square4},100,mina.linear);
}

function animatePause(){
    triangle1.animate({"points":trianglePTS},100,mina.linear);
    triangle2.animate({"points":trianglePTS},100,mina.linear);
    triangle3.animate({"points":trianglePTS},100,mina.linear);
    triangle4.animate({"points":trianglePTS},100,mina.linear);

}

