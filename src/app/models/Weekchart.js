const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WeekchartSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter weekchart name'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'Please enter weekchart title'],
    },
    image: {
        type: String,
        required: [true, 'Please enter weekchart image'],
    },
    genre: {
        type: String,
    },
    description: {
        type: String,
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


module.exports = mongoose.model('weekcharts', WeekchartSchema);