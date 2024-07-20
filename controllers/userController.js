const User = require('../models/userModel');

exports.createUser = (req, res) => {
    const userData = req.body;
    User.create(userData, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'User created successfully', data: result });
        }
    });
};
