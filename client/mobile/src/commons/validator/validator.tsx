export const isValidEmail = (email: string): boolean => {
  const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  return email !== undefined && regexEmail.test(email.trim());
};