const User = require('../models/user.model');
const Investment = require('../models/investment.model');
const Correction = require('../models/correction.model');

exports.handle_index = (req, res) => {
    if (req.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('user/login');
    }
};

module.exports.get_user = (req, res, next) => {
    User.findById(req.user, (err, user) => {
        if (err) return next(err);

        req.userObject = user;
        return next();
    });
};

module.exports.get_roommates = (req, res, next) => {
    User.find({moved_out: false}, (err, users) => {
        if (err) return next(err);

        req.roommates = users;
        return next();
    })
};

exports.handle_dashboard = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }
    
    res.render('../views/dashboard.ejs', { 
        user: req.userObject,
        roommates: req.roommates,
        names: req.names,
        investments: req.investments,
        corrections: req.corrections,
        financial_information: req.financial_information
    });
};

exports.set_investments = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Investment.find({processed: false}).sort({'date': -1}).limit(10).exec((err, investments) => {
        if (err) {
            console.log(err);
            return;
        }

        req.investments = investments;
        next();
    });
}

exports.set_corrections = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Correction.find({processed: false}).sort({'date': -1}).limit(10).exec((err, corrections) => {
        if (err) {
            console.log(err);
            return;
        }

        // A correction is relevant if it was made by you or if it was made on you
        relevant_corrections = [];

        for (let i = 0; i < corrections.length; i++) {
            var relevant = false;;

            for (let j = 0; j < corrections[i].corrected_ids.length; j++) {
                if (corrections[i].corrected_ids[j] == req.user) {
                    relevant = true;
                }
            }

            if (corrections[i].corrector_id == req.user) {
                relevant = true;
            }

            if (relevant) {
                relevant_corrections.push(corrections[i]);
            }
        }

        req.corrections = relevant_corrections;
        next();
    });
}

exports.archive_investments = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    if (!req.userObject.admin) {
        res.send('Je bent geen lijstbeheerder');
        return;
    }

    Investment.update({}, {processed: true}, {multi: true}, (err, num) => {
        if (err) {
            console.log(err);
        }

        console.log("Updated investment entries!");
    });
}

exports.archive_corrections = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    if (!req.userObject.admin) {
        res.send('Je bent geen lijstbeheerder');
        return;
    }

    Correction.update({}, {processed: true}, {multi: true}, (err, num) => {
        if (err) {
            console.log(err);
        }

        console.log("Updated correction entries!");
        next();
    });
}