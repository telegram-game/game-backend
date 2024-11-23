import { OnModuleInit } from '@nestjs/common';
import { Logger } from 'src/modules/loggers';
import { TelegramBotService } from 'src/modules/telegram';
import { InventoryService } from './inventory.service';

export class TelegramBusinessService implements OnModuleInit {
    constructor(
        private readonly telegramBotService: TelegramBotService,
        private readonly inventoryService: InventoryService,
        private readonly logger: Logger,
    ) { }

    onModuleInit() {
        this.telegramBotService.onPrePayment((ctx) => this.onPrePayment(ctx));
        this.telegramBotService.onSuccessfulPayment((ctx) =>
            this.onSuccessfulPayment(ctx).catch((err) => {
                this.logger.error('onSuccessfulPayment failed', err);
            }),
        );
    }

    private async onPrePayment(ctx: any) {
        return ctx.answerPreCheckoutQuery(true).catch((err: any) => {
            this.logger.error('answerPreCheckoutQuery failed', err);
        });
    }

    private async onSuccessfulPayment(ctx: any) {
        if (!ctx.message || !ctx.message.successful_payment || !ctx.from) {
            return;
        }

        // TODO: Handle successfull payment by sending to the event source. For now, just process the payment directly
        // But please note that can be failed if the payment is not successful
        // Also we need to store the payment information to the database too
        const payment = ctx.message.successful_payment;
        const { chestCode, userId, gameProfileId } = JSON.parse(payment.invoice_payload);
        const telegramPaymentChargeId = payment.telegram_payment_charge_id;
        const providerPaymentChargeId = payment.provider_payment_charge_id;
        const currency = payment.currency;
        const totalAmount = payment.total_amount;
        await this.inventoryService.openChestExecution(chestCode, userId, gameProfileId, {
            provider: 'TELEGRAM',
            paymentChargeId: telegramPaymentChargeId,
            providerPaymentChargeId,
            providerMessageId: ctx.message.message_id,
            providerUserId: ctx.from.id.toString(),
            currency,
            totalAmount,
        }).catch((err) => {
            // Duplicate data. It's mean the user already has the item
            if (err?.code === 'P2002' && err?.meta?.modelName === 'UserGameInventories') {
                this.logger.info('Duplicate data. It\'s mean the user already has the item');
                return;
            }
            
            this.logger.error('openChestExecution failed', err);
            // Buy the way, we should refund the payment if the payment is failed?
            this.telegramBotService.refund(ctx.from.id, telegramPaymentChargeId).catch((err) => {
                this.logger.error('refund failed', err);
            });
        });
    }
}

/*
onSuccessfulPayment {
  message_id: 15,
  from: {
    id: 377181168,
    is_bot: false,
    first_name: 'Jerry Nguyễn',
    username: 'jerrynguyen93',
    language_code: 'vi',
    is_premium: true
  },
  chat: {
    id: 377181168,
    first_name: 'Jerry Nguyễn',
    username: 'jerrynguyen93',
    type: 'private'
  },
  date: 1732356821,
  successful_payment: {
    currency: 'XTR',
    total_amount: 1,
    invoice_payload: '{"chestCode":"FIRE_SWORD_L1","userId":"cm3svjonb0001djfmp15k9z7b","gameProfileId":"cm3svk5lp0005djfm1qkvc9zs"}',
    telegram_payment_charge_id: 'stxvGMOJOoRX4qduwUnfw0ZIJ4LuFAtsWYUQGXTQcS8aeHrIPxD9PRxH1N617EA9F35KHAzTO4AqP7qa2zcjA6VqZ44Jw3ziAwKiVOJws-BuBlizHeCDA_7Hn27g9CoWb6x',
    provider_payment_charge_id: '377181168_6'
  }
}
*/
