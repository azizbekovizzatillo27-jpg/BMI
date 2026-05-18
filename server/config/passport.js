const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

// Note: In a real project, you would import your DB model or mock data here
// For this project, we are using the auth route's mock data structure
// We'll use a placeholder for the logic that will be refined in the auth routes

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    callbackURL: "/api/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Create user object from Google profile
      const user = {
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: 'google',
        social_id: profile.id,
        photo: profile.photos[0]?.value,
        role: 'student' // Default role
      };
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;
