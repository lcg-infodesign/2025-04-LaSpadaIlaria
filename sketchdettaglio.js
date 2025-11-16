let data;
let hoveredVolcano = null; // il vulcano selezionato dal numero in URL
let images = {}; // oggetto per salvare le immagini dei vari tipi

function preload() {
  // Carica la tabella dei vulcani
  data = loadTable("assets/vulcanidata.csv", "csv", "header");

  // Carica le immagini di sfondo per ogni tipo di vulcano
  images["Stratovolcano"] = loadImage("assets/stratovulcano.jpg");
  images["Caldera"] = loadImage("assets/caldera.png");      
  images["Shield Volcano"] = loadImage("assets/shield.png");
  images["Submarine Volcano"] = loadImage("assets/sottomarino.png");
  images["Maars / Tuff ring"] = loadImage("assets/tuff.png");
  images["Cone"] = loadImage("assets/cone.jpg");
  images["Crater System"] = loadImage("assets/crater.png");
  images["Subglacia"] = loadImage("assets/subg.jpg");
  images["Other / Unknown"] = loadImage("assets/other.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Leggi il numero del vulcano dall'URL
  let params = new URLSearchParams(window.location.search);
  let volcanoNumber = params.get("number");

  // Cerca il vulcano nella tabella
  for (let i = 0; i < data.getRowCount(); i++) {
    if (data.getString(i, "Volcano Number") === volcanoNumber) {
      hoveredVolcano = {
        name: data.getString(i, "Volcano Name"),
        number: volcanoNumber,
        elevation: Number(data.getString(i, "Elevation (m)")),
        country: data.getString(i, "Country"),
        type: data.getString(i, "TypeCategory"),
        lastEruption: data.getString(i, "Last Known Eruption"), // Aggiungi l'eruzione
        status: data.getString(i, "Status") // Aggiungi lo status
      };
      break;
    }
  }
}

// Funzione per mappare l'eruzione a un colore
function getEruptionColor(eruption) {
  switch(eruption) {
    case "D1": return color(255, 100, 100); // rosso chiaro
    case "D2": return color(255, 0, 0);     // rosso intenso
    case "D3": return color(255, 165, 0);   // arancione
    case "D4": return color(255, 255, 0);   // giallo
    case "D5": return color(0, 255, 0);     // verde
    case "D6": return color(0, 200, 255);   // azzurro
    case "D7": return color(128, 0, 128);   // viola
    default: return color(128);             // grigio per Unknown/altro
  }
}

function draw() {
  background(0);

  if (!hoveredVolcano) return; // se non c'è vulcano valido, esci

  // Mostra l'immagine di sfondo del tipo di vulcano
  let img = images[hoveredVolcano.type];
  if (img) {
    image(img, 0, 0, width, height);
  }

  // Overlay nero 
  noStroke();
  fill(0, 200);
  rect(0, 0, width, height);

  // CERCHI CON COLORI BASATI SULL'ERUZIONE
  let centerX = width / 2;
  let centerY = height / 2;
  let baseRadius = 80;
  let numCircles;

  // Determina quante circonferenze disegnare
  if (hoveredVolcano.elevation < 0) numCircles = 2; // sottomarino
  else if (hoveredVolcano.elevation < 200) numCircles = 4;
  else if (hoveredVolcano.elevation < 500) numCircles = 5;
  else if (hoveredVolcano.elevation < 1000) numCircles = 6;
  else numCircles = 7;

  let stepRadius = 50;
  let eruptionColor = getEruptionColor(hoveredVolcano.lastEruption);

  // Cerchio centrale con colore eruzione
  fill(eruptionColor);
  noStroke();
  ellipse(centerX, centerY, baseRadius * 2);

  // Cerchi concentrici con colore eruzione
  noFill();
  stroke(eruptionColor);
  strokeWeight(2);
  for (let i = 1; i <= numCircles; i++) {
    ellipse(centerX, centerY, (baseRadius + i * stepRadius) * 2);
  }

  //  FRECCIA BACK VERSO SINISTRA
  drawBackArrow();

  // TESTO INFORMATIVO 
  textAlign(RIGHT, TOP);
  fill(255);
  textSize(40);
  text(hoveredVolcano.name, width - 50, 50);

  textSize(20);
  text(
    "Type: " + hoveredVolcano.type + "\n" +
    "Country: " + hoveredVolcano.country + "\n" +
    "Elevation: " + hoveredVolcano.elevation + " m\n" +
    "Status: " + hoveredVolcano.status + "\n" +  // Aggiungi status
    "Volcano Number: " + hoveredVolcano.number,  // Aggiungi numero
    width - 50,
    150
  );

  // LEGENDA INFOGRAFICA IN BASSO A DESTRA
  drawInfoLegend();
}

// Funzione per disegnare la freccia back
function drawBackArrow() {
  let arrowSize = 30;
  let margin = 30;
  
  fill(255);
  noStroke();
  
  // Triangolo orientato a sinistra
  triangle(
    margin, height/2,
    margin + arrowSize, height/2 - arrowSize,
    margin + arrowSize, height/2 + arrowSize
  );
  
  // Testo "BACK"
  textAlign(LEFT, CENTER);
  fill(255);
  textSize(16);
  text("BACK", margin + arrowSize + 10, height/2);
}

// Funzione per disegnare la legenda infografica
function drawInfoLegend() {
  let legendWidth = 350;
  let legendHeight = 140; // Altezza aumentata per più spazio
  let margin = 30;
  let x = width - legendWidth - margin;
  let y = height - legendHeight - margin;

  // Sfondo semitrasparente per la legenda
  fill(0, 180);
  stroke(255, 100);
  strokeWeight(1);
  rect(x, y, legendWidth, legendHeight, 10);

  // Titolo della legenda
  fill(255);
  textAlign(LEFT, TOP);
  textSize(16);
  text("VISUALIZATION KEY", x + 15, y + 15);

  // Elementi della legenda
  let iconSize = 20;

  // Primo elemento: Colore = Ultima eruzione
  let eruptionColor = getEruptionColor(hoveredVolcano.lastEruption);
  fill(eruptionColor);
  noStroke();
  ellipse(x + 15, y + 45, iconSize);

  fill(255);
  textSize(12);
  text("COLOR → Last Known Eruption", x + 40, y + 40);
  textSize(10);
  text("D1 (recent) to D7 (ancient) scale", x + 40, y + 55);

  // Secondo elemento: Cerchi = Elevazione
  noFill();
  stroke(255);
  strokeWeight(1);
  let circlesY = y + 95; // Aumentato lo spazio verticale per evitare sovrapposizioni
  // Disegna mini cerchi concentrici
  for (let i = 0; i < 4; i++) {
    ellipse(x + 15 + i * 5, circlesY, iconSize - i * 3);
  }

  fill(255);
  noStroke();
  textSize(12);
  text("CIRCLES → Elevation", x + 40, circlesY - 10);
  textSize(10);
  text("More circles = higher elevation", x + 40, circlesY + 7);
}

// Aggiungi interattività alla freccia
function mousePressed() {
  let arrowSize = 30;
  let margin = 30;
  
  // Controlla se il click è nella zona della freccia
  if (mouseX >= margin && mouseX <= margin + arrowSize &&
      mouseY >= height/2 - arrowSize && mouseY <= height/2 + arrowSize) {
    window.history.back(); // Torna alla pagina precedente
  }
}