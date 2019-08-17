const Investment = require('../models/investment.model');
const User = require('../models/user.model');

exports.create_investment = (req, res) => {
    let amount = req.body.amount.replace(',', '.');
    if (isNaN(amount)) {
        res.send('Wat kun je wel? Kun je niet eens een getal intypen? Of ben je zo\'n persoon die het verschil tussen een omschrijving en bedrag niet weet?');
        return;
    }

    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    let investment = new Investment({
        description: req.body.description,
        amount: amount,
        investor_id: req.user,
        active_ids: req.active_housemates
    });

    investment.save((err) => {
        if(err) {
            console.log(err);
            return;
        }

        res.redirect('/dashboard');
    });
};

exports.set_names = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    req.names = {}

    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
            next();
        }
        
        for(let i = 0; i < users.length; i++) {
            req.names[users[i].id] = users[i].house_name;
        }

        return next();
    });
}

exports.show_all = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Investment.find({}).sort({'date': -1}).exec((err, investments) => {
        if (err) {
            console.log(err);
            return;
        }

        res.render('../views/investment/index.ejs', {
            investments: investments,
            names: req.names
        });
    });
}

exports.set_investment = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }
    Investment.findById(req.params.id, (err, investment) => {
        if (err) {
            return;
        }

        req.investment = investment;
        next();
    });
}

exports.show_single = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    User.findById(req.investment.investor_id, (err, user) => {
        if (err) {
            console.log(err);
            return;
        }
        
        res.render('../views/investment/details.ejs', {
            investment: req.investment,
            user_house_name: user.house_name
        });
    });
}

exports.update_investment = (req, res) => {
    let amount = req.body.amount.replace(',', '.');
    if (isNaN(amount)) {
        res.send('Wat kun je wel? Kun je niet eens een getal intypen? Of ben je zo\'n persoon die het verschil tussen een omschrijving en bedrag niet weet?');
        return;
    }


    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    Investment.findById(req.params.id, (err, investment) => {
        if (err) {
            console.log(err);
            return;
        }

        // Check if the user updating the investment is the same user who created it.
        // Check if the current user is an admin.
        // If neither, they do not have permission to update the investment. 
        if (!(req.current_user_is_admin || investment.investor_id === req.user)) {
            res.send('Je mag geen investeringen van anderen veranderen.');
        } else {
            investment.description = req.body.description;
            investment.amount = amount;

            investment.save((err) => {
                if(err) {
                    console.log(err);
                    return;
                }
        
                res.redirect('/investment');
            });
        }
    });
}

exports.delete_investment = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }

    // Check if the user deleting the investment is the same user who created it.
    // Check if the current user is an admin.
    // If neither, they do not have permission to delete the investment.
    if ((req.investment.investor_id === req.user || req.current_user_is_admin)) {
        Investment.findByIdAndDelete(req.params.id, (err) => {
            if (err) {
                console.log(err);
                return;
            }
    
            res.redirect('/investment');
        });    
    } else {
        res.send('Je kan geen investeringen van andere mensen verwijderen.');
    }
}