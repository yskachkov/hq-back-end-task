# senior-be-developer-task

## Introduction 
Hello! If you are viewing this repository you are probably a candidate for HyperGuest senior backend developer, congrats!

Before we begin, a few important notes please!
* Any AI tool is forbidden during this task. We already know Github copilot is a great tool, we don't need to test it :) 
* This task is designated to test your problem-solving skills, still, code quality do matters! submit a code you would like to read as well
* At your sumption please include the next things :
    -  your implementation of `Queues.ts`. Any other files are not allowed to be changed during this test.
    -  write a clear explanation of your implementation.
    -  suggest improvements! the code in this repository is not perfect, what would you do differently?
* Do not PR to this repo! if you would, all of your opponents would copy your answers ;)

Good luck!

## Task description

The code in this repo is not working properly. 

The script `main.ts` is trying to write "a lot" of data into a simulation of a key-value database (`Datable.ts`). As Databases usually do - our database has small latency - between 0 to 100 ms per operation. 
In order to allow faster the process of the messages our `main.ts` script puts everything in a queue (see the `Queue.ts` file) and launches 3 "workers" (see `Worker.ts`), that works in parallel, reading messages from the queue and inserts it into the "Database". Each worker should "confirm" to the queue that the message was proceeded, so the Queue would know the message can be deleted. The script wait for 10 seconds (enough time for all the workers to complete the work), prints the state of hte queue and the DB state, and exits. 

However! the results are wrong :(
We set all the initial values to 50, and than we add all numbers between 1 to 9 for each item. therefore the correct results so the correct output should be:
```bash
# > ts-node main.ts
Queue size:  33
started worker 0
started worker 1
started worker 2
Queue size:  0
DB state:
 {
    "A": 95,
    "B": 95,
    "C": 95
}
```


However, running it you would see something like hte next output:
```bash
# > ts-node main.ts
Queue size:  33
started worker 0
started worker 1
started worker 2
Queue size:  0
DB state:
 {
    "A": 83,
    "C": 91,
    "B": 26
}
```
Not only that, it would even return different results at each run. 

Please assist our dev team to implement a valid version of `Queue.ts`! 

*note*: Any implementation that would effectively not allow any parallel work between the workers would be rejected.