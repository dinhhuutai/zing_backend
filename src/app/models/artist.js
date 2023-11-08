const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ArtistSchema = new Schema({
    encodeId: {
        type: String,
        require: [true, "encodeId artist no underfined"],
        unique: true,
    },
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
    },
    contentLastUpdate: {
        type: Date,
        default: Date.now,
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