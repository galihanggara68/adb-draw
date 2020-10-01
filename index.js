const Promise = require("bluebird");
const adb = require("adbkit");
const {mouse, Point, screen, Button} = require("@nut-tree/nut-js");
var lastCoor = [0, 0];

var client = adb.createClient();

client.shell("172.19.181.174:5000", "getevent -l")
    .then(stream => stream.on("data", (chunk) => mappingChunk(chunk.toString())));

async function mappingChunk(data){
    await mouse.releaseButton(Button.LEFT);
    let corrX = data.match(/ABS_MT_POSITION_X\s+([a-f0-9]+)/);
    let corrY = data.match(/ABS_MT_POSITION_Y\s+([a-f0-9]+)/);
    let pressureData = data.match(/ABS_MT_PRESSURE\s+([a-f0-9]+)/);
    let x = corrX && corrX[1], y = corrY && corrY[1], pressure = pressureData && pressureData[1];
    lastCoor = [x ? x : lastCoor[0], y ? y : lastCoor[1]];
    //console.log(x, y, data);
    if(pressure){ 
        await mouse.pressButton(Button.LEFT);
    }else{
        await mouse.releaseButton(Button.LEFT);
    }
    await mouse.setPosition(new Point(parseInt(`0x${lastCoor[1]}`), 1070-parseInt(`0x${lastCoor[0]}`)));
}