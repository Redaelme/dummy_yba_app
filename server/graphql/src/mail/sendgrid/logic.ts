import { EMAIL_ADMIN, TEMPLATE_ID } from './config';

interface IParameters {
  data: {
    to: string;
    subject: string;
    text: string;
    html: string;
    dynamicTemplateData?: object;
  };
}
export const buildMailForBO = (args: IParameters) => {
  const { to, subject, text, html, dynamicTemplateData } = args.data;
  const from = EMAIL_ADMIN;
  const templateId = TEMPLATE_ID;
  return {
    to,
    from,
    subject,
    text,
    html,
    dynamicTemplateData: { ...dynamicTemplateData },
    templateId,
  };
};
