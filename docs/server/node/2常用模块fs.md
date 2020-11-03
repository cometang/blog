# node 基础篇【常用模块fs 文件操作】

## fs模块常用方法

| 方法名        | 作用               |
| ------------- | ------------------ |
| fs.stat       | 检测是文件还是目录 |
| fs.mkdir      | 创建目录           |
| fs.writeFile  | 创建写入文件       |
| fs.appendFile | 追加文件           |
| fs.readFile   | 读取文件           |
| fs.readdir    | 读取目录           |
| fs.rename     | 重命名  移动文件   |
| fs.rmdir      | 删除目录           |
| fs.unlink     | 删除文件           |
|               |                    |
|               |                    |

#### fs.stat

```js
//检测是文件还是目录
const fs = require('fs')
fs.stat('./html',(err,data)=>{
    if(err){
        console.log(err)
        return;
    }
    //检测是文件还是目录 是的话输出 true
    console.log('文件：'+data.isFile())
    console.log('目录:'+data.isDirectory())
})
```

### fs.mkdir

```js
//创建目录-如果该路径下不存在改目录就进行创建，如有相同目录就报错
const fs = require('fs')
fs.mkdir('./css',(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('创建成功')
})
```

### fs.writeFile

```js
//创建并写入文件
//该文件的目录必须存在，不存在会报错
//如果已经存在该文件，则直接进行文件替换
const fs = require('fs')
fs.writeFile('./html/index.html','你好no1111dejs',(err)=>{
    if(err){
        console.log(err);
        return ;
    }
    console.log('创建./html/index.html 并写入内容成功')
})
```

### fs.appendFile

```js
//追加文件
//该文件的目录必须存在，不存在会报错
//如果不存在该文件，则将创建该文件并写入内容
//如果已经存在该文件，则将本次创建的文件内容 追加到该存在的文件中
// '\n' 换行追加内容
const fs = require('fs')
fs.appendFile('./css/base.css','body{color:red}\n',(err)=>{
    if(err){
        console.log(err)
        return;
    }
    console.log('追加文件成功')
})
```

### fs.readFile

```js
//读取文件
//读取路径如果错误 报错提示路径不存在
const fs = require('fs')
fs.readFile('./html/index.html',(err,data)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log(data);  //拿到十六进制的buffer
    console.log(data.toString());   //拿到对应的字符串
})
```

### fs.readdir

```js
//读取目录
//读取该目录下的所有文件列表，返回类型为数组
const fs = require('fs')
fs.readdir('./css',(err,data)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log(data)
})
```

### fs.rename

```js
//重命名或者移动文件
//操作原始对象必须存在，不存在会报错
//第一个传值为 操作的原始对象 第二个传值：完成操作后的文件对象
const fs = require('fs')
//重命名
fs.rename('./css/base.css','./css/index.css',err=>{    
    if(err){
        console.log(err);
        return;
    }
    console.log('重命名成功')
})
//移动文件--相当于剪切-粘贴
//移动文件的同时可以对文件进行重命名
fs.rename('./css/index.css','./html/index.css',(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('移动文件成功')
})
```

### fs.unlink

```js
//删除文件
//文件地址需要正确的路径，路径不正确会提示删除报错
fs.unlink('./aaa/index.html',(err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('删除文件成功')
})
```

### fs.rmdir

```js
//删除目录
//如果该目录下存在文件，则需先删除所有的文件之后才能进行删除目录
//非空的目录进行删除会报错
const fs = require('fs')
fs.rmdir('./aaa',(err)=>{
    if(err){
        console.log(err)
        return;
    }
    console.log('删除目录成功')
})
```

### 示例1 

```js
// 创建upload目录--完整流程实现
const fs = require('fs')
const path = './upload'
//判断upload 目录/文件 是否存在
fs.stat(path, (err, data) => {
    if (err) {
        //没有找到直接创建
        mkdir(path)
        return;
    }
    if (!data.isDirectory()) {
          //upload 不是目录的情况下先进行删除
          fs.unlink(path, (err) => {
            if (err) {
                console.log('删除失败')
            } else {
                //删除之后进行创建目录
                mkdir(path)
                return;
            }
        })
    } 
})
function mkdir(path) {
    fs.mkdir(path, (err) => {
        if (err) {
            console.log('创建失败')
        }
    })
}
```

### 示例2 npm三方模块实现

```js
//通过三方npm模块 创建目录
// npn install mkdirp --save
//可以支持创建多级目录
const fs = require('fs')
var mkdirp= require('mkdirp')
console.log(mkdirp)
mkdirp('./upload/aaa').then(res=>{
    console.log(res)
})
```

## fs模块进阶--文件流

#### 读取文件流   

```js
const fs = require('fs')
//fs.createReadStream   从文件流读取数据
//fs.createWriteStream  写入文件
let readStream = fs.createReadStream('./aa.txt');
let count =0;   //读取的次数
let str = '';   //读取的数据
//监听并读取数据
readStream.on('data',(data)=>{
    str+=data;
    count++;
})
//读取文件流结束
readStream.on('end',()=>{
    console.log(str);
    console.log(count);
})
//读取文件流报错
readStream.on('error',(err)=>{
    console.log(err);
})
```

#### 文件流写入文件

```js

const fs = require('fs');
let str = '';
for(let i=0;i<500;i++){
    str+='啦啦啦啦啦啦啦啦啦啦啦112221 \n'
}
let createWriteStream = fs.createWriteStream('啦啦.txt');
createWriteStream.write(str);
//标记文件末尾完成
createWriteStream.end()
//标记文件末尾完成之后可以监听写入完成的回调
createWriteStream.on('finish',()=>{
    console.log('写入完成')
})
```



##  fs模块高级-管道流

- pipe  读取流直接进行文件流写入

- 主要用于大文件的复制操作

```js
const fs = require('fs');
//读取文件流
let readStream = fs.createReadStream('./aaa.jpg');
//将要进行写入的文件流
let writeSteam = fs.createWriteStream('./image/a.jpg');
//pipe 直接通过读取的文件流，传入到写入流中-实现管道流
readStream.pipe(writeSteam)
```

































































