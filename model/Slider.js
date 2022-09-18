const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    userid: String,
    name: String,
   
    
});

module.exports = mongoose.model("slidernames", sliderSchema);