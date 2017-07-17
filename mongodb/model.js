const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/journal');
let Schema = mongoose.Schema;


let journalScheme = new Schema({
    id: Number,
    date: {
        year: Number,
        mon: Number,
        day: Number,
        hour: Number,
        min: Number,
        sec: Number,
    },
    update: {
        year: Number,
        mon: Number,
        day: Number,
        hour: Number,
        min: Number,
        sec: Number,
    },
    text: String,
}, {
    collection: 'journals'
});

let Journal = mongoose.model('Journal', journalScheme);

module.exports.Journal = Journal;