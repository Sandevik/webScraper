const playwright = require("playwright");
const fs = require("fs");



const browserType = "chromium";

const run = async function(){
    const browser = await playwright[browserType].launch({headless:false});
    const context = await browser.newContext();
    const page = await context.newPage();
    const totalSidor = 20;
    let certNr = [];
    let namn = [];
    let webbsida = [];
    let epost = [];
    let temp = [];
    let telefonNr = [];

    for (let index = 0; index <= totalSidor; index++){
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
    } 

    //öppnar sidan för specifikt certifikatnummer loopar igenom alla certifikatnummer
    for await (let a of certNr){
        url = `https://www.sbsc.se/personcertifikat/${a}`
        await page.goto(url);
        await page.waitForLoadState();
        await page.waitForTimeout(500);
        let mail = await page.$$("body > div.off-canvas-content > section.cert-single-wrapper.space.bg-white > div > div > div > div > div > div:nth-child(3) > div p span a ");
        // pusha alla epostadresser, telefonnummer, webbsidor
        for await (let b of mail) {
          temp.push(await b.innerHTML());
        }
        //lägg telefonnummer i separat array
        for (let i = 0; i < temp.length; i+=3){
            telefonNr.push(temp[i]);
        }
        //-||- med epost
        for (let i = 1; i < temp.length; i+=3){
            epost.push(temp[i]);
        }
        //-||- med webbsida
        for (let i = 2; i < temp.length; i+=3){
            webbsida.push(temp[i]);
        }
    }
     //ta bort förta elementet som är en kopia 
            telefonNr.shift();
            epost.shift();
            webbsida.shift();
           console.log(namn[1], epost[1], certNr[1], telefonNr[1], webbsida[1])
    for (let index = 0; index < namn.length; index++) {
        //sparar allt i fil
        await fs.appendFile("./personer.txt", `${namn[index]}  ${epost[index]}  ${telefonNr[index]}  ${certNr[index]}  ${webbsida[index]}\n`, err =>{if (err) throw err; console.log("File saved!");});  
        
    }
    browser.close();
}




run();
