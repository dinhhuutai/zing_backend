const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ArtistSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter artist name'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'Please enter artist title'],
    },
    image: {
        type: String,
    },
    banner: {
        type: String,
    },
    information: {
        type: String,
    },
    createDate: {
        type: Date,
        default: Date.now,
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
    following: {
        items: [
            {
                ref: "users",
                type: mongoose.Schema.Types.ObjectId,
            }
        ]
    },
});


module.exports = mongoose.model('artists', ArtistSchema);