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
        required: [true, 'Please enter playlist imageBanner'],
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
    genreId: [
        {
            ref: "genres",
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    artist: [
        {
            ref: "artists",
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
    song: {
        items: [
            {
                ref: "songs",
                type: mongoose.Schema.Types.ObjectId,
            }
        ],
        totalDuration: {
            type: Number,
            default: 0,
        }
    },
    like: {
        items: [
            {
                ref: "users",
                type: mongoose.Schema.Types.ObjectId,
            }
        ]
    },
    listening: {
        type: Number,
        default: 0,
    },
});


module.exports = mongoose.model('playlists', PlaylistSchema);