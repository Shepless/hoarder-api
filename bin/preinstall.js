var fs = require('fs'),
    resolve = require('path').resolve,
    join = require('path').join,
    cp = require('child_process'),
    lib = resolve(__dirname, '../lib/');

fs.readdirSync(lib).forEach(function (mod) {
    var modPath = join(lib, mod);

    if (!fs.existsSync(join(modPath, 'package.json'))) {
        return;
    }

    cp.spawn('npm', ['i'], {
        env: process.env,
        cwd: modPath,
        stdio: 'inherit'
    });
});