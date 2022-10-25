# import urllib.request

# response = urllib.request.urlopen('http://www.baidu.com')
# print(response.read().decode('utf-8'))

# import requests

# r = requests.get('https://api.github.com/events', data= { 'key': 'value' })


# import re

# content = 'Xiaoshuaib has 100 bananas'
# res = re.match('^Xi.*(d+)s.*s$', '100')
# print(res.group(1))

# 第一个爬虫例子 解析那里没跑起来
# import json
# import re
# import requests


# def request_dandan(url):
#     try:
#         response = requests.get(url)
#         if response.status_code == 200:
#             return response.text
#     except requests.RequestException:
#         return None


# def parse_result(html):
#     pattern = re.compile('<li>.*?list_num.*?(d+).</div>.*?<img src="(.*?)".*?class="name".*?title="(.*?)">.*?class="star">.*?class="tuijian">(.*?)</span>.*?class="publisher_info">.*?target="_blank">(.*?)</a>.*?class="biaosheng">.*?<span>(.*?)</span></div>.*?<p><spansclass="price_n">&yen;(.*?)</span>.*?</li>', re.S)
#     items = re.findall(pattern, html)
#     for item in items:
#         yield {
#             'range': item[0],
#             'iamge': item[1],
#             'title': item[2],
#             'recommend': item[3],
#             'author': item[4],
#             'times': item[5],
#             'price': item[6]
#         }


# def main(page):
#     url = 'http://bang.dangdang.com/books/fivestars/01.00.00.00.00.00-recent30-0-0-1-' + \
#         str(page)
#     html = request_dandan(url)
#     items = parse_result(html)

#     for item in items:
#         print('111')
#         write_item_to_file(item)


# def write_item_to_file(item):
#     print('开始写入数据 ====> ' + str(item))
#     with open('book.txt', 'a', encoding='UTF-8') as f:
#         f.write(json.dumps(item, ensure_ascii=False) + 'n')
#         f.close()


# main(1)
