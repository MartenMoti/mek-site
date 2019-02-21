const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let InvestmentSchema = new Schema({
    description: {type: String, required: true, max: 100},
    amount: {type: Number, required: true},
    investor_id: {type: String, required: true},
    processed: {type: Boolean, default: false},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Investment', InvestmentSchema);