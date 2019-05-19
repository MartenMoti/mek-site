const User = require('../models/user.model');
const passport = require('passport');

exports.register_get = (req, res) => {
    res.render('../views/user/register.ejs');
};

exports.register_post = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }
    
    let user = new User({
        real_name: req.body.real_name,
        house_name: req.body.real_name,
    });

    user.setPassword(req.body.password);

    user.save((err) => {
        if (err) {
            console.log(err);
            res.send('Could not create user.')
            return (err);
        }

        res.send("Succesfully created user.");
    });
};

exports.login_get = (req, res) => {
    res.render('../views/user/login.ejs');
};

exports.login_post = passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/user/login'
});

exports.show_all = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
            return;
        }

        res.render('../views/user/index.ejs', {
            users: users,
            names: req.names
        });
    });
}

exports.show_one = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            return;
        }

        res.render('../views/user/details.ejs', {
            user: user,
        });
    });
}

exports.set_house_name = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            return;
        }

        user.house_name = req.body.house_name;

        user.save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.redirect('/user/' + user.id);
        });
    });
}

exports.set_admin = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            return;
        }

        user.admin = true;

        user.save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.redirect('/user/' + user.id);
        });
    });
}

exports.set_not_admin = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            return;
        }

        user.admin = false;

        user.save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.redirect('/user/' + user.id);
        });
    });
}

exports.set_moved_out = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            return;
        }

        user.moved_out = true;

        user.save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.redirect('/user/' + user.id);
        });
    });
}

exports.set_not_moved_out = (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
        return;
    }

    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            return;
        }

        user.moved_out = false;

        user.save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            
            res.redirect('/user/' + user.id);
        });
    });
}

exports.set_password = (req, res) => {
    if (!req.isAuthenticated) {
        res.redirect('/login');
        return;
    }

    User.findById(req.params.id, (err, user) => {
        if (err) {
            console.log(err);
            return;
        }

        user.setPassword(req.body.password);

        user.save((err) => {
            if (err) {
                console.log(err);
                return;
            }

            res.redirect('/user/' + user.id);
        })
    });
}

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/user/login');
}

exports.set_active_housemates = (req, res, next) => {
    req.active_housemates = [];
    User.find({moved_out: false}, (err, users) => {
        for (let i = 0; i < users.length; i++) {
            req.active_housemates.push(users[i].id);
        }
        next();
    });
}