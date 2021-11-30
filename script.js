const playwright = require("playwright");
const fs = require("fs");



const browserType = "chromium";

const run = async function(){

    const browser = await playwright[browserType].launch({headless:false});
    
    const context = await browser.newContext();
    const page = await context.newPage();
    const totalSidor = 20;
    
    let certNr = ["10-538", "0-143" ];
    let namn = [];
    let adress= [];
    let epost = [];
    let temp = [];

  /* for (let index = 0; index <= totalSidor; index++){
     //Hämta namn och certifieringsnummer
        let url = `https://www.sbsc.se/hitta-certifikat/#/personer/kategori/behorig-ingenjor-inbrottslarm/${index}/`
         await page.goto(url);
         await page.waitForLoadState("load");
          //Sparar certifieringsnummer som skall läggas till i urlen för specifika namn
         await page.waitForTimeout(1200); // denna är viktig för att få med alla namn och cert nummer
        
         const antal = await page.$$(".cert-item .cert-item__owner a");
         for await (const a of antal){
             
               let certifieringsNummer = await (await (a).getAttribute("href")).slice(18);
               let namnList = await (a).textContent();
               namn.push(namnList);
              certNr.push(certifieringsNummer);
              
         }        
         
    }*/

    //öppnar sidan för specifikt certifikatnummer loopar igenom alla certifikatnummer
    for  (let a of certNr){

        url = `https://www.sbsc.se/personcertifikat/${a}`
        await page.goto(url);
        await page.waitForLoadState("load");
       // let mail = await page.$("body > div.off-canvas-content > section.cert-single-wrapper.space.bg-white > div > div > div > div > div > div:nth-child(3) > div > p:nth-child(10) > span:nth-child(2) > a");

        let mail = await page.$$("body > div.off-canvas-content > section.cert-single-wrapper.space.bg-white > div > div > div > div > div > div:nth-child(3) > div p span a ");

        for await (let b of mail) {
            
          console.log(await b.innerHTML());
        }

        

        
        
        

    }
   
    
    browser.close();

    //await fs.appendFile("./html.txt",certifieringsNummer, err =>{if (err) throw err; console.log("File saved!");});  // Funkar!!! 
    
}




run();
