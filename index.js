const readline = require('readline');
const puppeteer = require('puppeteer');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    const sourceUrl = await askQuestion('Enter source URL: ');
    const targetUrl = await askQuestion('Enter target URL: ');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(sourceUrl);

    const elementIds = await page.evaluate(() => {
        const elements = document.querySelectorAll('*[id]');
        return Array.from(elements, element => element.id);
    });

    console.log('Element IDs found on the source page:');
    console.log(elementIds);

    const elementId1 = await askQuestion('Enter the first element ID: ');
    const elementId2 = await askQuestion('Enter the second element ID: ');

    await page.goto(targetUrl);

    const inputField1 = await page.$(`#${elementId1}`);
    const inputField2 = await page.$(`#${elementId2}`);

    await inputField1.type('Data for Input 1');
    await inputField2.type('Data for Input 2');
    await page.keyboard.press('Enter');

    await browser.close();
    rl.close();
}

function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
        });
    });
}

main();
