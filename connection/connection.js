const mongoose = require('mongoose');

function connect_DB(url){
    return mongoose.connect(url);
};

module.exports = connect_DB;