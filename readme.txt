從node的官網下載nodejs進行安装。

安装完成之後，在命令提示字元執行node -v查看一下node版本：

$ node -v
v6.9.3
如果能夠成功輸出版本，說明nodejs已經安裝成功，接下來安裝http-server，在在命令提示字元執行 npm install -g http-server。

安装完成之後，在專案資料夾下執行http-server

$ http-server
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
Hit CTRL-C to stop the server
用瀏覽器打開 http://127.0.0.1:8080 。