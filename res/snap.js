var s = Snap("#svgStartIcon")
var triangle1 = s.polygon([1,1, 1,9, 7,5])
var square1 = [1,1, 1,9, 2,9]
var trianglePTS = [1,1, 1,9, 7,5]
triangle1.attr("fill", "black");
var triangle2 = s.polygon([1,1, 1,9, 7,5])
var square2 = [1,1, 2,9, 2,1]
triangle2.attr("fill", "black");
var triangle3 = s.polygon([1,1, 1,9, 7,5])
var square3 = [6,1, 6,9, 7,9]
triangle3.attr("fill", "black");
var triangle4 = s.polygon([1,1, 1,9, 7,5])
var square4 = [6,1, 7,9, 7,1]
triangle4.attr("fill", "black");



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

/* 

<polygon id="triangle1" points="1,1 1,9 7,5" style="fill:black;stroke:black;stroke-width:.1" />
<polygon id="triangle2" points="1,1 1,9 7,5" style="fill:black;stroke:black;stroke-width:.1" />
<polygon id="triangle3" points="1,1 1,9 7,5" style="fill:black;stroke:black;stroke-width:.1" />
<polygon id="triangle4" points="1,1 1,9 7,5" style="fill:black;stroke:black;stroke-width:.1" />

*/