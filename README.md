# HSRchargingCalculator

Charging Calculator for Honkai: Star Rail | 《咸鱼的崩铁助理》的充能计算器 

English | [简体中文](README_CN.md)

## Project Introduction

This project is the Charging Calculator page in the WeChat Mini Program "咸鱼的崩铁助理"(which means "Salted Fish's HSR Assistant" in English).

Developed using [uniapp](https://uniapp.dcloud.net.cn/), and released on WeChat Mini Program.

Currently, it covers a vast majority of charging scenarios in Honkai: Star Rail.

![miniprogram-qrcode](img/miniprogram-qrcode.jpg)

~~It's not a complicated thing, but for some reason, no one has made it after three versions, so I decided to make one myself.~~

## Project Screenshots

Screenshots from the WeChat Mini Program.

![preview](/img/preview.jpg)

## How to Use

### Ready to Use

Search for "咸鱼的崩铁助理" in the WeChat Mini Program or scan the QR code above to use it directly.

### Add to Your Project

Copy the `pages` and `static` folders into your uniapp project, and then add the corresponding routes in your project's `pages.json`.

## Development Plan

- [x] Modify data structure to allow Light Cone to have multiple skills.
- [x] Keep enabled extra effects expanded.
- [ ] Allow skills to have custom action names and more flexible effects.
- [ ] Implement hot updates for `data.json` and data version compatibility checks.
- [ ] Screenshot sharing feature.

## License

This project is licensed under the [MIT License](LICENSE).

This project uses icons from [RemixIcon](https://github.com/Remix-Design/RemixIcon/), licensed under [Apache 2.0](https://github.com/Remix-Design/RemixIcon/blob/master/License).

---

English version of README is translated by [ChatGPT(GPT-4)](https://chat.openai.com/).
