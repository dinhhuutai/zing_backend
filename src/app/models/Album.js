const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AlbumSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter album name'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'Please enter album title'],
    },
    image: {
        type: String,
        required: [true, 'Please enter album image'],
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


module.exports = mongoose.model('albums', AlbumSchema);