const puppeteer = require('puppeteer');



(async (cnpj) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://consultacnpj.info/`);

  await page.waitForSelector('#bto');
  await page.type('#cnpj', cnpj)
  await page.click('#bto')


})('01475178000585')
