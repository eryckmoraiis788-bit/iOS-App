export const DEFAULT_ACCOUNT_NUMBER = "15448";
export const DEFAULT_ACCOUNT_DIGIT = "3";

export function formatAccountNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 5);
}

export function formatAccountDigit(value: string): string {
  return value.replace(/\D/g, "").slice(0, 1);
}

export function formatAccountFinal(number: string, digit: string): string {
  return `${formatAccountNumber(number) || DEFAULT_ACCOUNT_NUMBER}-${formatAccountDigit(digit) || DEFAULT_ACCOUNT_DIGIT}`;
}
