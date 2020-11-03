# Promise 异步处理

### 利用callback 回调

```js
//异步处理  
//通过回调函数 callback
function sum(a,b,callback){
    setTimeout(()=>{
        callback(a+b)
    },300)
}

function getData(){
    //前面两个参数传入对应值，再传入一个回调函数，通过回调函数拿到最终的返回值
    sum(100,200,function(data){
        console.log(data)
    })
}
getData()
```

### 利用 Promise 

- async  await  用法
- async 声明异步方法
- await  等待异步方法的返回值
- await 使用必须是在async 方法中

##### 基础用法

```js
//通过async 可以直接将方法中的返回值变更为一个Promise返回
async function test() {
    return '啦啦啦啦啦';
}
console.log(test());   //Promise { '啦啦啦啦啦' }
```

```js
// async await 连用
async function sum(a,b){
    return a+b;
}
async function getData(){
    var data =await sum(100,300);
    console.log(data);
}
getData();
```

#### Promise 常用方式

```js
// 异步返回promise
// 通过promise 的resolve 取得对应的返回值
async function sum(a,b){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            let sum = a+b;
            resolve(sum);
        },300)
    })
}

async function getData(){
    //await 必须用在async 方法之中
    var data =await sum(100,300);
    console.log(data);
}
getData();
```







































