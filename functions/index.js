import functions, { logger } from "firebase-functions";
import vision from "@google-cloud/vision";
import admin from "firebase-admin";

//Vediamo i cambiamenti dell'oggetto nel cloud storage bucket di default
export const readReceiptDetails = functions.storage
  .object()
  //onFinalize si triggera quando un nuovo oggetto
  //o una nuova generazione di un oggetto esistente é creato con successo nel bucket
  //questo include la copia o la riscrittura di un oggetto esistente
  //un upload fallito non triggera questo evento
  .onFinalize(async (object) => {
    //cloud storage object contiene molti attibuti tra i quali
    //lo storage bucket che contiene file, i path e il bucket content type e file size
    const imageBucket = `gs://${object.bucket}/${object.name}`;
    //Servizio che esegue attività di rilevamento cloud sulle immagini
    const client = new vision.ImageAnnotatorClient();

    const [textDetection] = await client.textDetection(imageBucket);
    const [annotation] = textDetection.textAnnotations;
    const text = annotation ? annotation.description : "";
    //Possiamo loggare il testo in Cloud Functions per vedere se é stato parsato correttamente
    logger.log(text);
  });
