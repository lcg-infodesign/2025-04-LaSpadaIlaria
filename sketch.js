let data;
let minelevation, maxelevation;
let allelevation;
let allnames, allnumbers, allcountry;
let baseradius = 25;
let maxradius = 450;
let hoveredVolcano = null; // per salvare il vulcano sotto il mouse
 let legenda = [
  { type: "Stratovolcano", color: [255, 173, 177] },
  { type: "Caldera", color: [189, 178, 255] },
  { type: "Vulcano a scudo", color: [255, 214, 165] },
  { type: "Vulcano sottomarino", color: [160, 196, 255] },
  { type: "Maar", color: [255, 214, 165] },
  { type: "Cono vulcanico", color: [202, 255, 191] },
  { type: "Sistema craterico", color: [255, 198, 255] },
  { type: "Subglaciale", color: [155, 246, 255] },
  { type: "Sconosciuto", color: [128, 128, 128] }
];

function preload() {
  data = loadTable("assets/vulcanidata.csv", "csv", "header")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Elevazioni numeriche
  allelevation = data.getColumn("Elevation (m)").map(Number); //gli dico di riprendere questa colonna
  minelevation = min(allelevation); //gli dico di prendere il numero minimo
  maxelevation = max(allelevation); //gli dico di prendere il numero massimo

  // Nomi, numeri e paesi
  allnames = [];
  allnumbers = [];
  allcountry = [];

  // ciclo per leggere le stringhe dai dati
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    allnames.push(data.getString(rowNumber,"Volcano Name")); //prendo i nomi
    allnumbers.push(data.getString(rowNumber,"Volcano Number")); //prendo i numeri
    allcountry.push(data.getString(rowNumber,"Country")); //prendo i paesi
  }
}

function draw() {
  background(10);
  hoveredVolcano = null; //rende il tutto fluido

  let closestDist = Infinity; //per calcolare solo il pallino più vicino al mouse
  let closestIndex = -1;

  // disegniamo un pallino per ogni vulcano, la posizione è data dall’elevazione
  for (let i = 0; i < data.getRowCount(); i++) {
    let elev = allelevation[i]; //Prendi l’elevazione corrispondente al vulcano i dall’array allelevation
    let radius = map(elev, minelevation, maxelevation, baseradius, maxradius); 
    //con map prendo un numero in un certo intervallo e lo riporta in un altro intervallo

    let angle = map(i, 0, data.getRowCount(), 0, 360); 
    //trasformi l’indice i in un angolo tra 0° e 360° per distribuire uniformemente tutti i vulcani intorno al cerchio
    let x = cos(angle) * radius + width/2; 
    let y = sin(angle) * radius + height/2;

    let type = data.getString(i, "TypeCategory"); //questo mi serve per dare i colori

    // impostiamo i colori in base al tipo di vulcano
    if (type === "Stratovolcano") {
      fill(255, 173, 177); // rosso stratovolcano
    } else if (type === "Caldera") {
      fill(189, 178, 255); // viola
    } else if (type === "Shield Volcano") {
      fill(255, 214, 165); // arancione
    } else if (type === "Submarine Volcano") {
      fill(160, 196, 255); // blu
    } else if (type === "Maars / Tuff ring") {
      fill(255, 214, 165); // arancio
    } else if (type === "Cone") {
      fill(202, 255, 191); // verde 
    } else if (type === "Crater System") {
      fill(255, 198, 255); // rosa
    } else if (type === "Subglacia") {
      fill(155, 246, 255); // azzurro
    } else if (type === "Other / Unknown") {
      fill(128, 128, 128); // bianco
    }

    // per il cerchio e il mouseover
    let d = dist(mouseX, mouseY, x, y); //dist è una funzione p5 per calcolare la distanza tra due punti
    if (d < closestDist && d < 6) {
      closestDist = d;
      closestIndex = i;
    }

    ellipse(x, y, 6); // disegna tutti i pallini piccoli
  }

  // dopo il ciclo: ingrandisci solo il più vicino
  if (closestIndex !== -1) {
    let elev = allelevation[closestIndex];
    let radius = map(elev, minelevation, maxelevation, baseradius, maxradius);
    let angle = map(closestIndex, 0, data.getRowCount(), 0, 360);
    let x = cos(angle) * radius + width/2;
    let y = sin(angle) * radius + height/2;

    let type = data.getString(closestIndex, "TypeCategory");


    fill(255);
    ellipse(x, y, 15); // ingrandisci solo questo pallino


  }

  // se c’è un vulcano sotto il mouse, scriviamo le info nel pannello
  if (hoveredVolcano) {
    fill(210, 50); // rettangolo semitrasparente
    noStroke();
    rect(width - 350, 80, 250, 120, 10); // rettangolo arrotondato con posizione e grandezza

    fill(255);
    textSize(15);
    textAlign(LEFT, TOP);
    text(
      hoveredVolcano.name + "\n" +
      "Number: " + hoveredVolcano.number + "\n" +
      "Elevation: " + hoveredVolcano.elevation + " m\n" +
      "Country: " + hoveredVolcano.country,
      width - 330,
      105
    );
  }

  // disegniamo i cerchi concentrici per i metri
  let numCerchio = 5; // quanti cerchi concentrici voglio
  for (let b = 0; b < numCerchio; b++) {
    let elevStep = map(b, 0, numCerchio, minelevation, maxelevation);
    let radiuscerchi = map(elevStep, minelevation, maxelevation, baseradius, maxradius);

    noFill();
    stroke(255, 60);
    ellipse(width/2, height/2, radiuscerchi * 2);

    noStroke();
    fill(255);
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text(int(elevStep) + " m", width/2, height/2 - radiuscerchi - 6);
  }

  //INIZIO A DISEGNARE LA LEGENDA

    let startX = width - 330; // 200 px dal bordo destro
    let startY = height / 2 - (legenda.length * 20) / 2;

  for (let c = 0; c < legenda.length; c++) {
    let yLegenda = startY + c * 25; // distanza tra le righe
    fill(legenda[c].color);
    ellipse(startX, yLegenda, 10);
    fill(255);
    textAlign(LEFT, CENTER);
    text(legenda[c].type, startX + 20, yLegenda);
  }


  noStroke();
fill(255);
textAlign(LEFT, TOP);
textSize(22);
text("esercitazione 3", 30, 30);


// -----------------------------
// Funzione che gestisce il click del mouse
// -----------------------------
function mousePressed() { 
  // Se l’utente sta hoverando un vulcano, apri la pagina di dettaglio e passa il numero "univoco" 
  if (hoveredVolcano) { 
    // Puoi passare altri parametri se vuoi, basta aggiungerli all’URL 
    window.location.href = "indexdettaglio.html?number=" + encodeURIComponent(hoveredVolcano.number); 
  } 
  // Se non c’è un vulcano sotto il mouse, non fai nulla
}
}