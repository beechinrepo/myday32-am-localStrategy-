const morgan = require('morgan');
const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

const config = require('./config');
const mkQuery = require('./dbutil');

const PORT = 3000;
const pool = mysql.createPool(config);

const FIND_USER = 'select count(*) as user_count from users where username = ? and password = sha2(?, 256)';
const GET_USER_DETAILS = 'select username, email, department from users where username = ?';

const findUser = mkQuery(FIND_USER, pool);
const getUserDetails = mkQuery(GET_USER_DETAILS, pool);
const authenticateUser = (param) => {
    return (
        findUser(param)
            .then(result => (result.length && result[0].user_count > 0))
    )
}

// Load Libraries (passport n passport-local)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Configure passport to use PassportLocal
passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        (user, password, done) => {
            authenticateUser([username, password])
                .then(result => {
                    if (result)
                        return (done(null, username))
                    done(null, false)
                })
        }

    )
)

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Initialize passport
app.use(passport.initialize());

app.get('/status/:code',
    (req, resp) => {
        // nd to do a little more checking
        resp.status(parseInt(req.params.code).json({message: 'incorrect login'}))
    }
)

app.post('/authenticate',
    passport.authenticate('local', {
        failureRedirect:'/status/401',
        session: false
        
    }),
    (req, resp) => {
        // issue JWT
        console.info('user: ', req.user);
        getUserDetails([req.user])
            .then(result => {
                console.info('result: ', result);
                resp.status(200).json({user: req.user});
            })
    }
)


app.use(express.static(__dirname + '/public'))

app.listen(PORT,
    () => { console.info(`Application started on port ${PORT} at ${new Date()}`) }
);

