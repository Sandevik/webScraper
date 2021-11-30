const playwright = require("playwright");
const fs = require("fs");
const { toArray } = require("cheerio/lib/api/traversing");

//Inkosekvent då vissa personer inte har mail eller telefonnummer eller liknande men bra proof of concept!
// Ett sätt att göra det mer consistant är att spara alla cerifikatnummrenas items (epost, webbsida, telefonnummer) hos certifikatnummrena för att hålla reda på dem lättare och sedan sätta ihop dem med namn arrayen. Skita i ordningen men få rätt items på rätt ställe! Spelar ingen roll vad personen har då, då kan man lägga in allt den har istället för att försöka lägga in det som den inte har då skulle ordningen mellan alla namn och deras items stämma 100%. 
//let alltArray = (...namn[i] + ...temp[i]); console.log(alltArray[0]); => namn, namn.abc@acd.se, 070213142, abc.com, 20-231 (om allt finns, annars) => namn, namn.abc@acd.se abc.com (om bara epost och webbaddress finns)

//Reflektering åvan ^^

const browserType = "chromium";
const run = async function(){
    const browser = await playwright[browserType].launch({headless:false});
    const context = await browser.newContext();
    const page = await context.newPage();
    const totalSidor = 20;
    let certNr = [];
    let namn = [];
    let temp = [];
    let totArray = [];

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
    for (let a = 0; a < certNr.length; a++){
        url = `https://www.sbsc.se/personcertifikat/${certNr[a]}`
        await page.goto(url);
        await page.waitForLoadState();
        await page.waitForTimeout(500);
        let mail = await page.$$("body > div.off-canvas-content > section.cert-single-wrapper.space.bg-white > div > div > div > div > div > div:nth-child(3) > div p span a ");
        // pusha alla epostadresser, telefonnummer, webbsidor
        for await (let b of mail) {
          temp.push(await b.innerHTML());
          
          totArray[a] = [namn[a], ...temp];
          
        }
        temp = [];
    }
   console.log(totArray);
           
    for (let index = 0; index < namn.length; index++) {
       
             //sparar allt i fil
        await fs.appendFile("./personer2.txt", `${totArray[index]}    certifikatnummer:${certNr[index]}\n`, err =>{if (err) throw err; console.log("File saved!");});  
       

    }
    browser.close();
}
run();
