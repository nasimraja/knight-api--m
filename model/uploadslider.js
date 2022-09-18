const mongoose = require('mongoose');

const uploadsliderSchema = new mongoose.Schema({
    userid: String,
    slidernameId: String,
    link: String,
    slideimg: String  
    
});

module.exports = mongoose.model("uploadsliders", uploadsliderSchema);