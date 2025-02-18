import nodemailer from 'nodemailer';
import { sendNotificationPush } from "./firebase";
import { NotificationTypes } from "./constants";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yba@yba.ai', // Your Gmail address
        pass: 'ytuuzjnfgdllfqup',  // Your Gmail password or App Password
    },
});

const requestQueue: Array<{ error: any, user: any, prisma: any }> = [];
let isProcessing = false;
const ERROR_MESSAGE = [
    'invalid_grant',
    'invalid_rapt',
    'invalid_token',
    'invalid credentials',
    'no access, refresh token or api key is set'
]

async function processQueue() {
    if (isProcessing || requestQueue.length === 0) {
        return;
    }

    isProcessing = true;
    const { error, user, prisma } = requestQueue.shift();

    try {
        console.log("error.message from handleReAuth", error.message);

        const myuser = await prisma.user.findFirst({
            where: {
                id: user.id,
            },
        });

        if (!myuser) {
            console.error('User not found');
            return;
        }
        if (myuser.oauthStatus === 'INACTIVE') {
            console.error('User already inactive');
            return;
        }

        if (ERROR_MESSAGE.some(msg => error.message?.toLowerCase().includes(msg))) {
            const language = user.lang || 'en';
            // const reauthLink = 'myapp://callback/reauthenticate';
            const reauthLink = 'https://devscheduling.yesbossassistant.com/myapp';
            try {
                await sendNotificationPush(
                    user.lang === 'fr' ? 'YBA - Réauthentification requise' : 'YBA - Re-authentication required',
                    user.lang === 'fr' ? 'Votre session a expiré. Veuillez vous reconnecter pour continuer à utiliser les services YBA' : 'Your session has expired. Kindly sign in again to continue using YBA services',
                    user.email as string,
                    {
                        messageId: "invalid_grant",
                        mail: '',
                        type: NotificationTypes.SUB,
                    },
                );
                console.log('Re-authentication push notification sent');
            } catch (error) {
                console.error('Error sending Re-authentication push notification:', error);
            }


            const frTemplate = `
                <div>
                    <p>Bonjour <strong>${user.firstName}</strong>,</p>
                    <p>Votre session a expiré. Veuillez fermer l'application YBA sur votre mobile et <a href="${reauthLink}">reconnecter</a> votre compte pour continuer à utiliser YesBoss Assistant.</p>
                    <p>Cela peut se produire pour plusieurs raisons, un changement de mot de passe ou lorsque votre service de messagerie requiert une réauthentification.</p>
                    <p>Vous devez vous connecter fréquemment ?</p>
                    <p>Contactez votre administrateur de messagerie ou écrivez-nous à <a href="mailto:yba@yba.ai">yba@yba.ai</a>.</p>
                    <p>Merci!</p>
                    <p>L’équipe YBA</p>
                </div>
            `;
            const enTemplate = `
                <div>
                    <p>Hello <strong>${user.firstName}</strong>,</p>
                    <p>Your session has expired.  Please close YBA App on your mobile and <a href="${reauthLink}">re-link</a> your account to continue using YesBoss Assistant.</p>
                    <p>This can happen for several reasons, such as a password change or when your email service requires re-authentication.</p>
                    <p>Frequently asked to sign in?</p>
                    <p>Contact your email administrator or reach out to us at <a href="mailto:yba@yba.ai">yba@yba.ai</a>.</p>
                    <p>Thank you!</p>
                    <p>The YBA Team</p>
                </div>
            `;
            const mailOptions = {
                from: 'yba@yba.ai',
                to: user.email,
                subject: language === 'fr' ? 'YBA - Réauthentification requise' : 'YBA - Re-authentication required',
                text: '',
                html: language === 'fr' ? frTemplate : enTemplate,
            };
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Re-authentication Email sent: ' + info.response);
            } catch (error) {
                console.error('Error sending Re-authentication email:', error);
            }

            const updateUser = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    oauthStatus: 'INACTIVE',
                },
            });
            console.log('[[[[[[[[[[[[[[[[User updated:]]]]]]]]]]]] ', updateUser?.oauthStatus);
        }
    } catch (error) {
        console.error('Error processing request:', error);
    } finally {
        isProcessing = false;
        processQueue();
    }
}

export async function handleReAuth(error, user, prisma) {
    requestQueue.push({ error, user, prisma });
    processQueue();
}