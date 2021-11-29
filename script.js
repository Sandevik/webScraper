const playwright = require("playwright");
const fs = require("fs");
const cheerio = require("cheerio");

const browserType = "chromium";

const run = async function(){

    const browser = await playwright[browserType].launch({headless:false});
    
    const context = await browser.newContext();
    const page = await context.newPage();
    const totalSidor = 20;
    let index = 1;
    

   for (let index = 1; index <= totalSidor; index++){
     
    let url = `https://www.sbsc.se/hitta-certifikat/#/personer/kategori/behorig-ingenjor-inbrottslarm/${index}/`
    await page.goto(url);
    await page.waitForLoadState("load");
       
          //Sparar certifieringsnummer som skall läggas till i urlen för specifika namn.

             
           
            let certifieringsNummer = await (await ( await page.waitForSelector(".cert-item .cert-item__owner a", {timeout: 4000})).getAttribute("href")).slice(18);
            
            


            let namnList = await (await page.waitForSelector(".cert-item .cert-item__owner a", {timeout: 4000})).textContent();
              
            console.log(certifieringsNummer + "  ", namnList);
            
            
        
        
      //await fs.appendFile("./html.txt",certifieringsNummer, err =>{if (err) throw err; console.log("File saved!");});  // Funkar!!!
           
       
    
         
   }

    browser.close();
}



run();
