"use strict";

module.exports.Random = Random;
module.exports.GetTime = GetTime;
module.exports.ObjectToArray = ObjectToArray;
module.exports.getErrorResponse = getErrorResponse;
module.exports.delay = delay;

function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

function Random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function GetTime() {
    return Date.now();
}

function ObjectToArray(obj) {
    var ar = [];
    for (var key in obj) {
        ar.push(obj[key]);
    }
    return ar;
}

function getErrorResponse(errorCode,errorInfo) {
    return { type : "error", data : { errorCode : errorCode, errorInfo : errorInfo } };
}

