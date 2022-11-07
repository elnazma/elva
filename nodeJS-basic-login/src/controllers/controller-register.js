const config = require('../configs/database');

let mysql = require('mysql');

let pool = mysql.createPool(config);

pool.on('error', (err)=> {
    console.error(err);
});

module.exports = {
    formRegister(req, res) {
        res.render("register", {

            url: 'http://localhost:8080/',
        });
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