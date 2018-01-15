const fs = require('fs');

exports.writeOne = stroke => fs.appendFile(__dirname + '/db.txt', stroke, err => err) && true
exports.getDb = () => new Promise(resolve => fs.readFile(__dirname + '/db.txt', 'utf8', (err, data) => resolve(data)))
