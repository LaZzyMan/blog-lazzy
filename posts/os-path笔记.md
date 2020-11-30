---
title: os.path笔记
date: '2018-06-06 16:56:41'
tags:
- python
---

os.path 模块主要用于文件的属性获取，以下是该模块的几种常用方法。更多的方法可以去查看[官方文档](http://docs.python.org/library/os.path.html)。

* os.path.abspath(path) 返回 path 规范化的绝对路径。

```python
os.path.abspath('test.csv')
'C:\\Python25\\test.csv'
os.path.abspath('c:\\test.csv')
'C:\\test.csv'
os.path.abspath('../csv\\test.csv')
'C:\\csv\\test.csv'
```

* os.path.split(path) 将 path 分割成目录和文件名二元组返回。

```python
os.path.split('c:\\csv\\test.csv')
('c:\\csv', 'test.csv')
os.path.split('c:\\csv\\')
('c:\\csv', '')
```

* os.path.dirname(path)
  返回 path 的目录。其实就是 os.path.split(path)的第一个元素。

```python
os.path.dirname('c:\\csv\test.csv')
'c:\\'
os.path.dirname('c:\\csv')
'c:\\'
```

* os.path.basename(path)
  返回 path 最后的文件名。如何 path 以／或\结尾，那么就会返回空值。即 os.path.split(path)的第二个元素。

```python
os.path.basename('c:\\test.csv')
'test.csv'
os.path.basename('c:\\csv')
'csv' （这里 csv 被当作文件名处理了）
os.path.basename('c:\\csv\\')
''
```

* os.path.commonprefix(list)
  返回 list 中，所有 path 共有的最长的路径。如：

```python
os.path.commonprefix(['/home/td','/home/td/ff','/home/td/fff'])
'/home/td'
```

* os.path.exists(path)
  如果 path 存在，返回 True；如果 path 不存在，返回 False。

```python
os.path.exists('c:\\')
True
os.path.exists('c:\\csv\\test.csv')
False
```

* os.path.isabs(path)
  如果 path 是绝对路径，返回 True。

* os.path.isfile(path)
  如果 path 是一个存在的文件，返回 True。否则返回 False。

```python
os.path.isfile('c:\\boot.ini')
True
os.path.isfile('c:\\csv\\test.csv')
False
os.path.isfile('c:\\csv\\')
False
```

* os.path.isdir(path)
  如果 path 是一个存在的目录，则返回 True。否则返回 False。

```python
os.path.isdir('c:\\')
True
os.path.isdir('c:\\csv\\')
False
os.path.isdir('c:\\windows\\test.csv')
False
```

* os.path.join(path1[, path2[, ...]])
  将多个路径组合后返回，第一个绝对路径之前的参数将被忽略。

```python
os.path.join('c:\\', 'csv', 'test.csv')
'c:\\csv\\test.csv'
os.path.join('windows\temp', 'c:\\', 'csv', 'test.csv')
'c:\\csv\\test.csv'
os.path.join('/home/aa','/home/aa/bb','/home/aa/bb/c')
'/home/aa/bb/c'
```

* os.path.normcase(path)
  在 Linux 和 Mac 平台上，该函数会原样返回 path，在 windows 平台上会将路径中所有字符转换为小写，并将所有斜杠转换为饭斜杠。

```python
os.path.normcase('c:/windows\\system32\\')
'c:\\windows\\system32\\'
```

* os.path.normpath(path)
  规范化路径。

```python
os.path.normpath('c://windows\\System32\\../Temp/')
'c:\\windows\\Temp'
```

* os.path.splitdrive(path) 返回（drivername，fpath）元组

```python
>>> os.path.splitdrive('c:\\windows')
('c:', '\\windows')
```

* os.path.splitext(path) 分离文件名与扩展名；默认返回(fname,fextension)元组，可做分片操作.

```python
os.path.splitext('c:\\csv\\test.csv')
('c:\\csv\\test', '.csv')
```

* os.path.getsize(path) 返回 path 的文件的大小（字节）。

```python
os.path.getsize('c:\\boot.ini')
299L
```

* os.path.getatime(path) 返回 path 所指向的文件或者目录的最后存取时间。

* os.path.getmtime(path) 返回 path 所指向的文件或者目录的最后修改时间
