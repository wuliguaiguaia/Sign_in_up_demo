# 使用缓存

## 使用Cache-Contorl
测试bg.jpg,form-bg.jpg
```js
response.setHeader('Cache-Control', 'max-age=30000000')
```

## 使用Expires
测试dj.mp3
```js
let date = new Date();
date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000) //保存一年
date = date.toGMTString();
response.setHeader('Expires', date)
```
## 使用Etag
测试 index.html
```js
let md5String = md5(string);
response.setHeader("Etag",md5String);
if(request.headers["If-none-match"] === md5String){
    response.statusCode = 304
}else{
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
}
```
原理：第一次请求时浏览器保存etag，再次请求将etag保存在if-none-match发送给服务器，服务器将两者做对比，相同则不下载，不同则下载

## 使用Last-Modify
测试 main.css,main.js
```js
知识量不足，待续...
```
原理：第一次请求时浏览器保存last-modify，再次请求将 last-modify 保存在 if-modified-since发送给服务器，服务器将两者做对比，相同则不下载，不同则下载






## Appendix:
[http缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching_FAQ)

[cache-control](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)

[expires](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Expires)

[etag](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Etag)

[Last-Modify](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Last-Modified)





