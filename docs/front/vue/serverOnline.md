---
   title: vue项目服务端持续集成部署【自动化部署】
   author: cometang
   date: 2019-11-29
---
# 前言

### 自动化服务端持续集成部署的好处有哪些？

当我们修改一个需求完成后，将最新的代码push到github的时候，我们线上的版本会自动化完成拉取代码，打包构建，重启服务等流程。

通过这种技术我们可以将本地代码一秒完成线上项目的部署与重启。不再需要大量的人力去做上线部署重复的工作。

### 前端为什么要使用自动化服务端持续集成部署？

众所周知，前端的需求经常发生变更及微小的调整，每一次上线需要经历复杂的固定化的流程：修改代码—代码检测—功能实现测试—构建项目—上传构建完成的项目包—线上测试。

稍微大一点的项目更是涉及庞大的用户人群，稍有不慎，就将酿成上线惨案。一到上线日，忙得鸡飞狗跳最后上线的代码还有可能有着种种出乎自己意料的bug。给团队和项目带来不可估量的损失。

自动化服务端持续集成部署就是将以自动化的方式将以前需要人工一步一步实现的上线流程，通过代码自动化来实现，达到项目上线精准无误差的地步。

### 自动化服务端持续集成部署所使用的技术点

- github
- github webhook
- docker
- nginx
- Linux

### 自动化服务端持续集成部署 实现思路

![1574956828126](https://cometang.github.io/vue/1574956828126.png)

# 1.建立后端github代码仓库并在setting中新增webhook
已有项目:vue前端项目(font)；后端项目：（back）  

![1574173350736](https://cometang.github.io/vue/1574173350736.png)

# 2. 配置Linux 系统中项目的运行环境

### 2.1 配置基础环境 CentOS 7.4

```linux
#升级系统内所有的软件与内核
#如果系统内已经有项目在跑的就不要使用这句命令，很高的风险会影响之前的项目环境
yum update

#安装git
yum install git -y

#创建本地git项目下载存放的目录
mkdir /usr/projects

#使用github的ssh 生成ssh免密用户公钥--后面两步直接回车设置为默认空
# -t指定加密算法为rsa  -b指定大小为4096字节  -c指定github账号邮箱地址
ssh-keygen -t rsa -b 4096 -C "1403029829@qq.com"

#查看已经生成的公钥地址
cat /root/.ssh/id_rsa.pub

```

### 2.2 拉取项目代码到服务器上

```Linux
#找到项目根目录
cd /usr/projects/

#克隆后端代码
#注意：clone的时候会提醒是否确认克隆，一定要输入yes
git clone git@github.com:cometang/back.git

#克隆前端代码
git clone git@github.com:cometang/font.git

```

### 2.3 安装项目代码运行环境

```Linux
#安装nvm node 版本管理工具
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

#将nvm配置到服务器环境变量中
./root/.bashrc

#nvm安装最新的node稳定版
nvm install stable

#nvm安装node版本 11.11.0 【我本地开发所使用的node版本】
nvm install 11.11.0

#安装nrm切换npm的安装源，一般国内服务器切换为淘宝镜像
npm install nrm -g



#nvm 命令使用含义
#查看本地已经下载的所有node版本
nvm list 
#切换node版本
nvm use 11.11.0
#查看node版本
node -v
#查看npm版本
npm -v

```

### 2.4 配置阿里云服务器的安全组策略

开放后端端口：3000  前端端口：8080    webhook端口：4000

![1574178877389](https://cometang.github.io/vue/1574178877389.png)  

### 2.5 配置docker运行环境

docker仓库中有各种软件的镜像地址 

```Linux
#安装centos的yum-utils工具包
yum install yum-utils device-mapper-data lvm2

#设置docker的yum安装源为阿里云的地址
yum-config-manager \
  --add-repo \
  https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
  
#安装社区免费版docker
yum install -y docker-ce docker-ce-cli containerd.io

#查看docker版本
docker -v

#设置docker软件源安装地址为阿里云地址
#新建docker文件夹
mkdir -p /etc/docker

#设置安装源地址为阿里云的地址[把下面的josn对象文本写入到json文件中]
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors":["http://fwvjnv59.mirror.aliyuncs.com"]
}
EOF

#重置所有修改过的配置文件
systemctl daemon-reload
systemctl restart docker

#切换源为淘宝镜像地址
nrm use taobao 

```

### 2.6 开始运行项目

```Linux
#进入back项目根目录
cd back
npm install 
#启动服务
npm start 
```

#### 2.6.1 在本地浏览器访问后端接口地址

我的接口地址：http://47.99.192.199:3000/api/users

![1574178979135](https://cometang.github.io/vue/1574178979135.png)

#### 2.6.2 运行前端项目

新建立一个连接，不要关闭后端服务，注意修改前端项目中的接口地址为服务器公网ip

```Linux
#进入font项目根目录中
cd /usr/projects/font
npm install 
npm run serve

```

在本地浏览器中访问前端项目：IP地址：8080

![1574179434668](https://cometang.github.io/vue/1574179434668.png)



# 3.配置webhook

### 3.1配置github中前端以及后端项目的webhook服务与连接密码

前后端两个项目保持一致

注意：连接密码的配置一定要与webhook项目中的密码保持一致

![1574261285740](https://cometang.github.io/vue/1574261285740.png)

### 3.2新建webhook的 github仓库并提交

![1574262329749](https://cometang.github.io/vue/1574262329749.png)

### 3.3将webhook 代码克隆到服务器中 路径放在与 前后端代码同级根目录下

```Linux
cd /usr/projects/
git clone git@github.com:cometang/webhook.git
cd webhook
npm install 
node webhook
```

![1574262970197](https://cometang.github.io/vue/1574262970197.png)

### 3.4 测试webhook是否可以使用

修改前端后端项目代码后提交代码到github 查看服务器是否会提醒代码更新

```js
//webhook.js 
//测试连接github是否能够检测到代码更新并向webhook服务发送请求并【非完整版代码】
let http = require('http');
let server = http.createServer(function (req, res) {
    //判断github发送的是不是post 是不是webhook发送的请求
    console.log('检测到前端后端代码更新，github发来的请求信息如下：')
    console.log(req.method,req.url);
    if (req.method == 'POST' && req.url == '/webhook') {
        //设置github请求的请求头，设置返回数据的格式为json
        res.setHeader('Content-Type', 'application/json');
        //返回通知github请求已经成功
        res.end(JSON.stringify({ok:true}));
    } else {
        res.end('NOT Found');
    }
})
server.listen(4000, () => {
    console.log('webhook服务已经在4000端口启动');
})
```

当前端或者后端代码提交后webhook收到github的post请求--相当于消息推送

![1574264924352](https://cometang.github.io/vue/1574264924352.png)

### 3.5 安装npm2插件让webhook持久监控

关掉服务器连接之后webhook服务会自动断开，为了使得webhook持久化检测，安装pm2,当node服务断开之后，pm2会自动重启node服务

```Linux
npm install pm2 -g
```

#### 3.5.1 修改webhook代码中的启动服务命令

修改完成后重新提交代码到github,服务器重新将webhook代码pull即可

```js
//package.json
 "scripts": {
    "start":"pm2 start ./webhook.js --name webhook --watch",
    "stop":"pm2 stop webhook"
  },
```

在服务器webhook根目录pull完代码之后使用  npm start  实现通过pm2重新启动webhook服务

```Linux
npm start 
```

![1574433631451](https://cometang.github.io/vue/1574433631451.png)

### 3.6 测试pm2与webhook服务

1.查看pm2 日志【可以查看到所有关于提交的前后端两个项目的代码日志】

```Linux
pm2 logs
```

![1574433784580](https://cometang.github.io/vue/1574433784580.png)

2.提交前后端两个项目的代码到github，测试是否能够检测到提交

![1574434003996](https://cometang.github.io/vue/1574434003996.png)

# 4 重写webhook.js 完成对github请求的身份验证

```js
//webhook.js
let http = require('http');
let cryto = require('crypto');
let SECRET = '123456';  //与在前后端项目github中设置的Secret相同
//生成签名算法
//根据SECRET字符串使用哈希算法生成十六进制的新的字符串
function sign(body) {
    return `sha1=` + cryto.createHmac('sha1', SECRET).update(body).digest('hex')
}
let server = http.createServer(function (req, res) {
    //判断github发送的是不是post 是不是webhook发送的请求
    console.log('检测到前端后端代码更新，github发来的请求信息如下：')
    console.log(req.method, req.url);
    if (req.method == 'POST' && req.url == '/webhook') {
        //拿到github传递过来的参数--对请求的github进行简单的验证
        let buffers = []
        req.on('data', function (buffer) {
            buffers.push(buffer)
        })
        req.on('end', function (buffer) {
            let body = Buffer.concat(buffers)
            //github传的值请求事件类型：push事件
            let event = req.headers['x-github-event']
            //github传递了请求体body,同时传递了签名，需要验证签名是否正确
            let signatrue = req.headers['x-hub-signatrue']
            if (signatrue !== sign(body)) {
                //sign不相等 直接返回错误
                return res.end('Not Allowed')
            }
            //sign相同 执行同意请求
            //设置github请求的请求头，设置返回数据的格式为json
            res.setHeader('Content-Type', 'application/json');
            //返回通知github请求已经成功
            res.end(JSON.stringify({ ok: true }));
        })
    } else {
        res.end('NOT Found');
    }
})

server.listen(4000, () => {
    console.log('webhook服务已经在4000端口启动');
})
```

# 5.快速部署脚本编写

在webhook项目的跟目录下写项目的快速部署 快速集成的脚本

### 5.1 后端项目构建 

- 在webhook项目的跟目录下 新建back.sh 后端项目的快速部署脚步

```sh
#!/bin/bash 
#后端项目快速构建脚本
#后端项目路径
WORK_PATH = '/usr/projects/back'
cd $WORK_PATH
echo "先清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取新代码"
git pull origin master
echo "开始执行构建后端项目:back为docker镜像名称 1.0为版本号"
docker build -t back1.0 .
echo "停止旧容器 并删除旧容器"
docker stop back-container
docer rm back-container
echo "启动新容器"
docker container run -p 3000:3000 --name back-container -d back1.0
```

- 在后端项目back 跟目录下新建文件：Dockerfile    以及 dockerignore 

对docker进行配置，生成项目镜像

注意：在back项目中的gitignore里面不要写 Dockerfile dockerignore

```docker
FROM node
LABEL name = "back"
LABEL version ="1.0"
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD npm start
```

- 性能优化，去掉docker制作镜像时不需要的文件，dockerignore 

```node
.gitignore
Dockerfile
node_moudules
```

- 提交后端代码 与webhook代码，并在服务器中各自项目跟目录进行拉取

### 5.2测试docker自动构建

拉取完成后端代码和webhook最新代码后，在服务器webhook项目根文件夹下执行命令查看是否能够成功构建：sh back.sh

```Linux
sh back.sh
```

#### 注意：这里有时会出现docker 服务没有找到的提示

```Linux
#提示报错信息
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

#解决方案：在webhook项目跟目录下运行一下命令，然后重新运行 sh back.sh即可：
sudo systemctl start docker
```

出现最后的下载构建的列表 表示启动docker服务成功，开始构建

![1574691720015](https://cometang.github.io/vue/1574691720015.png)

验证是否docker 服务是否成功拉取最新代码并完成自启动

```Linux
curl http://localhost:3000/api/users
```

图片中的报错信息是因为没有新的版本可以拉取，所以报错，可略过

![1574695148206](https://cometang.github.io/vue/1574695148206.png)

第二次使用 sh back.sh 就可以实现完整的后端服务自动化构建，自动化部署的过程

![1574777210025](https://cometang.github.io/vue/1574777210025.png)

新容器启动后通过浏览器直接可以访问更新的接口地址：IP:端口/接口名，我的接口地址为：http://47.99.192.199:3000/api/users；乱码的原因是因为json数据直接放到网页转码的问题，用前端接口请求用在渲染到网页就没有这种乱码了。自此后端项目自动化持续集成部署已经全部完成。

![1574777277009](https://cometang.github.io/vue/1574777277009.png)

### 5.3 部署前端项目自动构建脚本

后端项目已经部署完成，下面部署稍微复杂的前端项目。

#### 5.3.1 在webhook项目跟目录下新建font.sh文件作为前端项目的脚本

```sh
#!/bin/bash 
WORK_PATH='/usr/projects/font'
cd $WORK_PATH
echo "先清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取新代码"
git pull origin master
echo "编译build"
npm run build
echo "开始执行构建后端项目:back为docker镜像名称 1.0为版本号"
docker build -t font:1.0 .
echo "停止旧容器 并删除旧容器"
docker stop font-container
docker rm font-container
echo "启动新容器"
docker container run -p 80:80 --name font-container -d font:1.0
```

#### 5.3.2 在前端项目font根目录下新建Dockerfile文件

```dockerfile
From nginx
LABEL name = "font"
LABEL version ="1.0"
COPY ./dist /usr/share/nginx/html
COPY ./font.conf  /etc/nginx/conf.d
EXPOSE 80

```

#### 5.3.3 在前端项目font跟目录下新建 font.config 文件，用来配置服务器的nginx服务

```nginx
server{
    listen 80;
    server_name 47.99.192.199;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://47.99.192.199:3000;
    }
}
```

#### 5.3.4 前端服务需要nginx服务器支撑，在服务器中安装nginx

```Linux
yum install nginx -y
```

#### 5.3.5 提交webhook与最新的前端font代码到github

注意：前端代码的.gitignore文件不要排除Dockerfile  .Dockerfileignore文件

#### 5.3.6 在服务器的webhook项目跟目录下拉取webhook最新代码,然后运行 sh font.sh

在服务器webhook目录下执行 sh font.sh后会自动去拉取前端最新代码，并自动构建bulid

```npm
git pull origin marster
```

```Linux
sh font.sh
```

![1574783443299](https://cometang.github.io/vue/1574783443299.png)

#### 5.3.7 访问前端地址 ip:80

![1574953705653](https://cometang.github.io/vue/1574953705653.png)

#### 5.3.8 修改webhook.js文件，判断是前端项目请求还是后端项目请求，并创建子进程自动执行对应项目的sh脚本文件，最终完成自动拉取，构建流程。

完成webhook.js代码后提交到服务器，在服务器webhook项目中pull最新的webhook配置代码

```js
//webhook.js 完整版代码
let http = require('http');
let cryto = require('crypto');
let { spawn } = require('child_process'); //开启部署的子进程

let SECRET = '123456';  //与在前后端项目github中设置的Secret相同
//生成签名算法
//根据SECRET字符串使用哈希算法生成十六进制的新的字符串
function sign(body) {
    return `sha1=` + cryto.createHmac('sha1', SECRET).update(body).digest('hex')
}
let server = http.createServer(function (req, res) {
    //判断github发送的是不是post 是不是webhook发送的请求
    console.log('检测到前端后端代码更新，github发来的请求信息如下：')
    console.log('req----hedaers')
    console.log(req.headers['x-github-event'])
    console.log(req.method, req.url);
    if (req.method == 'POST' && req.url == '/webhook') {
        //拿到github传递过来的参数--对请求的github进行简单的验证
        let buffers = [];
        req.on('data', function (buffer) {
            buffers.push(buffer);
        })
        req.on('end', function (buffer) {
            let body = Buffer.concat(buffers);
            //github传的值请求事件类型：push事件
            let event = req.headers['x-github-event'];
            //github传递了请求体body,同时传递了签名，需要验证签名是否正确
            let signatrue = req.headers['x-hub-signature'];
            if (signatrue !== sign(body)) {
                //sign不相等 直接返回错误
                return res.end('Not Allowed');
            }
            //sign相同 执行同意请求
            //设置github请求的请求头，设置返回数据的格式为json
            res.setHeader('Content-Type', 'application/json');
            //返回通知github请求已经成功
            res.end(JSON.stringify({ ok: true }));

            //自动化部署
            if (event == 'push') {
                let payload = JSON.parse(body);
                let name = './' + payload.repository.name + '.sh'
                //开启子进程自动执行对应的sh部署脚本，提交back就执行 sh back.sh 的子进程
                let child = spawn('sh', [name])
                //打印操作日志
                //每当子进程有日志输入的时候，就抛出一个日志，最后一次性输出整个更改日志
                let buffers = []
                child.stdout.on('data', function (buffer) {
                    console.log('启动子进程')
                    buffers.push(buffer)
                })
                child.stdout.on('end', function (buffer) {
                    let log = Buffer.concat(buffers)
                    console.log(log)
                })
            }
        })
    } else {
        res.end('NOT Found');
    }
})

server.listen(4000, () => {
    console.log('webhook服务已经在4000端口启动');
})

```



# 6删除目前已经存在的所有旧容器，并重启 pm2 logs 查看日志文件，完成整体测试

注意：命令中的单引号及单引号中的内容需要更换为对应的container(容器名)

```Lniux
docker container ps
docker container rm 'container_name'  'container_name' -f 
```

![1574954368167](https://cometang.github.io/vue/1574954368167.png)

### 6.1 重启服务，打开pm2日志

```Linux
npm run stop
npm run start 
pm2 logs
```

![1574954700353](https://cometang.github.io/vue/1574954700353.png)

### 6.2 修改前端及后端代码并提交到github，前端服务，后端服务都会自动进行拉取，构建。

服务器自动启动子进程对相应项目完成构建，并变更输出日志

![1574954959050](https://cometang.github.io/vue/1574954959050.png)



# 7. 上面6个步骤完成之后 可断开xshell 连接，每次的本地代码提交，对应项目的线上版本都会自动完成拉取，构建，提交最新代码到github后，两分钟左右线上版本即可完成更新

完整项目配置代码地址：
- 前端font: https://github.com/cometang/font.git
- 后端back: https://github.com/cometang/back.git
- webhook：https://github.com/cometang/webhook.git


# 8.附加配置：当新代码推送到服务器后，通过发送email的方式来提醒项目已经更新

注意：邮件方式暂时不写，后续有时间再贴代码，具体实现思路：在webhook中引入 sendMail ，在构建成功之后发送通知邮件到指定的邮箱地址即可。

