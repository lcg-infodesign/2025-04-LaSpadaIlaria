let data;
let hoveredVolcano = null; // il vulcano selezionato dal numero in URL
let images = {}; // oggetto per salvare le immagini dei vari tipi

function preload() {
  // Carica la tabella dei vulcani
  data = loadTable("assets/vulcanidata.csv", "csv", "header");

  // Carica le immagini di sfondo per ogni tipo di vulcano
  images["Stratovolcano"] = loadImage("assets/stratovolcano.jpg");
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
        type: data.getString(i, "TypeCategory")
      };
      break;
    }
  }
}

function draw() {
  background(0);

  if (!hoveredVolcano) return; // se non c'è vulcano valido, esci

  // 1️⃣ Mostra l'immagine di sfondo del tipo di vulcano (fallback se mancante)
  let img = images[hoveredVolcano.type];
  if (img) {
    image(img, 0, 0, width, height);
  } else {
    fill(0);
    rect(0, 0, width, height);
  }

  // 2️⃣ Overlay nero 50%
  noStroke();
  fill(0, 127);
  rect(0, 0, width, height);

  // 3️⃣ Cerchio centrale + circonferenze concentriche basate sull'altezza
  let centerX = width / 2;
  let centerY = height / 2;
  let baseRadius = 50; // raggio cerchio centrale
  let numCircles;

  // Determina quante circonferenze disegnare
  if (hoveredVolcano.elevation < 0) numCircles = 2; // sottomarino
  else if (hoveredVolcano.elevation < 200) numCircles = 3;
  else if (hoveredVolcano.elevation < 500) numCircles = 4;
  else if (hoveredVolcano.elevation < 1000) numCircles = 5;
  else numCircles = 6;

  // Adatta lo spazio tra cerchi in base al numero di cerchi
  let maxStep = 40;
  let stepRadius = maxStep / numCircles;

  // Cerchio centrale
  fill(255);
  noStroke();
  ellipse(centerX, centerY, baseRadius * 2);

  // Cerchi concentrici
  noFill();
  stroke(255, 150);
  for (let i = 1; i <= numCircles; i++) {
    ellipse(centerX, centerY, (baseRadius + i * stepRadius) * 2);
  }

  // 4️⃣ Testo in alto a destra con rettangolo semitrasparente
  fill(0, 150);
  noStroke();
  rect(width - 420, 40, 400, 150, 10); // rettangolo sotto il testo

  fill(255);
  textAlign(RIGHT, TOP);
  textSize(40);
  text(hoveredVolcano.name, width - 50, 50);

  textSize(20);
  text(
    "Type: " + hoveredVolcano.type + "\n" +
    "Country: " + hoveredVolcano.country + "\n" +
    "Elevation: " + hoveredVolcano.elevation + " m",
    width - 50,
    120
  );
}
