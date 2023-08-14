import { JobOptions } from 'bull';

export const jobOptions: JobOptions = {
  attempts: 3,
  removeOnComplete: 20,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
};
