---
title: 基于GeoDjango搭建地图服务
date: '2018-04-22 20:51:06'
tags: 
- Django

category: Development
image:
---

使用Django开发全球恐怖袭击分布展示系统的后端程序，功能包括：
- 为前端程序提供REST API调用接口和详细的说明
- 利用Django Admin在后台进行数据管理
- 借助GDAL实现地图服务的发布和空间分析算法的后端实现

未完待续...


### django目录结构

直接使用pycharm创建Django项目得到的项目目录如下：
```
terrorism_rear_end # 项目根目录
----rear_end_services # 创建的APP文件夹
--------migrations # 存放生成的数据库迁移文件
--------__init__.py
--------admin.py # 在admin中注册app需要被管理的model以及自定义管理接口
--------apps.py # 设置app基本信息
--------load_data.py # 创建的用于导入数据的脚本文件
--------models.py # 数据表对应的模型文件（ORM）
--------serializers.py # model的序列化说明，用于将数据序列化为json/geojson
--------tests.py # 测试文件
--------urls.py # App的URL分发表，需要在总表中include
--------views.py # 定义具体的页面相应，本项目中只包括API返回
----terrorism_rear_end # 项目文件夹
--------__init__.py
--------settings.py # Django配置文件
--------urls.py # 总URL分发配置
--------wsgi.py # 应用网关配置
----venv # python虚拟环境
----manage.py # Django的运行管理文件
----templates # 网页模板文件夹，本项目中只需要admin页面模板
--------admin
------------base_site.html # 用于覆盖和增减默认模板中的某些组件
```
----
### 环境配置

1. 安装postgresql以及postgis
```shell
apt-get install postgresql
apt-get install postgresql-x-postgis # x为postgresql的版本
```
2. 创建一个用户并创建数据库将owner设置为新创建的用户
3. 开启postgis和post-topology扩展
4. 安装GeoDjango需要的python package
    - GDAL
    - GEOS
    - GeoIP
5. 在settings.py中配置数据库、app组件及时区语言等属性
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'terrorism_backend',
        'USER': 'LaZzy',
        'PASSWORD': '********'
    }
}

LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'Asia/Shanghai'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rear_end_services.apps.RearEndServicesConfig',
    'django.contrib.gis',
]
```
运行`python manage.py start`若能正常运行则配置成功

----
### model与数据库迁移
Django通过model与数据库中关系表建立连接来实现对数据库内容的对象化操作，以GeoDjango文档中数据为例：
```python
class WorldBorder(models.Model):
    name = models.CharField(max_length=50, primary_key=True)
    area = models.IntegerField()
    pop2005 = models.IntegerField('Population 2005')
    fips = models.CharField('FIPS Code', max_length=2)
    iso2 = models.CharField('2 Digit ISO', max_length=2)
    iso3 = models.CharField('3 Digit ISO', max_length=3)
    un = models.IntegerField('United Nations Code')
    region = models.IntegerField('Region Code')
    subregion = models.IntegerField('Sub-Region Code')
    lon = models.FloatField()
    lat = models.FloatField()
    mpoly = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return self.name
```
模型建立后生成数据迁移文件`$ python manage.py makemigrations`

查看文件没有错误后进行数据迁移`$ python manage.py migrate`

程序会自动在指定的数据库中创建名为<app_name>_<model_name>的数据表，之后在程序中便可以直接使用WorldBorder.Object的方法对数据表进行各种操作。

----
### 空间数据导入

django.contrib.gis.utils中的LayerMapping包提供了针对shapefile文件的空间数据批量导入方式，需要指定shp文件中属性字段与model中属性的映射以及shp文件路径：
```python
import os
from django.contrib.gis.utils import LayerMapping
from .models import WorldBorder, GlobalTerrorism

gt_mapping = {
    'id': 'eventid',
    'year': 'year',
    'month': 'month',
    'day': 'day',
    'geom': 'POINT',
}

gt_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), '../terrorism_rear_end/data/terrorism', 'gtd.shp'))


def run(verbose=True):
    lm = LayerMapping(GlobalTerrorism,
                      gt_shp,
                      gt_mapping,
                      transform=False,
                      encoding='iso-8859-1',)
    lm.save(strict=True, verbose=verbose)
```

----
### 自动生成model与LayerMapping映射
Django提供了ogrinspect工具用于在ogrinfo的基础上自动为shp文件生成基本模型以及LayerMapping映射。

使用方法：
```shell
$ python manage.py ogrinspect [options] <data_source> <model_name> [options]

$ python manage.py ogrinspect gtd.shp GlobalTerrorism --srid=4326 --mapping --multi
```

运行结果:
```python
class GlobalTerrorism(models.Model):
    verbose_name = '恐怖袭击位置数据'
    id = models.CharField(max_length=50)
    year = models.CharField(max_length=50)
    month = models.CharField(max_length=50)
    day = models.CharField(max_length=50)
    geom = models.MultiPointField(srid=4326)

gt_mapping = {
    'id': 'eventid',
    'year': 'year',
    'month': 'month',
    'day': 'day',
    'geom': 'POINT',
}
```
参数说明:

- --srid=4326 设置地理参考，4336代表WGS84坐标系（地理坐标系）
- --mapping 是否生成LayerMapping映射字典
- --multi 使用多要素方式生成地理要素属性，如，MultiPolygon、MultiPoint

更多使用方法参考：[Django ogrinspect][0]

----
### 使用admin进行管理
----
### 空间索引和空间查询
----
### REST服务搭建和发布
----
### Swagger自动生成API文档

[0]:[https://docs.djangoproject.com/en/2.0/ref/contrib/gis/commands/#django-admin-ogrinspect]
