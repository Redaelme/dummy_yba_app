import {Context} from "../types/contextType";
import {checkTokenValidity} from "./googleLogic";
import {google} from 'googleapis';
import {findUserOAuth, getAccessTokenAsync} from "./commonBusinessLogic";


export async function unsubscribeUserFromPubsub(user: any, ctx: Context) {
    if (user.mailService === 'MICROSOFT') {
        await unsubscribeUserFromMicrosoftPubsub(user, ctx);
    } else if (user.mailService === 'GOOGLE') {
        await unsubscribeUserFromGooglePubsub(user, ctx);
    }
    // remove the lastHistoryId from Redis
    const { redis } = ctx;
    await redis.hdel('lastHistoryId', user.id);
}

async function unsubscribeUserFromGooglePubsub(user: any, ctx: Context) {
    try {
        const { oAuth2Client } = ctx;
        // Fetch the user's OAuth tokens
        const userOauth = await ctx.prisma.oAuth.findUnique({
            where: { email: user.email },
        });

        if (!userOauth) {
            throw new Error('OAuth details not found for user');
        }
            const verifiedToken = await checkTokenValidity(
                userOauth.tokenExpiryDateTime || new Date(),
                oAuth2Client,
                user.email,
                userOauth.refreshToken || '',
                ctx,
                userOauth.token!,
            );
            oAuth2Client.setCredentials({ access_token: verifiedToken });

        const gmail = google.gmail({
            version: 'v1',
            auth: oAuth2Client,
        });

        console.log(`Unsubscribing user ${user.id} from Gmail watch...`);
        // Call the 'stop' method to cancel the watch on the user's mailbox
        const stopresp = await gmail.users.stop({ userId: 'me' });
        console.log('stopresp', stopresp);
    } catch (error) {
        console.error(`Error unsubscribing user ${user.id} from Gmail watch:`, error);
    }
}
async function unsubscribeUserFromMicrosoftPubsub(user: any, ctx: Context) {
    try {
    const OAuthTokens = await findUserOAuth(user.id, ctx);
    const accessToken = await getAccessTokenAsync(OAuthTokens[0], ctx);


        await ctx.prisma.emailSubscription.deleteMany({ where: { userId: user.id } });
        console.log('EMAIL SUBSCRIPTION REMOVED SUCCESSFULLY');
    }
    catch (error) {
        console.error('Failed to remove email subscription:', error);
    }
}