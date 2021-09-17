var s3 = Snap("#resetButtonSvg")

var arrow = s3.text(0, 9.5, "↺");


function spin() {
    document.getElementById("resetButtonSvg").style.animation = "spin360 0.5s ease forwards";
}
