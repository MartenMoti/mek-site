const Correction = require('../models/correction.model');

exports.create_correction = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    let correction = new Correction({
        description: req.body.description,
        amount: req.body.amount,
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