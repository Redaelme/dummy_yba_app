import {getAccessTokenAsyncWithoutCtx} from "../../utils/commonBusinessLogic";
import {NotFoundError} from "../../schema/graphql/errors";
import {O_AUTH_TOKEN_NOT_FOUND_ERROR_MESSAGE} from "../../schema/graphql/errors/messages";
import {EntityTypes} from "../../utils/constants";
import {O_AUTH_TOKEN_NOT_FOUND} from "../../schema/graphql/errors/common";
import {PrismaClient} from '@prisma/client';
import {OutLookClient} from "../../mail/outlook/outlookClient";


export async function refreshUserAccessToken(userId: string) {
    const prisma = new PrismaClient();

    const OAuthTokens = await prisma.oAuth.findMany({
        where: {
            userId,
        },
        include: { oAuthOutlookAccount: true },
    });
    console.log('OAuthTokens', OAuthTokens);
    if (!OAuthTokens.length) {
        throw new NotFoundError(
            O_AUTH_TOKEN_NOT_FOUND_ERROR_MESSAGE,
            'userId',
            userId,
            EntityTypes.O_AUTH,
            O_AUTH_TOKEN_NOT_FOUND,
        );
    }

    const outLookClient = new OutLookClient();

    return await getAccessTokenAsyncWithoutCtx(OAuthTokens[0], prisma, outLookClient);
}
