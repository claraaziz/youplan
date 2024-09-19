const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    title: {type: String, required: true},
    days: [{
        devotional: String,
        readings: [{
            book: Number,
            chapter: Number,
        }]
    }]
})

module.exports = mongoose.model('Plan', planSchema);