const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter playlist name'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'Please enter playlist title'],
    },
    image: {
        type: String,
        required: [true, 'Please enter playlist image'],
    },
    isBanner: {
        type: Boolean,
        default: false,
    },
    imageBanner: {
        type: String,
    },
    description: {
        type: String,
    },
    sortDescription: {
        type: String,
    },
    releaseDate: {
        type: Number,
    },
    releasedAt: {
        type: Number,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    createBy: {
        ref: "users",
        type: mongoose.Schema.Types.ObjectId,
    },
    genreId: [
        {
            ref: "genres",
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    onlyArtist: {
        type: Boolean,
    },
    contentLastUpdate: {
        type: Date,
        default: Date.now,
    },
    songs: [
        {
            ref: "songs",
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    like: [
        {
            ref: "users",
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    listening: {
        type: Number,
        default: 0,
    },
});


module.exports = mongoose.model('playlists', PlaylistSchema);