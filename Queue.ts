import {  Message } from "./Database";

interface IQueue<T extends { id: string; }> {
    Enqueue: (item: T) => void;
    Dequeue: (workerId: number) => T | undefined;
    Confirm: (workerId: number, itemId: T['id']) => void;
    Size: () => number;
}

export class Queue implements IQueue<Message> {
    private queue: Message[] = [];
    // Maps worker ids to the message they are processing
    private workersMessagesInProcessing: Map<number, Message> = new Map();
    // Tracks all message keys that are in processing by any worker
    // Ensures we avoid "race condition" between operations for the same "product"
    private messageKeysInProcessing: Set<string> = new Set();

    /**
     * Checks a worker availability
     */
    private isWorkerInProcessing(workerId: number): boolean {
        return this.workersMessagesInProcessing.has(workerId);
    }

    /**
     * Find first "available" for processing message in the queue
     * - Makes sure it skips messages that relate to "products" (key) that already in processing
     */
    private getNextQueueItemToProcess(): Message | undefined {
        const messageIndexToProcess = this.queue.findIndex(
          ({key}: Message) => !this.messageKeysInProcessing.has(key)
        );

        if (messageIndexToProcess === -1) {
            return;
        }

        return this.queue.splice(messageIndexToProcess, 1)[0];
    }

    /**
     * Adds a new message to a processing queue
     */
    Enqueue(message: Message): void {
        this.queue.push(message);
    }

    /**
     * Finds the next available message if any and "assigns" it to a "free" worker
     * - Skips workers who already has a message in processing
     * - Skips messages whose "product" (key) is already in processing
     */
    Dequeue(workerId: number): Message | undefined {
        if (this.isWorkerInProcessing(workerId)) {
            return;
        }

        const queueItemToProcess = this.getNextQueueItemToProcess();

        if (!queueItemToProcess) {
            return;
        }

        const {key} = queueItemToProcess;

        this.workersMessagesInProcessing.set(workerId, queueItemToProcess);
        this.messageKeysInProcessing.add(key);

        return queueItemToProcess;
    };

    /**
     * Confirms that a worker has finished processing a message
     * Removes messages from processing if:
     * - The worker actually had a message in processing
     * - The messageId matches the worker message id
     */
    Confirm(workerId: number, messageId: string): void {
        const workerMessageInProcessing = this.workersMessagesInProcessing.get(workerId);

        if (!workerMessageInProcessing) {
            return;
        }

        const {id, key} = workerMessageInProcessing;
        const isWorkerMessageMatched = id === messageId;

        if (!isWorkerMessageMatched) {
            return;
        }

        this.workersMessagesInProcessing.delete(workerId);
        this.messageKeysInProcessing.delete(key);
    }

    /**
     * Returns the number of messages currently available for processing in the queue
     */
    Size(): number {
        return this.queue.length;
    }
}
