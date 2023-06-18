class Bounds { constructor(x, y, w, h) { this.x = x; this.y = y; this.width = w; this.height = h; } }

function getDimension() {

    let w = parseInt($("widthSetter").value);
    let h = parseInt($("heightSetter").value);

    return new Bounds(0, 0, w, h);
}

const $ = (id) => document.getElementById(id);

function setDimension() {

    const bounds = getDimension();
    let w = bounds.width;
    let h = bounds.height;

    if (w.toString() === 'NaN' || h.toString() === 'NaN') {
        console.log("error:", w, h);
        return;
    }

    const wMultiplier = 6.05;
    const hMultiplier = 11;
    
    $("canvasArea").setAttribute("style", `width: ${w * wMultiplier}px; height: ${h * hMultiplier}px`);
    $("imgCanvas").width = w;
    $("imgCanvas").height = h;
}

function getPixelData() {
    const bounds = getDimension();
    return $("imgCanvas").getContext("2d").getImageData(0, 0, bounds.width, bounds.height);
}

function convertToASCII(pixelData) {

    const pixels = pixelData.data;
    const shades = [ '@', '%', '#', '+', '*', ';', ':', '.', '`', ' ' ];
    let pixelShaded = "";

    for (let i = 0; i < pixels.length; i += 4) {

        let gray = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

        let shadeIndex = parseInt(gray / 255 * (shades.length - 1));
        pixelShaded += shades[shadeIndex];
        
        if ((i / 4 + 1) % pixelData.width === 0)
            pixelShaded += "\r\n";
    }

    return pixelShaded;
}

function copyASCII() {
    navigator.clipboard.writeText($("canvasArea").innerHTML)
    .then(alert("Text copied."))
    .catch((e) => alert(`Error: ${e}`));
}

function refresh(e) {
    e.value = null;
    setDimension();
}

function generateImage(e) {

    if (e.files.length === 0) {
        console.log("No file selected.");
        return;
    }

    const file = e.files[0];
    const reader = new FileReader();
    const bounds = getDimension();

    reader.onload = () => {
        
        let img = new Image();
        let url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(img.src);
            $("imgCanvas").getContext("2d", { willReadFrequently: true }).drawImage(img, 0, 0, bounds.width, bounds.height);
            $("canvasArea").innerHTML = convertToASCII(getPixelData());
        }

        img.src = url;
    }

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
}