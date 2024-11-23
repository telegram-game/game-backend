export enum TelegramCurrency {
  XTR = 'XTR',
}

export interface TelegramBotServiceOption {
  isRunBotEvent: boolean;
  onPrePayment?: (ctx: any) => Promise<void>;
  onSuccessfulPayment?: (ctx: any) => Promise<void>;
}
