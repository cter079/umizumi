//create a model that saves the log channel and welcome channel to the database


const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    guildID: { type: String, required: true, unique: true },
    logChannel: { type: String, required: false },
    welcomeChannel: { type: String, required: false },
    welcomeMessage: { type: String, required: false },
    leaveMessage: { type: String, required: false },
    levelUp: { type: String, required: false },
    leaveChannel: { type: String, required: false },
});

module.exports = mongoose.model('Server', serverSchema);
    
