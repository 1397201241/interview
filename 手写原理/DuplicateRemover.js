// 数组去重

// 1.通过es6的Set对象里边元素的唯一性
// 也可以衍生利用Map的key值唯一性去实现
function bySet(arr) {
  // return [...new Set(arr)]
  return Array.from(new Set(arr))
}

// 2.通过数组下标判断
function byIndexOf(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (i !== arr.indexOf(arr[i])) {
      arr.splice(i, 1);
      i--;
    }
  }
}

// 3.通过数组的filter方法
function byFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index)
}