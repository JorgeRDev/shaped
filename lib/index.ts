import Sharp from "./sharp";
import loadSharpModule from "./sharp";

async function processImage(options) {
  const sharpNative = await loadSharpModule;

  sharpNative.pipeline(options, (err, data, info) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Data:", data);
      console.log("Info:", info);
    }
  });
}

// Ejemplo de uso
const options = {
  // Define tus opciones aquí
};

processImage(options).catch(console.error);
