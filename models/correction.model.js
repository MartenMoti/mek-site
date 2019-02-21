const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CorrectionSchema = new Schema({
    description: {type: String, required: true, max: 100},
    amount: {type: Number, required: true},
    corrector_id: {type: String, required: true},
    corrected_ids: [{type: String, required: true}],
    processed: {type: Boolean, default: false},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Correction', CorrectionSchema);