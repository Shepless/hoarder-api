'use strict';

var path = require('path'),
    fs = require('fs-extra'),
    util = require('util'),
    request = require('request-promise'),
    htmlparser = require('htmlparser2'),
    select = require('soupselect').select,
    Promise = require('bluebird');

function createCookieJar() {
    var jar = request.jar(),
        userCookie = request.cookie("uid=42080"),
        passCookie = request.cookie("pass=38fbbb69f9a6be9df7db33a2b7da1eda");

    jar.setCookie(userCookie, 'https://hd-torrents.org/');
    jar.setCookie(passCookie, 'https://hd-torrents.org/');

    return jar;
}

function search(episode) {
    return request({
        uri: util.format('https://hd-torrents.org/torrents.php?search=%s&active=1&options=0&category%5B%5D=30&category%5B%5D=38', episode.getSearchTerm()),
        method: 'GET',
        jar: createCookieJar(),
        strictSSL: false
    });
}

function parseSearchResults(html) {
    return new Promise(function (resolve, reject) {
        var handler = new htmlparser.DomHandler(function (error, dom) {
            if (error) {
                reject(error);
            } else {
                select(dom, 'table[class="mainblockcontenttt"] tr').forEach(function (node) {
                    var downloadLink = select(node, 'td[title="Download"] a');

                    if (downloadLink.length > 0) {
                        resolve(downloadLink[0].attribs.href);
                    }
                });
            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.write(html);
        parser.done();
    });
}

function downloadTorrentFile(torrentFileUrl, episode) {
    var filePath = path.join('./.torrents/show/', episode.primaryKey + '.torrent');

    fs.createFileSync(filePath);

    //logger.info('Downloading torrent file %s', name);

    return request({
        uri: util.format('https://hd-torrents.org/%s', torrentFileUrl),
        jar: createCookieJar(),
        strictSSL: false
    }).pipe(fs.createWriteStream(filePath)).on('close', function (error) {
        if (error) {
            return console.log(error);
        }

        return console.log('SUCCESS!!!!! WHOOPPPP!!');
    });
}

module.exports = {
    type: 'hd-torrents.org',
    searchForEpisode: function (episode) {
        search(episode)
            .then(parseSearchResults)
            .then(function (torrentFileUrl) {
                return downloadTorrentFile(torrentFileUrl, episode);
            });
    }
};