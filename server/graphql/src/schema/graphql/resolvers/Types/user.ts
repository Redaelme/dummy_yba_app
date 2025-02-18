import {Context} from '../../../../types/contextType';
import {findUserOAuth, getAccessTokenAsync} from '../../../../utils/commonBusinessLogic';
import {checkTokenValidity} from '../../../../utils/googleLogic';
import {NexusGenRootTypes} from '../../../generated/nexus';

export default {
    contacts: async (
        parent: NexusGenRootTypes['User'],
        _: any,
        ctx: Context,
    ): Promise<Array<NexusGenRootTypes['Contact'] | null> | null> => {
        console.log('parent ==>', parent);
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: ctx.currentUser?.id,
            },
            select: {
                id: true,
                email: true,
                mailService: true,
            },
        });
        if (!user) {
            return [];
        }
        console.log('user ==>', user);
        const OAuth = await findUserOAuth(user.id, ctx);
        const userEmail = user.email;
        if (user.mailService === 'MICROSOFT') {
            try {

                const accessToken = await getAccessTokenAsync(OAuth[0], ctx);
                const contacts = await ctx.outLookClient.listContacts(accessToken);

                return contacts.value.length
                    ? contacts.value
                        .filter(
                            (contact) =>
                                contact.emailAddresses.length &&
                                contact.emailAddresses.some((emailAddress) => emailAddress.address !== userEmail),
                        )
                        .map((contact) => {
                            const emailAddresses = contact.emailAddresses.map((emailAddress) => emailAddress.address);
                            return {
                                displayName: contact.displayName || emailAddresses[0] || '',
                                givenName: contact.givenName,
                                emailAddresses: contact.emailAddresses?.length
                                    ? contact.emailAddresses.map((address) => address.address)
                                    : [],
                                profession: contact.profession,
                            };
                        })
                    : [];
            } catch (error) {
                return [];
            }
        } else if (user.mailService === 'GOOGLE') {
            ctx.oAuth2Client.setCredentials({access_token: OAuth[0].token});
            try {
                const verifiedToken = await checkTokenValidity(
                    OAuth[0].tokenExpiryDateTime || new Date(),
                    ctx.oAuth2Client,
                    user.email as string,
                    OAuth[0].refreshToken || '',
                    ctx,
                    OAuth[0].token!,
                );
                ctx.oAuth2Client.setCredentials({access_token: verifiedToken});

                if (verifiedToken && userEmail) {
                    console.log('verifiedToken ==>', verifiedToken);
                    // get all lastHistoryId from redis
                    const allLastHistoryIds = await ctx.redis.hgetall('lastHistoryId');
                    console.log('####### All lastHistoryIds: #####', allLastHistoryIds);

                    const contacts = await ctx.googleClient.getGoogleContacts(ctx.oAuth2Client);

                    return contacts.length
                        ? contacts
                            .filter(
                                (contact) =>
                                    contact.emailAddresses?.length &&
                                    contact.emailAddresses.some((emailAddress) => emailAddress.value !== userEmail),
                            )
                            .map((contact) => {
                                return {
                                    displayName: contact.names?.[0].displayName || '',
                                    emailAddresses: contact.emailAddresses
                                        ? (contact.emailAddresses.map((gdEmail) => gdEmail.value) as string[])
                                        : [],
                                };
                            })
                        : [];
                }
            } catch (error) {
                return [];
            }
        }
        return [];
    },
};