const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PartnerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter partner name'],
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Please enter partner image'],
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


module.exports = mongoose.model('partners', PartnerSchema);