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
  #runOne(callback, resolve, reject) {
    // 传入的不是一个回调函数，则传递上一个Promise
    if (typeof callback !== "function") {
      const settled = this.#state === FULFILLED
        ? resolve : reject;
      settled(this.#result);
      return;
    }
    // 回调函数的返回
    try {
      const data = callback(this.#result);
      // 回调函数返回的是一个Promise对象
      // todo:判断一个对象满不满足Promise A+规范
      if (data && data.then) {
        data.then(resolve, reject);
      } else {
        resolve(data);
      }
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
  // 返回一个新的Promise，并在上一个Promise状态敲定的时候执行对应的回调处理函数，并敲定新的Promise对象的状态
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
p1.then(22)
  .then(res => {
  console.log(res, "res")
  throw 232;
}).then(1, (res) => {
  console.log(res, "失败了");
  // return "hello";
}).then( (res) => {
    console.log(res, "默认");
  })
