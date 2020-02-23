/**

 *Created by ruben.quadros on 17/02/20

 **/

'use strict';

const bartender = require('./bartender');
const fs = require('fs');
// noinspection NpmUsedModulesInstalled
const express = require('express');
const app = express();
app.use(express.json());

let drinksData;
let pumpData;

createServer();
readPumpConfig();

function createServer() {
    app.post('/make_drink', (req,res) => {
        const drinkName = req.body.name;
        const reply = searchDrink(drinkName);
        res.send(reply);
    });

    app.listen(3000, '0.0.0.0', () => {
       console.log("Server started");
    });
}

function readPumpConfig() {
    pumpData = JSON.parse(fs.readFileSync('pump_config.json', 'utf-8'));
    bartender.initializePins(pumpData);
}

function searchDrink(drink) {
    let reply = "";
    drinksData = JSON.parse(fs.readFileSync('drinks.json', 'utf-8'));
    const allDrinks = drinksData['drinks'];
    for(let i=0;i<allDrinks.length;i++) {
        if(drink === allDrinks[i]['name']) {
            let pins = getPins(allDrinks[i]['ingredients']);
            let quantities = getQuantity(allDrinks[i]['ingredients']);
            bartender.pourDrink(pins, quantities, pumpData);
            reply = allDrinks[i]['name'];
        }
    }
    if(reply === "") {
        reply = "No drinks found";
    }
    return reply;
}

function getPins(ingredients) {
    let pins = [];
    for(let ingredient in ingredients) {
        for(let pumps in pumpData) {
            // noinspection JSUnfilteredForInLoop
            let eachPump = pumpData[pumps];
            if(eachPump['value'] === ingredient) {
                pins.push(eachPump['pin'])
            }
        }
    }
    return pins;
}

function getQuantity(ingredients) {
    let quantities = [];
    for(let ingredient in ingredients) {
        // noinspection JSUnfilteredForInLoop
        quantities.push(ingredients[ingredient]);
    }
    return quantities;
}
