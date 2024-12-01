import { Database, Operations, Message } from "./Database"
import { Queue } from "./Queue"
import { range, sleep } from "./Util"
import { Worker } from "./Worker"

const ITEMS = ["A", "B", "C"]

const applyToAll = (queue: Queue, operation: Operations, val: number): void => {
    for (const product of ITEMS) {
        queue.Enqueue(new Message(
            product,
            operation,
            val
        ))
    }
}

const main = async () => {
    const db = new Database()
    const queue = new Queue()
    applyToAll(queue, Operations.SET, 50)
    for (let i = 0; i < 10; i++) {
        applyToAll(queue, Operations.ADD, i)
    }

    console.log("Queue size: ", queue.Size())
    range(3).forEach(i => {
        const worker = new Worker(i, queue)
        worker.Work(db.set)
        console.log(`started worker ${i}`)
    })
    await sleep(10000)
    console.log("Queue size: ", queue.Size())
    console.log("DB state:\n", JSON.stringify(db.state(), null, 4))
}
main()