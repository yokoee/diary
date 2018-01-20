const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/diary');
let Schema = mongoose.Schema;


let diaryScheme = new Schema({
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
    collection: 'diaries'
});

let Diary = mongoose.model('Diary', diaryScheme);

module.exports.Diary = Diary;