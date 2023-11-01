const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GenreSchema = new Schema({
    encodeId: {
        type: String,
        require: [true, "encodeId genre no underfined"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please enter genre name'],
        trim: true,
        maxLength: [100, 'Genre name cannot exceed 100 characters']
    },
    title: {
        type: String,
        required: [true, 'Please enter genre title'],
    },
    alias: {
        type: String,
        required: [true, 'Please enter genre alias'],
    },
    cover: {
        type: String,
    },
    description: {
        type: String,
        required: [true, 'Please enter genre description'],
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


module.exports = mongoose.model('genres', GenreSchema);