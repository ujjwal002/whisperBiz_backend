export type Job = () => Promise<void>;

const queue: Job[] = [];
let processing = false;

export const Queue = {
  add(job: Job) {
    queue.push(job);
    this.process();
  },

  async process() {
    if (processing) return;
    processing = true;

    while (queue.length) {
      const job = queue.shift();
      if (job) {
        try {
          await job();
        } catch (e) {
          console.error("Queue job failed:", e);
        }
      }
    }

    processing = false;
  },
};
