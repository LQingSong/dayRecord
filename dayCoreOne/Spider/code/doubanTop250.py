# encoding: utf-8
import requests
from bs4 import BeautifulSoup
import time
import re
import xlwt
import os

# 创建excel表用于写入数据
workbook = xlwt.Workbook(encoding='utf-8', style_compression=0)
sheet = workbook.add_sheet('豆瓣top250', cell_overwrite_ok=True)
sheet.write(0, 1, '排名')
sheet.write(0, 2, '电影名称')
sheet.write(0, 3, '导演')
sheet.write(0, 4, '主演')
sheet.write(0, 5, '上映时间')
sheet.write(0, 6, '国家')
sheet.write(0, 7, '电影类型')
sheet.write(0, 8, '评分')
sheet.write(0, 9, '影评')

# 设置数据的起始写入位置
n = 1
# 设置保存时的文件名
file = '豆瓣数据.xls'

# 获取当前用户桌面路径


def desktop_path():
    return os.path.join(os.path.expanduser('~'), 'Desktop')


print('当前用户桌面路径为：', desktop_path())

# 对网页进行请求


def request_douban(url):
    try:
        header1 = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'}
        response = requests.get(url, headers=header1)
        if response.status_code == 200:
            print('网页解析成功！')
            # 用print测试是否可以正常请求网页
            # print(response.text)
            return response.text
    except requests.RequestException:
        print('网页未解析成功.')
        return None


# 用beautifulsoup对网页进行解析，find只会匹配到第一个符合的元素
def analysis_douban(html):
    # lxml库解析网页时会将网页源码解码为Unicode编码数据
    soup = BeautifulSoup(html, 'lxml')
    items = soup.find(class_="grid_view").find_all('li')
    print('开始解析数据-------------------------------->')
    for item in items:
        item_index = item.find('em').string
        item_name = item.find(class_="title").string
        # 多个标签用result.text获取内容
        item_origin = item.find('p').text
        # re.split支持多个符号同时分割，对导演和主演等信息进行处理
        item_list = re.split('\xa0\xa0\xa0|\n|\xa0/\xa0', item_origin)
        item_director = item_list[1].lstrip()
        item_actor = item_list[2]
        item_time = item_list[3].lstrip()
        item_country = item_list[4]
        item_type = item_list[5]
        item_rate = item.find(class_="rating_num").string
        item_comment = item.find(class_="inq").string

        # print(f'{item_index},{item_name},{item_director},{item_actor},{item_time},{item_country},{item_type},{item_rate},{item_comment}')
        global n
        sheet.write(n, 1, item_index)
        sheet.write(n, 2, item_name)
        sheet.write(n, 3, item_director)
        sheet.write(n, 4, item_actor)
        sheet.write(n, 5, item_time)
        sheet.write(n, 6, item_country)
        sheet.write(n, 7, item_type)
        sheet.write(n, 8, item_rate)
        sheet.write(n, 9, item_comment)
        n = n + 1
    workbook.save(desktop_path()+'\\'+file)
    print('数据保存成功')

# 程序执行总览:请求网页，解析网页内容（正则表达式，beautifulsoup），保存数据


def main(page):
    url = f'https://movie.douban.com/top250?start={page * 25}&filter='
    # url另一种写法
    # url = 'https://movie.douban.com/top250?start='+str(page*25)+'&filter='
    html = request_douban(url)
    analysis_douban(html)


if __name__ == '__main__':
    start = time.time()
    for i in range(0, 3):
        main(i)
    end = time.time()
    print('总共用时%.3f' % (end - start) + '秒')
