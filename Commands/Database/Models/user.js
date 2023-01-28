//create an exportable model for the user schema


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    guildID: { type: String, required: true },
    warns: { type: Number, required: true },
    xp: { type: Number, required: true },
    level: { type: Number, required: true },

});

export default mongoose.model('User', userSchema);
    

