const User = require('../models/user.model');
const Investment = require('../models/investment.model');

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
        investments: req.investments
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