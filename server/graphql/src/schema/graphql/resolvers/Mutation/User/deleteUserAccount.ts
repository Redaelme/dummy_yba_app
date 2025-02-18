import {Context} from '../../../../../types/contextType';
import {NexusGenArgTypes} from '../../../../generated/nexus';
import {unsubscribeUserFromPubsub} from "../../../../../utils/pubSubUtils";

export default {
    deleteUserAccount: async (
        _: any,
        { userId }: NexusGenArgTypes['Mutation']['deleteUserAccount'],
        ctx: Context,
    ) => {
        try {
            console.log("[[[deleteUserAccount]]] userId: ", userId);
            if (!userId) {
                throw new Error('User ID is required');
            }

            const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }
            await unsubscribeUserFromPubsub(user, ctx);
            console.log("deleting user account...");
            await ctx.prisma.user.delete({ where: { id: userId } });
            return { success: true, message: 'User account deleted successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
};