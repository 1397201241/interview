const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  // 私有属性和方法
  #state = PENDING;
  #result = undefined;
  #changeState(state, data) {
    if (this.#state !== PENDING) return;
    this.#state = state;
    this.#result = data;
    this.#run();
  }
  constructor(executor) {
    const resolve = (data) => {
      this.#changeState(FULFILLED, data);
    }
    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    }

    try {
      executor(resolve, reject);
    } catch(err) {
      reject(err);
    }
  }
  // 静态方法，可直接调用，不需要实例化
  static resolve(data) {
    return new MyPromise((resolve, reject) => {
      resolve(data);
    })
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    })
  }

  #handler = [];
  #runOne(fn, resolve, reject) {
    try {
      let onFulfilledHandlerType = Object.prototype.toString.call(fn).slice(8, -1);
      let res = onFulfilledHandlerType === "Function" ? fn(this.#result) : this.#result;
      resolve(res);
    } catch (e) {
      reject(e);
    }
  }
  #run() {
    if (this.#state === PENDING) return;
    if (this.#handler.length) {
      let {onFulfilledHandler, onRejectedHandler, resolve, reject} = this.#handler.shift();
      if (this.#state === FULFILLED) {
        this.#runOne(onFulfilledHandler, resolve, reject)
      } else if (this.#state === REJECTED) {
        this.#runOne(onRejectedHandler, resolve, reject);
      }
    }
  }
  // 原型方法，需要实例化
  then(onFulfilledHandler = undefined, onRejectedHandler = undefined) {
    return new MyPromise((resolve, reject) => {
      this.#handler.push({onFulfilledHandler, onRejectedHandler, resolve, reject});
      this.#run();
    })
  }
  catch(onRejectedHandler) {
    return this.then(undefined, onRejectedHandler);
  }
}


let p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  })
})
p1.then(22).then(res => {
  throw 232;
}).catch(e => {
  console.log(e);
}).then(res => {
  console.log(res);
})
