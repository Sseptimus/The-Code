var s = Snap("#resetButtonSvg")

var arrow = s.text(0, 9.5, "↺");


function spin() {

    var bbox = arrow.getBBox();


    //arrow.stop().animate({ transform: "r360," + bbox.cx + ',' + bbox.cy }, 1000, mina.bounce);

    document.getElementById("resetButtonSvg").style.animation = "spin360 0.5s ease forwards";
}
