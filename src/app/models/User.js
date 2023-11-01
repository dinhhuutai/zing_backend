const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter user name'],
        trim: true,
        maxLength: [100, 'User name cannot exceed 100 characters']
    },
    username: {
        type: String,
        required: [true, 'Please enter user username'],
    },
    password: {
        type: String,
        required: [true, 'Please enter user password'],
    },
    avatar: {
        type: String,
        default: "https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.9.87/static/media/user-default.3ff115bb.png",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    playlistFavourite: [{
        ref: "playlists",
        type: mongoose.Schema.Types.ObjectId,
    }],
    albumFavourite: [{
        ref: "albums",
        type: mongoose.Schema.Types.ObjectId,
    }],
    artistFollow: [{
        ref: "artists",
        type: mongoose.Schema.Types.ObjectId,
    }],
    myPlaylist: [{
        ref: "playlists",
        type: mongoose.Schema.Types.ObjectId,
    }],
    songFavourite: [{
        ref: "songs",
        type: mongoose.Schema.Types.ObjectId,
    }],
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    refreshToken: {
        type: String,
    }
});


module.exports = mongoose.model('users', UserSchema);