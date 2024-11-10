import { Injectable } from '@nestjs/common';
import { get } from 'lodash';
import en from '../locale/en.json';
import vi from '../locale/vi.json';
import { TranslationModel } from '../models/translation.model';

@Injectable()
export class TranslationService {
  translate(data: TranslationModel): string {
    const translationData = this.getTranslationData(data.language);
    if (!translationData) {
      return '';
    }

    let translateMsg = get(translationData, data.codeMessage, data.codeMessage);
    if (translationData && !!data.params) {
      for (const [key, value] of Object.entries(data.params)) {
        translateMsg = translateMsg.replaceAll(`{${key}}`, value);
      }
    }
    return translateMsg;
  }

  getTranslationData(language: string): typeof vi | typeof en | undefined {
    return {
      vi: vi,
      en: en,
    }[language];
  }
}
