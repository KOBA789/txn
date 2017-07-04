class Tuple<T> {
  constructor(public attrs: T) { }
}

interface Criteria<T> {
  isMatched(attrs: T): boolean;
}

class EqualCriteria<T, A extends keyof T> implements Criteria<T> {
  constructor(private attr: keyof T, private value: T[A]) { }

  isMatched(attrs: T) {
    return attrs[this.attr] === this.value;
  }
}

class AnyCriteria implements Criteria<any> {
  isMatched(attrs: any) {
    return true;
  }
}

class Database<T> {
  private tuples: Tuple<T>[] = [];
  constructor() { }

  select(criteria: Criteria<T>) {
    return this.tuples.
      filter((tuple) => criteria.isMatched(tuple.attrs)).
      map(({ attrs }) => attrs);
  }

  update<A extends keyof T>(criteria: Criteria<T>, attr: A, newValue: T[A]) {
    for (const tuple of this.tuples) {
      if (criteria.isMatched(tuple.attrs)) {
        tuple.attrs[attr] = newValue;
      }
    }
  }

  insert(attrs: T) {
    this.tuples.push(new Tuple(attrs));
  }
}

const db = new Database<{ key: string, value: number }>();

db.insert({ key: 'alice', value: 1000 });
db.insert({ key: 'bob', value: 500 });
console.log(db.select(new AnyCriteria()));
db.select(new EqualCriteria('key', 'alice'));
