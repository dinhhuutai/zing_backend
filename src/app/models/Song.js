const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SongSchema = new Schema({
    encodeId: {
        type: String,
        require: [true, "encodeId Song no underfined"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please enter song name'],
        trim: true,
        maxLength: [100, 'Song name cannot exceed 100 characters']
    },
    title: {
        type: String,
        required: [true, 'Please enter song title'],
    },
    artists: [{
        ref: "artists",
        type: mongoose.Schema.Types.ObjectId,
    }],
    thumbnail: {
        type: String,
        required: [true, 'Please enter song thumbnail'],
    },
    linkMusic: {
        type: String,
        required: [true, 'Please enter song linkMusic'],
    },
    duration: {
        type: Number,
        required: [true, 'Please enter song duration'],
    },
    releaseDate: {
        type: Number,
        required: [true, 'Please enter song releaseDate'],
    },
    genreId: [{
        ref: "genres",
        type: mongoose.Schema.Types.ObjectId,
    }],
    album: {ref: "albums", type: mongoose.Schema.Types.ObjectId},
    like: [{
        ref: "users",
        type: mongoose.Schema.Types.ObjectId,
    }],
    listen: [
        {
            time: {type: Number},
            hour: {type: String},
            counter: {type: Number},
        }
    ],
    listenOneDayLast: {type: Number},
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('songs', SongSchema);