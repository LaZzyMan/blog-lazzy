---
title: Nginx配置前后端分离Web App
tags: 
- nginx

date: '2018-03-15 20:02:56'

category: Development
image:
---


Web App的前后端分离主要在于以下几点：
- 前端直接使用nodejs搭建本地服务器(例如使用webpack server)，在本地模拟x线上运行环境，只通过调用api接口向后台请求服务，而不采用网页模板绑定后台数据的方式。
- 后台服务器负责与主机数据库建立连接，向前端提供api接口。一方面实现了后端程序完全不涉及网页页面，并且数据库只接受本地用户（即后端程序)连接操作，保证了数据的安全性。
- 由统一的代理服务器（如Nginx、Apache）代理前端和后台服务器，并进行权限控制和负载均衡。

----
### uWSGI
Django和flask框架都提供了自己的WSGIg工具，例如，flask依赖于Werkzeug，但是python web框架的WSCI只能用于调试环境，由于要实现热加载，不能保证稳定和高效运行，因此需要uWSGI作为后台服务的应用网关。

安装：`$ pip intall uwsgi`

配置：
```ini
# projectname_uwsgi.ini
# app folder
base = /var/www/<projectname>

# python module to import
app = hello
module = %(app)

# python virtualenv dir
home = %(base)/venv

# python file excution dir
pythonpath = %(base)

# socket file's location
socket = /var/www/<projectname>/%n.sock

# permissions for the socket file
chmod-socket = 666

#the variable that holds a application
callable = app

# location of log files
logto = /var/log/<projectname>/%n.log
```

用于对接Nginx服务器，因此只需要指定创建socket，不需要配置https参数，此外，还可以配置processes和thread参数实现进线程控制。

开启uWSGI：`$ uwsgi --ini <inifilename>`

详细配置参数参考：[官方文档][0]

----
### Nginx
Nginx用来同时对前后端程序进行反向代理，它占用http端口进行监听，接受外部访问所有请求，再根据配置信息将访问请求转发到处理进程。这一思路可以实现分布式服务器和负载均衡，这里只是利用nginx进行简单的针对前后端程序的请求分发。

安装nginx后首先要删除默认配置文件：`rm /etc/nginx/sites-enabled/default`

再项目目录下新建一个配置文件：
```conf
server{
    listen 80;
    server_name loaclhost;
    charset utf-8;
    client_max_body_size 75M;
    client_header_buffer_size 16k;
    large_client_header_buffers 4 64k;
    # 设置针对前端app访问的分发
    location /<font_end_app_name>/ {
        # webpack server运行的本地URL
        proxy_pass http://127.0.0.1:8080;
    }
    # 设置针对后端app访问的分发
    location /<backend_name>/ {
        include uwsgi_params;
        # 传递给uwsgi的命令参数
        uwsgi_pass
        unix:/var/www/<backend_folder>/<backend_app_name>.sock;
    }
}

```

nginx也提供了http-auth功能，可以分别对前后端程序进行访问控制，不过也可以选择在程序中自主实现。

将项目目录下的配置文件连接到nginx配置文件夹：

`$ sudo ln -s <filename> /etc/nginx/conf.d/`

重新启动Nginx即可生效：`$ sudo service nginx restart`

详细配置参数参考：[官方文档][1]

----
### Supervisor
用Supervisor管理的进程，当一个进程意外被杀死，supervisort监听到进程死后，会自动将它重新拉起，很方便的做到进程自动恢复的功能，不再需要自己写shell脚本来控制。

配置：
```conf
[program:backend]

command=uwsgi --ini /var/www/<uwsgi_inifilename>
directory=/var/www/<appname>/
user=root
autostart=true
autorestart=true
startsecs=10
startretries=10
stdout_logfile=/var/log/uwsgi/supervisor_backend.log
stdout_logfile_maxbytes = 50MB
stderr_logfile=/var/log/uwsgi/supervisor_backend_err.log
stderr_logfile_maxbytes = 50MB

[program:fontend]

command=webpack-sever start
directory=/var/www/<appname>/
user=root
autostart=true
autorestart=true
startsecs=10
startretries=10
stdout_logfile=/var/log/uwsgi/supervisor_fontend.log
stdout_logfile_maxbytes = 50MB
stderr_logfile=/var/log/uwsgi/supervisor_fontend_err.log
stderr_logfile_maxbytes = 50MB
```

配置完成后，开启服务：
```shell
$ sudo supervisord -c supervisor.conf
$ sudo supervisorctl start all
```
将all替换为program名称可以单独操作某个进程，基本命令包括：status，load，start，stop

详细配置参数参考：[官方文档][2]

[0]:[http://uwsgi-docs.readthedocs.io/en/latest/]
[1]:[http://www.nginx.cn/doc/]
[2]:[http://supervisord.org/configuration.html]