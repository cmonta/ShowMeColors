$(function() {
    
    $("canvas").click(function(e) {
        if(!this.canvas) {
            this.canvas = document.getElementById('canvas')
        }

        var colorList = fullColorList;

        var offX  = (e.offsetX || e.clientX - $(e.target).offset().left);
        var offY  = (e.offsetY || e.clientY - $(e.target).offset().top);

        var pixelData = this.canvas.getContext('2d').getImageData(offX, offY, 1, 1).data;
        var ctx = this.canvas.getContext('2d');

        var rgba = 'rgba(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ',' + pixelData[3] + ')';

        var xyz = rgb2xyz(pixelData);

        var color = document.getElementById('color');
        color.style.background = rgba;
        
        //var colName = tinycolor(rgba);
        
        $('#output').html('R: ' + pixelData[0] + '<br>G: ' + pixelData[1] + '<br>B: ' + pixelData[2]);
        
        var distanceToColor = [];

        /*for (i = 0; i < colorList.length; i++) {
        

            var distance = Math.sqrt( Math.pow((pixelData[0] - colorList[i].red), 2) +
                            Math.pow((pixelData[1] - colorList[i].green), 2) +
                            Math.pow((pixelData[2] - colorList[i].blue), 2));
            distanceToColor.push([distance, colorList[i].name])
        }*/

        for (i = 0; i < colorList.length; i++) {
            var colorListRgb = [colorList[i].red,
                                colorList[i].green,
                                colorList[i].blue];
            var colorListXyz =  rgb2xyz(colorListRgb);

            var distance = Math.sqrt(   Math.pow((xyz[0] - colorListXyz[0]), 2) +
                                        Math.pow((xyz[1] - colorListXyz[1]), 2) +
                                        Math.pow((xyz[2] - colorListXyz[2]), 2));
            distanceToColor.push([distance, colorList[i].name]);
        }
        
        distanceToColor.sort(sortFunction);

        for (i = 0; i < 3; i++) {
            $('#colorName' + i).html(   distanceToColor[i][1] + '<br>' +
                                        'Distance : ' + parseFloat(distanceToColor[i][0]).toFixed(3));
            $('#color' + i).css('background-color', distanceToColor[i][1]);
        }

        
    });
    
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function rgb2hcl(rgbArr) {
    var r1 = rgbArr[0] / 255;
    var g1 = rgbArr[1] / 255;
    var b1 = rgbArr[2] / 255;
 
    var maxColor = Math.max(r1,g1,b1);
    var minColor = Math.min(r1,g1,b1);

    var C = maxColor - minColor;
    var L = (maxColor + minColor) / 2;
    var H = 0;

    if(maxColor != minColor){
        //Calculate H:
        if(r1 == maxColor){
            H = (g1-b1) / (maxColor - minColor);
        }else if(g1 == maxColor){
            H = 2.0 + (b1 - r1) / (maxColor - minColor);
        }else{
            H = 4.0 + (r1 - g1) / (maxColor - minColor);
        }
    }

    H = H * 60;
    if(H<0){
        H += 360;
    }
    var result = [H, C, L];
    return result;
}

/*
* Converts an RGB color to HSL
* Parameters
*     rgbArr : 3-element array containing the RGB values
*
* Result : 3-element array containing the HSL values
*
*/
function rgb2hsl(rgbArr){
    var r1 = rgbArr[0] / 255;
    var g1 = rgbArr[1] / 255;
    var b1 = rgbArr[2] / 255;
 
    var maxColor = Math.max(r1,g1,b1);
    var minColor = Math.min(r1,g1,b1);
    //Calculate L:
    var L = (maxColor + minColor) / 2 ;
    var S = 0;
    var H = 0;
    if(maxColor != minColor){
        //Calculate S:
        if(L < 0.5){
            S = (maxColor - minColor) / (maxColor + minColor);
        }else{
            S = (maxColor - minColor) / (2.0 - maxColor - minColor);
        }
        //Calculate H:
        if(r1 == maxColor){
            H = (g1-b1) / (maxColor - minColor);
        }else if(g1 == maxColor){
            H = 2.0 + (b1 - r1) / (maxColor - minColor);
        }else{
            H = 4.0 + (r1 - g1) / (maxColor - minColor);
        }
    }
 
    L = L * 100;
    S = S * 100;
    H = H * 60;
    if(H<0){
        H += 360;
    }
    var result = [H, S, L];
    return result;
};

function normalizeHcl (hclArr) {
    var H = hclArr[0] / 180;
    var C = hclArr[1];
    var L =  hclArr[2] - 1;

    var result = [H, C, L];
    return result;
};

function convertXyz (normalizedHcl) {
    var H = normalizedHcl[0],
        C = normalizedHcl[1],
        L = normalizedHcl[2];

    x = C * Math.cos(H * Math.PI);
    y = C * Math.sin(H * Math.PI);
    z = L;
    var result = [x, y, z];
    return result;
};

function rgb2xyz (rgbArr) {
    var hcl = rgb2hcl(rgbArr);
    var normalizedHcl = normalizeHcl(hcl);
    var xyz = convertXyz(normalizedHcl);
    return xyz;
};


var fullColorList = [
{"name":"aliceblue", "red":240, "green":248, "blue":255},
{"name":"antiquewhite", "red":250, "green":235, "blue":215},
{"name":"aqua", "red":0, "green":255, "blue":255},
{"name":"aquamarine", "red":127, "green":255, "blue":212},
{"name":"azure", "red":240, "green":255, "blue":255},
{"name":"beige", "red":245, "green":245, "blue":220},
{"name":"bisque", "red":255, "green":228, "blue":196},
{"name":"black", "red":0, "green":0, "blue":0},
{"name":"blanchedalmond", "red":255, "green":235, "blue":205},
{"name":"blue", "red":0, "green":0, "blue":255},
{"name":"blueviolet", "red":138, "green":43, "blue":226},
{"name":"brown", "red":165, "green":42, "blue":42},
{"name":"burlywood", "red":222, "green":184, "blue":135},
{"name":"cadetblue", "red":95, "green":158, "blue":160},
{"name":"chartreuse", "red":127, "green":255, "blue":0},
{"name":"chocolate", "red":210, "green":105, "blue":30},
{"name":"coral", "red":255, "green":127, "blue":80},
{"name":"cornflowerblue", "red":100, "green":149, "blue":237},
{"name":"cornsilk", "red":255, "green":248, "blue":220},
{"name":"crimson", "red":220, "green":20, "blue":60},
{"name":"cyan", "red":0, "green":255, "blue":255},
{"name":"darkblue", "red":0, "green":0, "blue":139},
{"name":"darkcyan", "red":0, "green":139, "blue":139},
{"name":"darkgoldenrod", "red":184, "green":134, "blue":11},
//{"name":"darkgray", "red":169, "green":169, "blue":169},
{"name":"darkgreen", "red":0, "green":100, "blue":0},
{"name":"darkgrey", "red":169, "green":169, "blue":169},
{"name":"darkkhaki", "red":189, "green":183, "blue":107},
{"name":"darkmagenta", "red":139, "green":0, "blue":139},
{"name":"darkolivegreen", "red":85, "green":107, "blue":47},
{"name":"darkorange", "red":255, "green":140, "blue":0},
{"name":"darkorchid", "red":153, "green":50, "blue":204},
{"name":"darkred", "red":139, "green":0, "blue":0},
{"name":"darksalmon", "red":233, "green":150, "blue":122},
{"name":"darkseagreen", "red":143, "green":188, "blue":143},
{"name":"darkslateblue", "red":72, "green":61, "blue":139},
//{"name":"darkslategray", "red":47, "green":79, "blue":79},
{"name":"darkslategrey", "red":47, "green":79, "blue":79},
{"name":"darkturquoise", "red":0, "green":206, "blue":209},
{"name":"darkviolet", "red":148, "green":0, "blue":211},
{"name":"deeppink", "red":255, "green":20, "blue":147},
{"name":"deepskyblue", "red":0, "green":191, "blue":255},
//{"name":"dimgray", "red":105, "green":105, "blue":105},
{"name":"dimgrey", "red":105, "green":105, "blue":105},
{"name":"dodgerblue", "red":30, "green":144, "blue":255},
{"name":"firebrick", "red":178, "green":34, "blue":34},
{"name":"floralwhite", "red":255, "green":250, "blue":240},
{"name":"forestgreen", "red":34, "green":139, "blue":34},
{"name":"fuchsia", "red":255, "green":0, "blue":255},
{"name":"gainsboro", "red":220, "green":220, "blue":220},
{"name":"ghostwhite", "red":248, "green":248, "blue":255},
{"name":"gold", "red":255, "green":215, "blue":0},
{"name":"goldenrod", "red":218, "green":165, "blue":32},
//{"name":"gray", "red":128, "green":128, "blue":128},
{"name":"green", "red":0, "green":128, "blue":0},
{"name":"greenyellow", "red":173, "green":255, "blue":47},
{"name":"grey", "red":128, "green":128, "blue":128},
{"name":"honeydew", "red":240, "green":255, "blue":240},
{"name":"hotpink", "red":255, "green":105, "blue":180},
{"name":"indianred", "red":205, "green":92, "blue":92},
{"name":"indigo", "red":75, "green":0, "blue":130},
{"name":"ivory", "red":255, "green":255, "blue":240},
{"name":"khaki", "red":240, "green":230, "blue":140},
{"name":"lavender", "red":230, "green":230, "blue":250},
{"name":"lavenderblush", "red":255, "green":240, "blue":245},
{"name":"lawngreen", "red":124, "green":252, "blue":0},
{"name":"lemonchiffon", "red":255, "green":250, "blue":205},
{"name":"lightblue", "red":173, "green":216, "blue":230},
{"name":"lightcoral", "red":240, "green":128, "blue":128},
{"name":"lightcyan", "red":224, "green":255, "blue":255},
{"name":"lightgoldenrodyellow", "red":250, "green":250, "blue":210},
//{"name":"lightgray", "red":211, "green":211, "blue":211},
{"name":"lightgreen", "red":144, "green":238, "blue":144},
{"name":"lightgrey", "red":211, "green":211, "blue":211},
{"name":"lightpink", "red":255, "green":182, "blue":193},
{"name":"lightsalmon", "red":255, "green":160, "blue":122},
{"name":"lightseagreen", "red":32, "green":178, "blue":170},
{"name":"lightskyblue", "red":135, "green":206, "blue":250},
//{"name":"lightslategray", "red":119, "green":136, "blue":153},
{"name":"lightslategrey", "red":119, "green":136, "blue":153},
{"name":"lightsteelblue", "red":176, "green":196, "blue":222},
{"name":"lightyellow", "red":255, "green":255, "blue":224},
{"name":"lime", "red":0, "green":255, "blue":0},
{"name":"limegreen", "red":50, "green":205, "blue":50},
{"name":"linen", "red":250, "green":240, "blue":230},
{"name":"magenta", "red":255, "green":0, "blue":255},
{"name":"maroon", "red":128, "green":0, "blue":0},
{"name":"mediumaquamarine", "red":102, "green":205, "blue":170},
{"name":"mediumblue", "red":0, "green":0, "blue":205},
{"name":"mediumorchid", "red":186, "green":85, "blue":211},
{"name":"mediumpurple", "red":147, "green":112, "blue":219},
{"name":"mediumseagreen", "red":60, "green":179, "blue":113},
{"name":"mediumslateblue", "red":123, "green":104, "blue":238},
{"name":"mediumspringgreen", "red":0, "green":250, "blue":154},
{"name":"mediumturquoise", "red":72, "green":209, "blue":204},
{"name":"mediumvioletred", "red":199, "green":21, "blue":133},
{"name":"midnightblue", "red":25, "green":25, "blue":112},
{"name":"mintcream", "red":245, "green":255, "blue":250},
{"name":"mistyrose", "red":255, "green":228, "blue":225},
{"name":"moccasin", "red":255, "green":228, "blue":181},
{"name":"navajowhite", "red":255, "green":222, "blue":173},
{"name":"navy", "red":0, "green":0, "blue":128},
{"name":"oldlace", "red":253, "green":245, "blue":230},
{"name":"olive", "red":128, "green":128, "blue":0},
{"name":"olivedrab", "red":107, "green":142, "blue":35},
{"name":"orange", "red":255, "green":165, "blue":0},
{"name":"orangered", "red":255, "green":69, "blue":0},
{"name":"orchid", "red":218, "green":112, "blue":214},
{"name":"palegoldenrod", "red":238, "green":232, "blue":170},
{"name":"palegreen", "red":152, "green":251, "blue":152},
{"name":"paleturquoise", "red":175, "green":238, "blue":238},
{"name":"palevioletred", "red":219, "green":112, "blue":147},
{"name":"papayawhip", "red":255, "green":239, "blue":213},
{"name":"peachpuff", "red":255, "green":218, "blue":185},
{"name":"peru", "red":205, "green":133, "blue":63},
{"name":"pink", "red":255, "green":192, "blue":203},
{"name":"plum", "red":221, "green":160, "blue":221},
{"name":"powderblue", "red":176, "green":224, "blue":230},
{"name":"purple", "red":128, "green":0, "blue":128},
{"name":"red", "red":255, "green":0, "blue":0},
{"name":"rosybrown", "red":188, "green":143, "blue":143},
{"name":"royalblue", "red":65, "green":105, "blue":225},
{"name":"saddlebrown", "red":139, "green":69, "blue":19},
{"name":"salmon", "red":250, "green":128, "blue":114},
{"name":"sandybrown", "red":244, "green":164, "blue":96},
{"name":"seagreen", "red":46, "green":139, "blue":87},
{"name":"seashell", "red":255, "green":245, "blue":238},
{"name":"sienna", "red":160, "green":82, "blue":45},
{"name":"silver", "red":192, "green":192, "blue":192},
{"name":"skyblue", "red":135, "green":206, "blue":235},
{"name":"slateblue", "red":106, "green":90, "blue":205},
//{"name":"slategray", "red":112, "green":128, "blue":144},
{"name":"slategrey", "red":112, "green":128, "blue":144},
{"name":"snow", "red":255, "green":250, "blue":250},
{"name":"springgreen", "red":0, "green":255, "blue":127},
{"name":"steelblue", "red":70, "green":130, "blue":180},
{"name":"tan", "red":210, "green":180, "blue":140},
{"name":"teal", "red":0, "green":128, "blue":128},
{"name":"thistle", "red":216, "green":191, "blue":216},
{"name":"tomato", "red":255, "green":99, "blue":71},
{"name":"turquoise", "red":64, "green":224, "blue":208},
{"name":"violet", "red":238, "green":130, "blue":238},
{"name":"wheat", "red":245, "green":222, "blue":179},
{"name":"white", "red":255, "green":255, "blue":255},
{"name":"whitesmoke", "red":245, "green":245, "blue":245},
{"name":"yellow", "red":255, "green":255, "blue":0},
{"name":"yellowgreen", "red":154, "green":205, "blue":50}]

var smallColorList = [
{"name":"Black", "red":0, "green":0, "blue":0},
{"name":"White", "red":255, "green":255, "blue":255},
{"name":"Red", "red":255, "green":0, "blue":0},
{"name":"Lime", "red":0, "green":255, "blue":0},
{"name":"Blue", "red":0, "green":0, "blue":255},
{"name":"Yellow", "red":255, "green":255, "blue":0},
{"name":"Cyan / Aqua", "red":0, "green":255, "blue":255},
{"name":"Magenta / Fuchsia", "red":255, "green":0, "blue":255},
{"name":"Silver", "red":192, "green":192, "blue":192},
{"name":"Gray", "red":128, "green":128, "blue":128},
{"name":"Maroon", "red":128, "green":0, "blue":0},
{"name":"Olive", "red":128, "green":128, "blue":0},
{"name":"Green", "red":0, "green":128, "blue":0},
{"name":"Purple", "red":128, "green":0, "blue":128},
{"name":"Teal", "red":0, "green":128, "blue":128},
{"name":"Navy", "red":0, "green":0, "blue":128}]
});