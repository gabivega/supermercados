import puppeteer from "puppeteer";
import { guardarEnBd } from "../functions/guardarEnBd.js";

async function scrapping() {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        await page.setDefaultTimeout(60000);
        await page.goto("https://www.pinguino.com.ar/web/index.r", { waitUntil: "load" });
        await page.mouse.click(1, 1);
        await new Promise(r => setTimeout(r, 2000))
        await page.mouse.click(1, 1);
        await page.click('span[title="Categorías"]');
        await page.waitForSelector(".menu-item", { visible: true });
        let allProducts = [];
        const categorias = await page.evaluate(() => {
            const menuItems = Array.from(document.querySelectorAll("[data-d]"));

            var listadoRaw = menuItems.map((item) => {
                return {
                    categoria: item.firstChild.innerText || item.innerText,
                    data: item.getAttribute("data-d")
                }
            })
            return listadoRaw.filter(i => i.data < 100
            );
        })
        console.log(categorias)
        //click en categorias generales
        for (let i = 0; i < categorias.length; i++) {
            let data = categorias[i].data
            let categoriaGlobal = categorias[i].categoria
            if (data) {
                try {
                    await page.click(`[data-d="${data}"]`);
                    console.log("entrando a ", categorias[i].categoria);
                    await page.waitForSelector("[data-c]");
                    const subCategorias = await page.evaluate(() => {
                        const subCategoriaItems = Array.from(document.querySelectorAll("[data-c]"))
                        const subCategoriaFiltrada = subCategoriaItems.filter(i => !i.getAttribute("[data-s]"))
                        const listado = subCategoriaFiltrada.map((item) => {
                            return {
                                subCategoria: item.innerText,
                                datad: item.getAttribute("data-d"),
                                datac: item.getAttribute("data-c")
                            }
                        })
                        return listado;
                    })
                    console.log(subCategorias)
                    for (let i = 0; i < subCategorias.length; i++) {
                        console.log("Clickeando en", subCategorias[i].subCategoria);
                        await page.click(`[data-c="${subCategorias[i].datac}"]`);
                        await new Promise(r => (setTimeout(r, 2000)));
                        const subSubCategoria = await page.$("[data-s]");
                        if (subSubCategoria) {
                            console.log("hay sub subcategorias")
                            const subSubCategorias = await page.evaluate(() => {
                                const dataSCategorias = Array.from(document.querySelectorAll("[data-s]"));

                                const listado = dataSCategorias.map((item) => {
                                    return {
                                        subSubCategoria: item.innerText,
                                        datas: item.getAttribute("data-s")
                                    }
                                })
                                return listado;
                            })
                            console.log("sub-sub-categorias:", subSubCategorias);
                            for (let i = 0; i < subSubCategorias.length; i++) {
                                console.log("Entrando en : ", subSubCategorias[i].subSubCategoria);
                                try {
                                    await page.click(`[data-s="${subSubCategorias[i].datas}"]`);
                                    await new Promise(r => setTimeout(r, 5000));

                                    await new Promise(r => setTimeout(r, 5000));
                                    await page.waitForNetworkIdle();
                                    await page.$$(".desProducto");
                                    const productos = await page.evaluate(() => {
                                        titulosProductos = Array.from(document.querySelectorAll(".desProducto"));
                                        divPrecios = Array.from(document.querySelectorAll(".precio"));
                                        imagenesProductos = Array.from(document.querySelectorAll(".productoNormal .imgProd .lazyload")).map((i) => i.getAttribute("src"));
                                        codigosProductos = Array.from(document.querySelectorAll(".productoNormal")).map((i) => i.getAttribute("id"));

                                        const preciosProductos = divPrecios.map(precio => precio.lastElementChild.innerText)

                                        let limpiarPrecio = (precio) => {
                                            const precioLimpio = parseFloat((precio).replace(/[^\d,.-]/g, ''));
                                            return precioLimpio;
                                        }
                                        const listado = titulosProductos.map((producto, i) => {
                                            let imageUrl = imagenesProductos[i].split("/")
                                            return {
                                                titulo: producto.innerText,
                                                precio: limpiarPrecio(preciosProductos[i]),
                                                imagenUrl: imageUrl[7],
                                                proveedor: "El pingüino",
                                                codigo: codigosProductos[i],

                                            }
                                        })
                                        return listado
                                    })
                                    await productos.forEach((product) => {
                                        product.categoria = categoriaGlobal;
                                        allProducts.push(product)
                                    });
                                    console.log("productos:", productos);
                                    await guardarEnBd(productos)
                                    await page.click('span[title="Categorías"]');
                                    await new Promise(r => setTimeout(r, 2000));
                                } catch (error) {
                                    console.error
                                }
                            }
                        }
                        else {
                            console.log("no hay sub sub categorias");

                            await page.$(".desProducto");
                            await page.waitForNetworkIdle();
                            await new Promise(r => setTimeout(r, 5000));

                            await new Promise(r => setTimeout(r, 5000));
                            await page.waitForNetworkIdle();
                            const productos = await page.evaluate(() => {
                                titulosProductos = Array.from(document.querySelectorAll(".desProducto"));
                                divPrecios = Array.from(document.querySelectorAll(".precio"));
                                imagenesProductos = Array.from(document.querySelectorAll(".productoNormal .imgProd .lazyload")).map((i) => i.getAttribute("src"));
                                codigosProductos = Array.from(document.querySelectorAll(".productoNormal")).map((i) => i.getAttribute("id"));

                                const preciosProductos = divPrecios.map(precio => precio.lastElementChild.innerText)

                                let limpiarPrecio = (precio) => {
                                    const precioLimpio = parseFloat((precio).replace(/[^\d,.-]/g, ''));
                                    return precioLimpio;
                                }
                                const listado = titulosProductos.map((producto, i) => {
                                    let imageUrl = imagenesProductos[i].split("/");
                                    return {
                                        titulo: producto.innerText,
                                        precio: limpiarPrecio(preciosProductos[i]),
                                        imagenUrl: imageUrl[7],
                                        proveedor: "El pingüino",
                                        codigo: codigosProductos[i],

                                    }
                                })
                                return listado
                            })
                            await productos.forEach((product) => {
                                product.categoria = categoriaGlobal;
                                allProducts.push(product)
                            });
                            console.log("productos:", productos);
                            await guardarEnBd(productos);
                            await page.click('span[title="Categorías"]');
                            await new Promise(r => setTimeout(r, 2000));
                        }
                    }
                }
                catch (error) {
                    console.log(error)
                }
            }
            else console.log("no hay subcategorias en", categorias[i].categoria)

        }

        console.log(allProducts);
        await browser.close();
    } catch (error) {
        console.log(error);
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
}

export default scrapping;