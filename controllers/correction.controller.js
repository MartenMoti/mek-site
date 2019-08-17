const Correction = require('../models/correction.model');

exports.set_correction = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }

    Correction.findById(req.params.id, (err, correction) => {
        if (err) {
            console.log(err);
            return;
        }

        req.correction = correction; 

        next();
    });
}

exports.create_correction = (req, res) => {
    let amount = req.body.amount.replace(',', '.');
    if (isNaN(amount)) {
        res.send('Wat kun je wel? Kun je niet eens een getal intypen? Of ben je zo\'n persoon die het verschil tussen een omschrijving en bedrag niet weet?');
        return;
    }

    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    let correction = new Correction({
        description: req.body.description,
        amount: amount,
        corrector_id: req.user,
        corrected_ids: req.body.roommate
    });

    correction.save((err) => {
        if(err) {
            console.log(err);
            return;
        }

        res.redirect('/dashboard');
    });
};

exports.show_all = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Correction.find({}).sort({'date': -1}).exec((err, corrections) => {
        if (err) {
            console.log(err);
            return;
        }

        res.render('../views/correction/index.ejs', {
            corrections: corrections,
            id_to_name: req.names
        });
    });
}

exports.show_one = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Correction.findById(req.params.id, (err, correction) => {
        if (err) {
            console.log(err);
            return;
        }

        res.render('../views/correction/details.ejs', {
            correction: correction,
            id_to_name: req.names,
            roommates: req.roommates
        });
    });
}

exports.update = (req, res) => {
    let amount = req.body.amount.replace(',', '.');
    if (isNaN(amount)) {
        res.send('Wat kun je wel? Kun je niet eens een getal intypen? Of ben je zo\'n persoon die het verschil tussen een omschrijving en bedrag niet weet?');
        return;
    }

    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Correction.findById(req.params.id, (err, correction) => {
        if (err) {
            console.log(err);
            return;
        }

        if (req.current_user_is_admin || req.user === correction.corrector_id) {
            correction.amount = amount;
            correction.description = req.body.description;
            correction.corrected_ids = req.body.roommate;

            correction.save((err) => {
                if (err) {
                    console.log(err);
                    return;
                }

                res.redirect('/correction/');
            });
        } else {
            res.send('Je kan geen correcties van andere mensen aanpassen.');
        }
    });
}

exports.delete = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    if (req.current_user_is_admin || req.correction.corrector_id === req.user) {
        Correction.findByIdAndDelete(req.params.id, (err) => {
            if (err) {
                console.log(err);
                return;
            }

            res.redirect('/correction/');
        });    
    } else {
        res.send('Je mag geen correcties van andere mensen verwijderen.');
    }
}