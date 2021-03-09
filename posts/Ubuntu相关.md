---
title: Ubuntu相关
tags: 
- Ubuntu

date: '2017-06-22 18:19:33'

category: Development
image:
---


记录一些Ubuntu服务器使用中遇到的问题和解决方法

----
### 默认Python版本切换
Ubuntu系统自带Python2.7，自己安装了python3之后，默认的优先级一般为：

python2.7.x > python3.5.x > python3.6.x

例如，如果同时安装了以上三个版本，shell输入python会默认为python2.7，输入python3会默认为python3.5，想要使用python3.6需要输入python3.6.

切换系统中python版本:
```shell
$ update-alternatives: using /usr/bin/python2.7 to provide /usr/bin/python (python) in auto mode
```
或者：
```shell
$ update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1
```
update-alternatives对于python这一命令所对应的可执行程序赋予不同的优先级
```shell
$ update-alternatives --config python
```
根据命令行中的提示设置默认版本即可

----
### 命令行操作
```shell
# 系统升级
apt-get upgrade
# 更新软件信息(安装软件遇到问题先输一下)
apt-get update
# 安装和卸载
apt-get install <name>
apt-get remove <name>
# 内存使用
free -m
# 查看端口占用
netstat -a
lsof -i:<port>
# 结束进程
kill -9 <pid>
# 建立连接（软连接）
ln -s <filename> <dirname>
```
----
### Vim编辑器简单使用

#### 命令模式
打开文件后的默认模式
- i：进入编辑模式
- :：进入底线命令模式
- p：粘贴
- x：删除当前字符
- dd：剪切当前行

#### 编辑模式
编辑文本，Esc返回命令模式

#### 底线命令
- q!：退出不保存
- w：保存
- wq/x：保存并退出
- e：打开文件
- saveas：另存为
- bn/bp：切换到上（下）个打开的文件

### Tips

- 软连接建立一定要使用绝对路径，否则会找不到原始文件。