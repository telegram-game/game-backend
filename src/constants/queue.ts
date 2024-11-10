export enum QueuePriority {
  Low = 4,
  Normal = 3,
  High = 2,
  Critical = 1,
}

export const QUEUE_PREFIX = '{prefix}:queue';
export const REMOVE_PEER_QUEUE = 'remove-peer-queue';
export const BLACKLIST_QUEUE = 'blacklist-queue';
