const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const HistorySchema = new Schema({
    playlistHistory: {
        ref: "playlists",
        type: mongoose.Schema.Types.ObjectId,
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('histories', HistorySchema);