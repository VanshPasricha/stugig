const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser, oauthLogin } = require('../controllers/authController');

// Standard Email/Password Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- GOOGLE OAUTH ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    oauthLogin
);

// --- GITHUB OAUTH ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

router.get(
    '/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    oauthLogin
);

module.exports = router;
