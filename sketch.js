let data;

function preload() {
  data = loadTable("assets/vulcanidata.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  /*if (data) {
    console.log("Dati caricati correttamente");
    console.log(data.getRowCount() + " righe in tabella");
    console.log(data.getColumnCount() + " colonne in tabella");
    console.log("Esempio:", data.getRow(0).arr);
  } else {
    console.log("Errore: tabella non caricata");
  } */
}

function draw() {
  // put drawing code here
}
