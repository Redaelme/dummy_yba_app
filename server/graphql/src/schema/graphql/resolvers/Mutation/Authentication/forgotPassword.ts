import isEmail from 'validator/lib/isEmail';
import {Context} from '../../../../../types/contextType';
import {RESET_PASSWORD_KEY} from '../../../../../utils/constants';
import {getRandomDigit} from '../../../../../utils/utils';
import {NexusGenArgTypes} from '../../../../generated/nexus';
import nodemailer from 'nodemailer';


// Configure the SMTP transport
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: 'yba@yba.ai', // Your Gmail address
    pass: 'ytuuzjnfgdllfqup',  // Your Gmail password or App Password
},
});
export default {
    forgotPassword: async (
        _: any,
        {email}: NexusGenArgTypes['Mutation']['forgotPassword'],
        ctx: Context,
    ) => {
        try {
            if (!isEmail(email)) {
                throw new Error('Invalid email');
            }

            const user = await ctx.prisma.user.findUnique({
                where: {email},
            });
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }

            const token = getRandomDigit(6);
            // token expired on 10mn (600s)
            const value = await ctx.redis.set(`${RESET_PASSWORD_KEY}:${user.id}`, token, 'EX', 600);

            const mailOptions = {
                from: 'yba@yba.ai',
                to: user.email,
                subject: user.lang === 'fr' ? 'Réinitialisation de mot de passe' : 'Password reset',
                text: user.lang === 'fr' ? "" : "",
                html: user.lang === 'fr' ? `<p>Bonjour, <br> Voici le code qui vous permettra de réinitialiser votre mot de passe : <b>${token}</b></p>` : `<p>Hello, <br> Here is the code you can use to reset your password: <b>${token}</b></p>`
            };
            //
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
            } catch (error) {
                console.error('Error sending email:', error);
            }


            return {
                success: true,
                message: 'Mail sent successfully!',
            };
        } catch (error) {
            return error;
        }
    },
};
