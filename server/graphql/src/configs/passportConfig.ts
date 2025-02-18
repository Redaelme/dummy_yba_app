import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL as string;

export function configurePassport() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: GOOGLE_CALLBACK_URL,
            },
            // The "verify callback" where Google returns user information
            // The `accessToken` and `refreshToken` will be available here
            (accessToken:string, refreshToken:string, profile:any, done:any) => {
                // In this simplified scenario, we are not storing anything in the DB.
                // We simply pass the tokens and profile forward.
                const userData = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name?.givenName,
                    lastName: profile.name?.familyName,
                    emails: profile.emails || [],
                    accessToken,
                    refreshToken,
                };
                console.log('userData from strategy: ', userData);
                return done(null, userData);
            }
        )
    );

    // (Optional) If you later decide to use sessions, you would configure
    // `passport.serializeUser` and `passport.deserializeUser` here.
}
