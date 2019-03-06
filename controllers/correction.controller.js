const Correction = require('../models/correction.model');

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

    Correction.find({}, (err, corrections) => {
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
    });
}

exports.delete = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Correction.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err);
            return;
        }

        res.redirect('/correction/');
    });    
}