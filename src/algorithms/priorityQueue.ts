/**
 * Min-Priority Queue implemented using a Binary Heap.
 * Supports efficient O(log N) insertion and extraction.
 * Includes optional secondary tie-breaker comparator (e.g. for lower h in A*).
 */

export interface PriorityQueueItem<T> {
  element: T;
  priority: number;
  secondaryPriority?: number; // e.g. h-score for tie-breaking in A*
}

export class MinPriorityQueue<T> {
  private heap: PriorityQueueItem<T>[] = [];

  constructor() {
    this.heap = [];
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): PriorityQueueItem<T> | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  public enqueue(element: T, priority: number, secondaryPriority: number = 0): void {
    const item: PriorityQueueItem<T> = { element, priority, secondaryPriority };
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  public dequeue(): T | null {
    if (this.isEmpty()) return null;

    const min = this.heap[0].element;
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }

    return min;
  }

  public clear(): void {
    this.heap = [];
  }

  /**
   * Compares two items. Returns true if item A has higher priority (lower value) than item B.
   * If primary priorities are equal, uses secondaryPriority (e.g. lower h in A*).
   */
  private isHigherPriority(a: PriorityQueueItem<T>, b: PriorityQueueItem<T>): boolean {
    if (a.priority === b.priority) {
      // Secondary tie-breaker: lower secondaryPriority wins
      return (a.secondaryPriority ?? 0) < (b.secondaryPriority ?? 0);
    }
    return a.priority < b.priority;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.isHigherPriority(this.heap[index], this.heap[parentIndex])) {
        // Swap
        const temp = this.heap[index];
        this.heap[index] = this.heap[parentIndex];
        this.heap[parentIndex] = temp;
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private sinkDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < length &&
        this.isHigherPriority(this.heap[leftChild], this.heap[smallest])
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < length &&
        this.isHigherPriority(this.heap[rightChild], this.heap[smallest])
      ) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        const temp = this.heap[index];
        this.heap[index] = this.heap[smallest];
        this.heap[smallest] = temp;
        index = smallest;
      } else {
        break;
      }
    }
  }
}
