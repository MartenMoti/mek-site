const User = require('../models/user.model');
const Investment = require('../models/investment.model');
const Correction = require('../models/correction.model');

exports.set_all_investment = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Investment.find({
        processed: false
    }, (err, investments) => {
        if (err) {
            console.log(err);
            return;
        }

        req.all_investments = investments;
        next();
    });
}

exports.set_all_corrections = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Correction.find({
        processed: false
    }, (err, corrections) => {
        if (err) {
            console.log(err);
            return;
        }

        req.all_corrections = corrections;
        next();
    });
}

exports.set_all_housemates = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
            return;
        }

        req.all_housemates = users;
        next();
    });
}

exports.set_financial_information = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    let financial_information = {};
    for (let i = 0; i < req.all_housemates.length; i++) {
        financial_information[req.all_housemates[i].id] = {
            "invested_by": 0,
            "corrected_by": 0,
            "invested_on": 0,
            "corrected_on": 0,
            "balance": 0
        };
    }

    // Set investment data
    for (let i = 0; i < req.all_investments.length; i++) {
        let investment = req.all_investments[i];
        financial_information[investment.investor_id].invested_by += investment.amount;

        for (let j = 0; j < investment.active_ids.length; j++) {
            let housemate = investment.active_ids[j]

            financial_information[housemate].invested_on += investment.amount / investment.active_ids.length;
        }
    }

    // Set correction data
    for (let i = 0; i < req.all_corrections.length; i++) {
        let correction = req.all_corrections[i];
        financial_information[correction.corrector_id].corrected_by += correction.amount;
        let amount_of_people = correction.corrected_ids.length;

        for (let j = 0; j < correction.corrected_ids.length; j++) {
            corrected_id = correction.corrected_ids[j];
            financial_information[corrected_id].corrected_on += correction.amount / amount_of_people;
        }
    }

    for(let i = 0; i < req.all_housemates.length; i++) {
        let id = req.all_housemates[i].id;

        financial_information[id].balance = (
            financial_information[id].invested_by +
            financial_information[id].corrected_by -
            financial_information[id].invested_on -
            financial_information[id].corrected_on
        );
    }

    for(let i = 0; i < req.all_housemates.length; i++) {
        let id = req.all_housemates[i].id;

        financial_information[id].balance = Math.round(financial_information[id].balance * 100) / 100;
        financial_information[id].invested_by = Math.round(financial_information[id].invested_by * 100) / 100;
        financial_information[id].invested_on = Math.round(financial_information[id].invested_on * 100) / 100;
        financial_information[id].corrected_on = Math.round(financial_information[id].corrected_on * 100) / 100;
        financial_information[id].corrected_by = Math.round(financial_information[id].corrected_by * 100) / 100;     
    }

    req.financial_information = financial_information;
    next();
}

exports.show_all = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    res.render('../views/finance/index.ejs', {
        financial_information: req.financial_information,
        all_housemates: req.all_housemates
    })
}