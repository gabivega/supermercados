import puppeteer from "puppeteer";
import { guardarEnBd } from "../functions/guardarEnBd.js";

export default async function scrappingAnonima() {
    let browser;

    try {
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        await page.setDefaultTimeout(60000);
        await page.goto("https://supermercado.laanonimaonline.com/home/", {});
        await new Promise(r => setTimeout(r, 20000))
        await page.waitForSelector("#sel_provincia", { visible: true });
        await new Promise(r => setTimeout(r, 1000))
        await page.select('#sel_provincia', 'SANTA FE');
        await new Promise(r => setTimeout(r, 1000))
        await page.select('#sel_localidad', 'RAFAELA', { visible: false });
        await new Promise(r => setTimeout(r, 1000))
        await page.select('#sel_sucursal_49', 'RIVADAVIA 53', { visible: false });
        await new Promise(r => setTimeout(r, 10000))


    } catch (error) {
        console.log(error)
    }
    finally {
        await browser.close();
    }
}
