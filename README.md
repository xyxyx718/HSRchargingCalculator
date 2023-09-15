# HSRchargingCalculator

Charging Calculator for Honkai: Star Rail | "咸鱼的崩铁助理"(which means "Salted Fish's HSR Assistant" in English)

English | [简体中文](README_CN.md)

## Project Introduction

This project is the Charging Calculator page within the WeChat Mini Program "咸鱼的崩铁助理"(which means "Salted Fish's HSR Assistant" in English).

Developed using [uniapp](https://uniapp.dcloud.net.cn/), and published as a WeChat Mini Program.

Currently, it covers most of the charging scenarios in Honkai: Star Rail.

![miniprogram-qrcode](img/miniprogram-qrcode.jpg)

~~This isn't hard to make. I don't know why it took three versions for someone to do it, so I decided to make one myself.~~

## Project Screenshots

Screenshots of the WeChat Mini Program.

![preview](/img/preview.jpg)

## How to Use

### Ready to Use

Search for "咸鱼的崩铁助理" in WeChat Mini Programs or scan the QR code above to use it immediately.

### Add to Your Project

Copy the `pages` and `static` folders into your uniapp project, then add the corresponding routes in your project's `pages.json`.
Add the methods from `main.js` into your project's `main.js`.
For projects that are not WeChat or QQ Mini Programs, you will need to modify the method for importing `data.json`.

## Development Plan

- [x] Adjust data structures to allow Light Cone to have multiple skills
- [x] Do not collapse the enabled additional effects
- [x] Hot update `data.json` and verify data version compatibility
- [ ] Allow skills to have custom action names and more flexible effects
- [ ] Screenshot sharing feature

## License

This project uses the [MIT License](LICENSE).

This project uses icons from [RemixIcon](https://github.com/Remix-Design/RemixIcon/), under the [Apache 2.0 License](https://github.com/Remix-Design/RemixIcon/blob/master/License).

## Others

English version of README is translated by [ChatGPT(GPT-4)](https://chat.openai.com/).

The text used for translation is as follows:

```
Help me translate this README into English. Here are the requirements and document content:
Requirements:
- Do not modify the first line of the introduction below the title.
- Change the "[English](README.md) | 简体中文" part to "English | [简体中文](README_CN.md)".
- Translate "小程序" to "Mini Program".
- Translate "《咸鱼的崩铁助理》" to "\"咸鱼的崩铁助理\"(which means \"Salted Fish's HSR Assistant\" in English)" (except for the first line of the introduction below the title).
- Translate "开箱即用" to "Ready to Use".
- Translate "光锥" to "Light Cone".
- Translate "崩坏：星穹铁道" to "Honkai: Star Rail".
- Translate the first sentence of explanation under the "Others" section to "English version of README is translated by [ChatGPT(GPT-4)](https://chat.openai.com/)."
- Translate the content inside the code block of the "Others" section as well.

Reply to me with the translated document content wrapped in a code block, so I can directly copy it.
Due to Markdown format limitations, put the content inside the code block of the "Others" section in a separate code block.
```