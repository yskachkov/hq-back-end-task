# Points to improve

### General:
* Create separate folders with modules/classes to make it clean, easy to find, and extend. So that each "feature" has its own dedicated place
* Create package.json with all dependencies needed to run a project and README that describes how to do that
* Set up ESLint, prettier, git hooks, and cover with  testing, to improve code quality, readability, and guarantee unified code standards across the project
* Separate concerns to aim at making one thing solve one problem
* Mixing up "async" approach with callbacks and running it in a "sync" manner is hard to troubleshoot and debug, especially with concurrency

### Queue:
* Avoid tight coupling between `Queue` and `Worker`.

  Benefits: Makes easier to test in isolation, allows making `Queue` a more "abstract" entity
* Avoid tight coupling between _product_ `Message` instances and `Queue`

  Benefits: allows processing of different data within a single queue, or/and creating more specific queue implementations for different cases
* Cover with unit tests (will be easier after applying previous steps)

  Benefits: safer refactoring, can be used as basic documentation for code

# Solution

### Problem statement

Once I reviewed all the files for the first time, it wasn't hard to identify the concurrency problem caused by a "race condition" caused by running "async" code in a "sync" manner.
However, it took much time to understand all the relations between all the "modules" and the sequence of processing, as there was no documentation or tests, and the code was quite hard to read and follow.

### Troubleshooting

The first idea that came to my mind was to implement a promise-based queue to guarantee the order of item processing. However, as it wasn't allowed to modify anything apart from `Queue.ts`, that wasn't the case.
Next step, I implemented a mechanism to avoid "race condition" for all messages of a single _product_.
I created a map that used message ids as keys and message data as values. But it didn't work out, as `id` wasn't a _product_ identifier, it contains additional info like actions, timestamps, etc.
I changed the map keys to use _product_ keys instead of ids and tested it.
The last step was to introduce an additional map for workers (there was a hint in the `Confirm` method and how it was used in `Worker.ts`).
Initially, I used worker ids as keys and message (_product_) keys as values, but it didn't work as expected. `Confirm` required a message ID, and there was no way to get a message ID by its key.
Then, I changed the "workers" map to store full message data and created a new set for message keys to quickly identify those in processing and avoid extra traversing.
To verify the solution I performed a couple of testing runs increasing `ITEMS_NUMBER` and `WORKERS_NUMBER` to make sure it works as expected with large data sets.
Finally, I improved typing for `Queue`, which required adding a tsconfig.json file to the project. I moved some parts of the `Dequeue` method into separate methods, covering everything with types as well, and added a generic interface.
Last but not least, I added comments for all the methods describing their "corner" cases.
