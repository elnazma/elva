const config = require('../configs/database');

let mysql = require('mysql');
let pool = mysql.createPool(config);

pool.on('error', (err)=> {
    console.error(err);
});

module.exports = {
    profile(req, res) {
        let id = req.session.userid
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SEELECT * FROM table_user where user_id = '${id}';
                `
            , function (error, results) {
                if(error) throw error;
                res.render("profile", {
                    url: 'http://localhost:8080/',
                    userName: req.session.username,
                    nama: results[0]['user_name'],
                    email: results[0]['user_email'],
                });
            });
            connection.release();
        })
    },

    saveRegister(req, res) {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.pass;

        if (username && email && password) {
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                        `INSERT INTO table_user
                            (user_name, user_email, user_password)
                            VALUES (?, ?, SHA2(?, 512));`,
                            [username, email, password],
                        function(err, results) {
                            if (error) throw error;

                            req.flash('color', 'success');
                            req.flash('status', 'Yess..');
                            req.flash('message', 'Registrasi Berhasil');

                            res.redirect('/login');
                        });

                        connection.release();
            })
        } else {
            res.redirect('/login');
            res.end();
        }
    }
}