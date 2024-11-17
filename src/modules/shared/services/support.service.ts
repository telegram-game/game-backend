import { Injectable } from '@nestjs/common';

@Injectable()
export class SupportService {
  calculateWithPointAndPercent(
    value: number,
    point: number = 0,
    percent: number = 0,
  ): number {
    return point + Math.floor((value * percent) / 100);
  }

  calculateWithPercent(value: number, percent: number = 0): number {
    return Math.floor((value * percent) / 100);
  }

  randomRate(rate: number): boolean {
    return Math.random() * 100 < rate;
  }

  randomWithRate(rates: Record<string, number>): string {
    // Check if the rates are valid
    const totalRate = Object.values(rates).reduce((acc, rate) => acc + rate, 0);
    if (totalRate !== 100) {
      throw new Error('Rates must sum up to 100');
    }

    const randomValue = Math.random() * totalRate;
    let currentRate = 0;
    for (const [key, rate] of Object.entries(rates)) {
      currentRate += rate;
      if (randomValue <= currentRate) {
        return key;
      }
    }

    throw new Error('Invalid rates');
  }

  randomWithList<T>(
    list: T[],
    count: number = 1,
    isUnique: boolean = false,
  ): T[] {
    if (list.length === 0) {
      throw new Error('List cannot be empty');
    }

    if (count > list.length) {
      return list;
    }

    const result = [];
    const randomIndex = new Set<number>();
    while (randomIndex.size < count) {
      const randomValue = Math.floor(Math.random() * list.length);
      if (isUnique && randomIndex.has(randomValue)) {
        continue;
      }
      randomIndex.add(randomValue);
    }

    for (const index of randomIndex) {
      result.push(list[index]);
    }

    return result;
  }

  randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  buildValue(
    data: { value?: number; min?: number; max?: number },
    multiplier: number,
  ): number {
    if (!data) {
      return 0;
    }

    if (data.value) {
      return data.value * multiplier;
    }

    if (data.min && data.max) {
      return this.randomInRange(data.min, data.max) * multiplier;
    }

    return 0;
  }
}
