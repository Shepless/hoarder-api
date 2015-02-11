'use strict';

var fs = require('fs-extra'),
    jsonFile = require('jsonfile'),
    CONFIGURATION_PATH = './.config/config.json',
    defaultConfiguration = {
        isHoarderConfigured: false,
        dataLocation: './.data',
        imagesDirectory: './.images',
        dataCompactInterval: (1000 * 60 * 60)
    },
    configuration = defaultConfiguration;

if (fs.existsSync(CONFIGURATION_PATH)) {
    configuration = jsonFile.readFileSync(CONFIGURATION_PATH);
} else {
    fs.createFileSync(CONFIGURATION_PATH);
    jsonFile.writeFile(CONFIGURATION_PATH, defaultConfiguration);
}

configuration.update = function () {
    jsonFile.writeFile(CONFIGURATION_PATH, configuration);
};

module.exports = configuration;