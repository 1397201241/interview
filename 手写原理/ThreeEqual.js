// 实现 (a == 1 && a == 2 && a == 3) 为true

// 重写toString方法，利用对象隐式转换时调用toString()方法的特性
let a = {
  i: 1,
  toString() {
    return this.i++;
  }
}
console.log((a == 1 && a == 2 && a == 3))

// 利用数组隐式转换时调用join方法的特性
let b = [1, 2, 3]
b.join = b.shift
console.log((b == 1 && b == 2 && b == 3))

// 利用defineProperty重新定义对象属性的getter方法
let c = 0;
Object.defineProperty(global, 'd', {
  get: function () {
    return ++c;
  }
})
console.log((d == 1 && d == 2 && d == 3))
