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
