## Task description

The code in this repo is not working properly. 

The script `main.ts` is trying to write "a lot" of data into a simulation of a key-value database ( implemented in `Datable.ts`). As Databases usually do - our database has small latency - between 0 to 100 ms per operation. 
In order to allow faster process of the messages our `main.ts` script puts all the operations in a queue (see the `Queue.ts` file). Than it launches a random number (between 3 to 6) of "workers" (see `Worker.ts`), that works asynchronously in parallel, reading messages from the queue and commit the operation to the "Database". Each worker should "confirm" to the queue that the message was proceeded, so the message would be deleted.
The script wait for 10 seconds (enough time for all the workers to complete the work), prints the state of hte queue and the DB state, and exits. 

However! <br />
the results are wrong :( <br /> 
We set all the initial values to 50, and than we add all numbers between 1 to 9 for each item. therefore the correct results so the correct output should be:
```bash
# > ts-node main.ts
Number of items:3
Number of workers:5
Queue size:  0
DB state:
 {
    "item2": 95,
    "item0": 95,
    "item1": 95
}
```


While running the script would look like this (different values would be shown on each run):
```bash
# > ts-node main.ts
Number of items:3
Number of workers:5
Queue size:  0
DB state:
 {
    "item2": 74,
    "item0": 74,
    "item1": 15
}
```

Please assist our dev team to implement a valid version of `Queue.ts`! 

*note*: Any implementation that would effectively not allow any parallel work between the workers would be rejected.

## How to submit

To submit your solution, please follow these guidelines:

1. **Clone this repository to your own GitHub account** and implement your solution
2. **Make changes** either as a PR on a separate branch or directly on main
3. **Document your solution and thinking process** in the README.md or create a new MD file
4. **Don't change the output format** as it makes review more difficult
5. **Don't overengineer the solution** - there's no need to change the structure of the whole codebase - `Queue.ts` is enough. But drop your suggestions in comments if you'd change anything else.
6. **Send the link to your repository** to the provided contact.

We'll evaluate your submission based on correctness, code quality, and your understanding of the concurrency problem.

**NOTE:** Please do not submit PRs to this repo or fork it directly, as then your submissions will be easily visible to other candidates.
