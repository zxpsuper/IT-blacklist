const trainList = require('./src/Training.js')
const outsourcing = require('./src/Outsourcing.js')
const fs = require('fs')
const puppeteer = require('puppeteer')
const request = require('request')

fs.writeFile('./dist/trainList.json', JSON.stringify(trainList), function (
  err
) {
  if (err) console.log(err)
})

fs.writeFile(
  './dist/outsourcingList.json',
  JSON.stringify(outsourcing),
  function (err) {
    if (err) console.log(err)
  }
)
let map = {}

trainList.forEach(function (item) {
  if (!map[item.name]) {
    map[item.name] = {}
    map[item.name].name = item.name
    map[item.name].address = item.address
    map[item.name].descript = item.descript
    map[item.name].label = ['培训']
  }
})

outsourcing.forEach(function (item) {
  if (!map[item.name]) {
    map[item.name] = {}
    map[item.name].name = item.name
    map[item.name].address = item.address
    map[item.name].descript = item.descript
    map[item.name].label = ['外包']
  } else {
    if (!map[item.name].address && item.address)
      map[item.name].address = item.address
    if (!map[item.name].descript && item.descript)
      map[item.name].descript = item.descript
    if (!map[item.name].label.includes('外包'))
      map[item.name].label.push('外包')
  }
})

fs.writeFile('./dist/company.json', JSON.stringify(map), function (err) {
  if (err) console.log(err)
})

// 延时器
let timeout = function (delay) {
  console.log('延迟函数：', `延迟 ${delay} 毫秒`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(1)
      } catch (error) {
        reject(error)
      }
    }, delay)
  })
}
/**
 * One 爬虫类
 */
class OnePaChong {
  constructor() {
    // 最大索引
    this.maxIndex = 40
    // 初始化
    this.init()
  }
  // 初始化函数
  async init() {
    console.log('正在启动浏览器...')
    this.browser = await puppeteer.launch()
    console.log('正在打开新页面...')
    this.page = await this.browser.newPage()
    await this.get996()
    this.closeBrowser()
  }
  async get996() {
    await timeout(1000)
    let page = this.page
    await page.goto(
      `https://github.com/996icu/996.ICU/blob/master/blacklist/README.md`
    )
    console.log('成功打开页面')
    try {
      let sText = await page.$$eval('table', (el) =>
        el.map((el) => el.innerHTML)
      )
      let trArr = sText[1]
        .match(/<tr[^>]*>[\s\S]*?<\/tr>/gi)
        .slice(1)
        .map((item) => {
          item = item
            .match(/<td[^>]*>[\s\S]*?<\/td>/gi)
            .map((item) => item.match(/<td[^>]*>([\s\S]*)<\/td>/)[1])
          return item
        })
        .map((item) => {
          item[1] = item[1].match(/<a[^>]*>([\s\S]*)<\/a>/)
            ? item[1].match(/<a[^>]*>([\s\S]*)<\/a>/)[1]
            : item[1]
          return item
        })
      trArr.forEach(function (item) {
        if (!map[item[1]]) {
          map[item[1]] = {}
          map[item[1]].name = item[1]
          map[item[1]].address = ''
          map[item[1]].descript = item[3]
          map[item[1]].label = ['996']
        } else {
          if (!map[item[1]].descript && item[3]) map[item[1]].descript = item[3]
          if (!map[item[1]].label.includes('996'))
            map[item[1]].label.push('996')
        }
      })
      fs.writeFile('./dist/company-all.json', JSON.stringify(map), function (
        err
      ) {
        if (err) console.log(err)
      })
    } catch (err) {
      console.log(err)
    }
  }
  // 关闭浏览器
  async closeBrowser() {
    console.log('正在关闭浏览器...')
    await this.browser.close()
  }
}

// 启用爬虫
new OnePaChong()
