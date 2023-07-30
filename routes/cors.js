const cors = require('cors');
const whitelist = ['http://127.0.0.1:5501', 'http://localhost:3000'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    // if header contains origin then check if it contains the whitelist items
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }; // server return access control allow origin
    }
    else {
        corsOptions = { origin: false };// server do not return access control allow origin
    }
    callback(null, corsOptions);
};

exports.cors = cors(); // mostly used for get operations
exports.corsWithOptions = cors(corsOptionsDelegate); // mostly used for POST operations