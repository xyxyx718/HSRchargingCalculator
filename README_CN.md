# HSRchargingCalculator

Charging Calculator for Honkai: Star Rail | 《咸鱼的崩铁助理》的充能计算器

[English](README.md) | 简体中文

## 项目介绍

本项目是微信小程序[《咸鱼的崩铁助理》](%E5%92%B8%E9%B1%BC%E7%9A%84%E5%B4%A9%E9%93%81%E5%8A%A9%E7%90%86.md)中的充能计算器页面。

使用 [uniapp](https://uniapp.dcloud.net.cn/) 开发，发布于微信小程序。

目前覆盖了《崩坏：星穹铁道》中的绝大部分充能场景。

![miniprogram-qrcode](img/miniprogram-qrcode.jpg)

~~这东西又不难，不知为何等了三个版本还没人做，于是我决定自己搓一个。~~

## 项目截图

微信小程序截图。

![preview](/img/preview.jpg)

## 如何使用

### 开箱即用

在微信小程序中搜索`咸鱼的崩铁助理`或使用微信扫描上方的小程序码即可使用。

### 添加到项目中

将 `pages` 文件夹和 `static` 文件夹复制到你的uniapp项目中，然后在项目的 `pages.json` 中添加对应的路由。
将 `main.js` 中的方法添加到你的 `main.js` 中。
对于非微信小程序或QQ小程序的项目，你需要自行修改导入 `data.json` 的方法。

## 开发计划

- [x] 调整数据结构，允许光锥拥有多个技能
- [x] 不收起已启用的额外效果
- [x] 热更新`data.json`以及数据版本兼容性验证
- [ ] 允许技能拥有自定义的行动名称和更高自由度的效果
- [ ] 截图分享功能

## 许可证

本项目使用 [MIT 许可证](LICENSE)。

本项目使用了来自 [RemixIcon](https://github.com/Remix-Design/RemixIcon/) 的图标，基于 [Apache 2.0](https://github.com/Remix-Design/RemixIcon/blob/master/License) 协议。

## 其他

英文版README使用 [ChatGPT(GPT-4)](https://chat.openai.com/) 翻译。

以下是翻译时使用的文本：

```text
帮我将这个README翻译成英文，以下是要求和文档内容：
要求：
标题下的第一行简介不需要修改。
【[English](README.md) | 简体中文】部分改为【English | [简体中文](README_CN.md)】。
【小程序】翻译为【Mini Program】。
【《咸鱼的崩铁助理》】翻译为【"咸鱼的崩铁助理"(which means "Salted Fish's HSR Assistant" in English)】（不包括标题下的第一行简介）。
【开箱即用】翻译为【Ready to Use】。
【光锥】翻译为【Light Cone】。
【崩坏：星穹铁道】翻译为【Honkai: Star Rail】。
《其他》章节下的第一句说明翻译为【English version of README is translated by [ChatGPT(GPT-4)](https://chat.openai.com/).】
《其他》章节的代码框中的内容也需要翻译。

回复我时将翻译好的文档内容使用代码框包裹，以便我可以直接复制。
受限于markdown的格式，《其他》章节的代码框中的内容单独放在一个代码框里。

文档内容：
// 中文版README
```
