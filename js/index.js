function $(id) {
    return document.getElementById(id);
}

function setDimension() {

    let w = parseInt($("widthSetter").value);
    let h = parseInt($("heightSetter").value);

    if (w.toString() === 'NaN' || h.toString() === 'NaN') {
        console.log("error:", w, h);
        return;
    }

    const wMultiplier = 6;
    const hMultiplier = 11;

    $("canvasArea").setAttribute("style", "width: " + w * wMultiplier + "px; height: " + h * hMultiplier + "px");
}

function generateImage(e) {

    if (e.files.length === 0) {
        console.log("No file selected.");
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => $("canvasArea").innerHTML = event.target.result;
    reader.onerror = (error) => reject(error);

    reader.readAsText(e.files[0]);
}