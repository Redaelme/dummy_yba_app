import express from 'express';
import passport from 'passport';

export const authRouter = express.Router();

authRouter.get(
    '/google',
    passport.authenticate('google', {
        accessType: 'offline',
        prompt: 'consent',
        scope: [
            'openid',
            'profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/contacts.readonly',
            'https://apps-apis.google.com/a/feeds/calendar/resource/',
            'https://www.googleapis.com/auth/admin.directory.resource.calendar',
            'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly',
            'https://www.googleapis.com/auth/contacts.other.readonly',
            'https://www.googleapis.com/auth/pubsub',
            'https://www.googleapis.com/auth/gmail.compose',
        ],
    })
);

authRouter.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        // After successful authentication, Passport will attach user data to req.user
        // This includes access token, refresh token, and user profile details (if any).
        const user = req.user as {
            googleId: string;
            displayName: string;
            firstName: string;
            lastName: string;
            emails: Array<{ value: string }>;
            accessToken: string;
            refreshToken: string;
        };
        console.log('user from callback: ', user);

        return res.redirect(
            `myapp://callback?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}&email=${user.emails[0].value}&firstName=${user.firstName}&lastName=${user.lastName}`
        );

    }
);

