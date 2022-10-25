# coding=utf-8

from appium import webdriver

desired_caps = {
  'platformName': 'Android',
  'deviceName': '88CKBM622PAM',
  'platformVersion': '5.1',
  'appPackage': 'com.tencent.mm',
  'appActivity': 'com.tencent.mm.ui.LauncherUI'
 }

driver = webdriver.Remote('http://127.0.0.1:4723/wd/hub', desired_caps)