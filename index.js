const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.disable('x-powered-by');


app.get('/video/:id/:type', async (req, res) => {
    const type = req.params.type ? req.params.type : 'mp3';
    const id = req.params.id;
    if(id.toString().length !== 11) {
        res.json({
           success: false,
           error: 'Video ID required'
        });
    } else {
        const puppeteer = require('puppeteer-extra');
        let returned_data = {
            statusCode: 100,
            success: false
        };
        let args = [];
        const proxy_ip = '8.8.8.8';
        const proxy_port = '3001';
        const proxy = false;
        if (process.env.NODE_ENV === 'development') {
            args.push('--disable-dev-shm-usage');
            debug = true;
        } else {
            debug = false;
            args.push('--no-sandbox');
            args.push('--disable-setuid-sandbox');
            if(proxy) args.push(`--proxy-server=http://${proxy_ip}:${proxy_port}`);
        }
        await puppeteer.launch({headless: true, args: args, ignoreDefaultArgs: ['--disable-extensions']}).then(async browser => {
            let navigated = false;
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');
            await page.goto('https://ytmp3.cc', {timeout: 0}).then(() => {
                navigated = true;
            }).catch(() => {
                browser.close();
                returned_data = {
                    success: false,
                    statusCode: 120
                };
            });

            if (navigated) {
                const foundInput = await page.evaluate(() => {
                    if (document.getElementsByName('video')[0]) {
                        document.getElementsByName('video')[0].value = '';
                        return Promise.resolve(true);
                    } else {
                        return Promise.reject(false);
                    }
                });
                if (foundInput) {
                    await page.keyboard.type(`https://www.youtube.com/watch?v=${id}`);
                    if (type) {
                        await page.$eval("#" + type, el => el.click());
                    }
                    await page.$eval("input[value='Convert']", el => el.click());
                } else {
                    returned_data = {
                        success: false,
                        statusCode: 101
                    }
                }
                await page.waitForSelector('#progress', {hidden: true, timeout: 120000}).then(async () => {
                    try {
                        await page
                            .waitForSelector('#buttons', {visible: true, timeout: 30000})
                            .then(async () => {
                                let projects = await page.evaluate(() => {
                                    if (document.getElementById("buttons").querySelectorAll("a").length > 0) {
                                        return Array.from(document.getElementById("buttons").querySelectorAll("a")).map(node => {
                                            if (node.href.search(/\.fjrifj.frl/) !== -1) {
                                                return node.href
                                            }
                                        });
                                    } else {
                                        return [];
                                    }
                                });
                                if (projects.length > 0) {
                                    await projects.map(m => {
                                        if (m !== null) {
                                            returned_data = {
                                                url: m,
                                                success: true
                                            }
                                        }
                                    });
                                } else {
                                    returned_data = {
                                        statusCode: 103,
                                        success: false
                                    };
                                }
                            }).catch(async () => {
                                const error_block = await page.waitForSelector('#error', {visible: true, hidden: true, timeout: 15000});
                                if (error_block !== null) {
                                    let status_code = await page.evaluate(async () => {
                                        let text = document.getElementById("error").querySelectorAll("p")[0].innerHTML;
                                        text = await text.toString();
                                        const find_index = await text.indexOf("-");
                                        text = await text.split("");
                                        status_code = `1${text[find_index - 1]}0${text[find_index + 1]}`;
                                        status_code = await parseInt(status_code);
                                        return status_code;
                                    });
                                    returned_data = {
                                        statusCode: status_code,
                                        try: true,
                                        success: false
                                    }
                                } else {
                                    returned_data = {
                                        statusCode: 102,
                                        success: false
                                    }
                                }
                            });
                    } catch (e) {
                        returned_data = {
                            success: false,
                            statusCode: 104
                        }
                    }
                }).catch(async () => {
                    returned_data = {
                        statusCode: 105,
                        success: false
                    }
                });
                await browser.close();
            }
        });
        await res.json(returned_data);
    }
});

const port = 3000;
app.listen(port, () => console.log(`App listening on this url:  http://localhost:${port}!`))