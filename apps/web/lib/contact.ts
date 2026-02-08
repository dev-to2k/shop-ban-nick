const zaloPhone = process.env.NEXT_PUBLIC_ZALO_PHONE ?? '';
const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://fb.com/shopacc';
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@shopacc.vn';
const bankName = process.env.NEXT_PUBLIC_BANK_NAME ?? 'Vietcombank';
const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? '1234567890';
const bankHolder = process.env.NEXT_PUBLIC_BANK_HOLDER ?? 'SHOP ACC GAME';

export const contact = {
  zaloPhone,
  zaloUrl: zaloPhone ? `https://zalo.me/${zaloPhone.replace(/\D/g, '')}` : '',
  facebookUrl,
  supportEmail,
  bank: { name: bankName, account: bankAccount, holder: bankHolder },
};
