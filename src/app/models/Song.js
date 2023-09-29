const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SongSchema = new Schema({
    name: {type: String, required: true},
    createBy: {type: String},
    updateBy: {type: String},
    createAt: {type: Date},
    updateAt: {type: Date},
});


module.exports = mongoose.model('songs', SongSchema);