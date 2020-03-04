/**

 *Created by ruben.quadros on 17/02/20

 **/

const Gpio = require('onoff').Gpio;

exports.initializePins = function(pumpData) {
    for(let pumps in pumpData) {
        // noinspection JSUnfilteredForInLoop
        let eachPump = pumpData[pumps];
        new Gpio(eachPump['pin'], 'out')
    }
};

exports.pourDrink = function (pins, quantity, pumpData) {
    let FLOW_RATE = 3000;
    let allPins = getAllPins(pumpData);
    for(let i=0;i<allPins.length;i++) {
        for(let j=0;j<pins.length;j++) {
            if(allPins[i] === pins[j]) {
                FLOW_RATE = FLOW_RATE/quantity[j];
                console.log("FLOW " + FLOW_RATE);
                allPins[i].writeSync(1);
                sleep(FLOW_RATE);
                allPins[i].writeSync(0);
            }
        }
    }
};

function getAllPins(pumpData) {
    let pins = [];
    for(let pumps in pumpData) {
        // noinspection JSUnfilteredForInLoop
        let eachPump = pumpData[pumps];
        pins.push(eachPump['pin']);
    }
    return pins;
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
