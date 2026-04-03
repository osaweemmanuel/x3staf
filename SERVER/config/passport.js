const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GO_CLIENT_ID,
    clientSecret: process.env.GO_CLIENT_SECRET,
    callbackURL: process.env.GO_REDIRECT_URI || "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const username = profile.displayName;

      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await User.create({
          username: username,
          email: email,
          verified: true,
          isGoogleUser: true,
          roles: ["User"]
        });

        // Split name for UserProfile
        const nameParts = username.split(' ');
        const firstName = nameParts[0] || 'New';
        const lastName = nameParts.slice(1).join(' ') || 'Personnel';

        // Also create their worker profile so they show up in Admin Dashboard Registry
        const UserProfile = require('../models/UserProfile');
        await UserProfile.create({
          userId: user.id,
          firstName,
          lastName,
          email,
          memo: "Registered via Google Handshake"
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// We are not using sessions if we use JWT, but passport requires these if session: true
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
