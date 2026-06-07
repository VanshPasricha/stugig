const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// --- GOOGLE STRATEGY ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user exists with this googleId
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          return done(null, user);
        }

        // 2. Check if user exists with this email (if they signed up with email before)
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (email) {
            user = await User.findOne({ email });
            if (user) {
                // Link google account to existing user
                user.googleId = profile.id;
                // If they don't have a profile image, use Google's
                if (!user.profileImage && profile.photos && profile.photos.length > 0) {
                    user.profileImage = profile.photos[0].value;
                }
                await user.save();
                return done(null, user);
            }
        }

        // 3. Create a new user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: email || `${profile.id}@google.oauth.com`, // Fallback email
          profileImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
          role: 'freelancer' // Default role, user can change later or we prompt them
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// --- GITHUB STRATEGY ---
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/github/callback',
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        
        if (user) {
          return done(null, user);
        }

        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (email) {
            user = await User.findOne({ email });
            if (user) {
                user.githubId = profile.id;
                if (!user.profileImage && profile.photos && profile.photos.length > 0) {
                    user.profileImage = profile.photos[0].value;
                }
                await user.save();
                return done(null, user);
            }
        }

        user = await User.create({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          email: email || `${profile.id}@github.oauth.com`,
          profileImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
          role: 'freelancer'
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
