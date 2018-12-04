# 更新
## 更新---->使用 session

1.设置全局变量 sessions
```js
let sessions = {};
```
2.登录时使用随机数保存用户信息
```js
let sessionId = Math.random()*10000000; //安全是用随机数保证的
sessions[sessionId] = {sign_in_name:name};
response.setHeader("Set-Cookie",`sessionId=${sessionId}`)
```
3.获取cookie找到sessionId更新页面
```js
// 1. 将cookie的数据保存在hash
// 2. 获取用户信息
let mySession = sessions[hash.sessionId]; 
let name;
if(mySession){
    name = mySession.sign_in_name;
}
        
// 3.判断用户是否存在
let users = fs.readFileSync("./db","utf8");
users = JSON.parse(users);
let  flag = false;
for(let i=0;i<users.length;i++){
    console.log(users[i]);
    
    if(users[i].name === name){
        flag = true;
        break;
    }
}
// 4. 如果存在,更新页面
if(flag){
    string = string.replace('__personName___', name);
}
```
什么是session？

服务器通过cookie给用户一个sessionId，sessionId对应服务器里面的一小块内存，每次用户通过服务器访问的时候，服务器通过sessionId去读取用户的session，知道用户的隐私信息。
