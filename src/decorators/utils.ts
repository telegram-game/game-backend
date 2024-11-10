import { Logger } from 'src/modules/loggers/logger.service';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Retry(options: {
  retries: number;
  multiplier: number;
  base: number;
}) {
  return function (
    _: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    if (!options.retries) {
      return descriptor;
    }

    const originalMethod = descriptor.value;
    const logger = new Logger(originalMethod.name);

    descriptor.value = async function (...args: any[]) {
      for (let i = 0; i < options.retries; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          logger.error(`error occurred on attempt ${i + 1}:`, error);

          // Calculate the wait interval
          const waitInterval = options.base * Math.pow(options.multiplier, i);
          logger.log(`waiting for ${waitInterval} ms before retrying...`);
          await delay(waitInterval);
          if (i === options.retries - 1) {
            logger.error(
              `Method ${propertyKey} failed after ${options.retries} attempts`,
            );
            throw error;
          }
        }
      }
    };

    return descriptor;
  };
}
