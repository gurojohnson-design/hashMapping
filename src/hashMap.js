import { linkedList } from "../../linked-lists/src/linkedList.js";

export class hashMap {
    constructor(size = 16) {
        this.capacity = 0;
        this.buckets = new Array(size).fill(null);
        this.loadFactor = this.capacity / this.buckets.length;
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * hashCode + key.charCodeAt(i);
        }

        return hashCode % this.buckets.length;
    }

    // reHash() when buckets increase reassign values
    reHash() {
        const oldBuckets = this.buckets;
        this.buckets = new Array(oldBuckets.length * 2).fill(null);
        this.capacity = 0;
        this.loadFactor = this.capacity / this.buckets.length;

        oldBuckets.forEach((bucket) => {
            if (bucket) {
                let current = bucket.head;
                while (current) {
                    this.set(current.key, current.value);
                    current = current.next;
                }
            }
        });
    }

    // takes key and value, checks if key exists and updates value
    set(key, value) {
        if (this.loadFactor > .75) {
            this.reHash();
        }

        let index = this.hash(key);

        if (!this.buckets[index]) {
            this.buckets[index] = new linkedList();
        }

        let bucket = this.buckets[index];

        if (bucket.containsKey(key)) {
            let current = bucket.head;
            while (current) {
                if (current.key === key) {
                    current.value = value;
                    break;
                }
                current = current.next;
            }
        } else {
            bucket.append(value, key);
            this.capacity++;
            this.loadFactor = this.capacity / this.buckets.length;
        }
    }

    // get(key) returns value at given key-- or returns null
    get(key) {
        const index = this.hash(key);
        if (this.buckets[index]) {
            let current = this.buckets[index].head;
            while (current) {
                if (current.key === key) return current.value;
                current = current.next;
            }
        }
        return null;
    }

    // has(key) returns true or false if key is in hashmap
    has(key) {
        const index = this.hash(key);
        if (!this.buckets[index]) return false;
        return this.buckets[index].containsKey(key);
    }

    // remove(key) finds key and removes it -- returns true or false
    remove(key) {
        const index = this.hash(key);
        const bucket = this.buckets[index];
        if (!bucket) return false;

        let current = bucket.head;
        let prev = null;
        while (current) {
            if (current.key === key) {
                if (prev) {
                    prev.next = current.next;
                } else {
                    bucket.head = current.next;
                }
                this.capacity--;
                this.loadFactor = this.capacity / this.buckets.length;
                return true;
            }
            prev = current;
            current = current.next;
        }
        return false;
    }

    // length() returns number of keys
    length() {
        return this.capacity;
    }

    // clear() removes all entries in hashmap
    clear() {
        this.capacity = 0;
        this.buckets = [];
        this.buckets.length = 16;
        this.buckets.fill(null);
        this.loadFactor = this.capacity / this.buckets.length;
    }

    // keys() returns array of all the keys
    keys() {
        const keyArray = [];
        this.buckets.forEach((bucket) => {
            if (bucket) {
                let current = bucket.head;
                while (current) {
                    keyArray.push(current.key);
                    current = current.next;
                };
            };
        });
        return keyArray;
    }

    // values() returns array of all the values
    values() {
        const valueArray = [];
        this.buckets.forEach((bucket) => {
            if (bucket) {
                let current = bucket.head;
                while (current) {
                    valueArray.push(current.value);
                    current = current.next;
                };
            };
        });
        return valueArray;
    }

    // entries() returns an array of the key value pairs
    entries() {
        const entryArray = [];
        this.buckets.forEach((bucket) => {
            if (bucket) {
                let current = bucket.head;
                while (current) {
                    entryArray.push([`${current.key}`, `${current.value}`]);
                    current = current.next;
                };
            };
        });
        return entryArray;
    }
}