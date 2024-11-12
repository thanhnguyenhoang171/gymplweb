const path = require('path');
const express = require('express');
const configViewEngine = (app) => {
    // config static file
    app.use(express.static(path.join('./../../src', 'assets')));
}
module.exports = configViewEngine;