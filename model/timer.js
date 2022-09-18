const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
    key: String,
    value: Number,
   
    
});

module.exports = mongoose.model("timers", timerSchema);