import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as tflite from '@tensorflow/tfjs-tflite';

let model: tflite.TFLiteModel | null = null;
let isInitializing = false;

// 0: Antracnosis
// 1: Botrytis
// 2: Mildeo Polvoso
// 3: Mildeo Velloso
// 4: Roya
const CLASSES = [
  {
    pathogenName: 'Colletotrichum gloeosporioides (Antracnosis)',
    scientificName: 'Colletotrichum gloeosporioides',
    commonName: 'Antracnosis / Muerte Descendente',
    severity: 'CRÍTICO',
    symptoms: [
      'Lesiones necróticas oscuras y cóncavas en hojas y tallos.',
      'Secamiento de ramas desde el ápice hacia la base.',
      'Chancros hundidos en tallos principales.'
    ],
    controlMeasures: [
      'Poda sanitaria y desinfección estricta de herramientas.',
      'Aplicación de fungicidas (ej. Difenoconazol o Prochloraz).',
      'Evitar exceso de humedad en el dosel.'
    ],
    phytosanitaryNotes: 'Antracnosis detectada por el modelo IA. Alta probabilidad de propagación si no se trata rápidamente.'
  },
  {
    pathogenName: 'Botrytis cinerea (Moho Gris)',
    scientificName: 'Botrytis cinerea',
    commonName: 'Moho Gris / Pudrición',
    severity: 'URGENTE',
    symptoms: [
      'Vello grisáceo o aterciopelado sobre frutos y flores.',
      'Pudrición blanda en bayas.',
      'Lesiones húmedas de color marrón claro.'
    ],
    controlMeasures: [
      'Cosecha oportuna y manipulación limpia.',
      'Manejo de ventilación para reducir la humedad.',
      'Aplicación de fungicidas biológicos (ej. Trichoderma).'
    ],
    phytosanitaryNotes: 'Botrytis detectada. Favorecida por lluvias recientes o alta humedad. Requiere acción urgente para proteger la fruta.'
  },
  {
    pathogenName: 'Podosphaera pannosa (Mildeo Polvoso)',
    scientificName: 'Podosphaera pannosa',
    commonName: 'Mildeo Polvoso / Cenicilla',
    severity: 'MODERADO',
    symptoms: [
      'Polvillo blanco o eflorescencia algodonosa en hojas.',
      'Enrollamiento hacia arriba de los bordes foliares.',
      'Reducción del vigor fotosintético.'
    ],
    controlMeasures: [
      'Aplicar azufre elemental o bicarbonato de potasio.',
      'Poda de aireación.',
      'Evitar riegos por aspersión que mojen el follaje por la noche.'
    ],
    phytosanitaryNotes: 'Mildeo Polvoso (Oídio) detectado por la IA. Tratamiento preventivo con azufre es recomendado.'
  },
  {
    pathogenName: 'Peronospora sparsa (Mildeo Velloso)',
    scientificName: 'Peronospora sparsa',
    commonName: 'Mildeo Velloso / Peronospora',
    severity: 'URGENTE',
    symptoms: [
      'Manchas angulares rojizas-púrpuras delimitadas por nervaduras.',
      'Vello grisáceo discreto en el envés (haz inferior) de la hoja.',
      'Defoliación prematura severa.'
    ],
    controlMeasures: [
      'Aplicación de fungicidas sistémicos (ej. Metalaxil + Mancozeb).',
      'Mejorar drenaje y evitar encharcamientos.',
      'Uso de inductores de resistencia (Fosfito de Potasio).'
    ],
    phytosanitaryNotes: 'Mildeo Velloso (Peronospora) identificado. Enfermedad destructiva en mora que requiere manejo inmediato.'
  },
  {
    pathogenName: 'Gerwasia rubi (Roya)',
    scientificName: 'Gerwasia sp. / G. rubi',
    commonName: 'Roya de la Mora',
    severity: 'MODERADO',
    symptoms: [
      'Pústulas amarillentas o anaranjadas en el envés de la hoja.',
      'Clorosis y manchas amarillas en el haz.',
      'Caída prematura de las hojas afectadas.'
    ],
    controlMeasures: [
      'Recolección y destrucción de hojas enfermas.',
      'Aplicación de fungicidas protectantes y curativos (triazoles).',
      'Mantener podas de aireación adecuadas.'
    ],
    phytosanitaryNotes: 'Roya detectada por la IA. Suele presentarse en condiciones de humedad y temperaturas medias.'
  }
];

export async function initializeModel() {
  if (model) return;
  if (isInitializing) {
    // Wait until initialized
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return;
  }
  
  isInitializing = true;
  try {
    console.log('[TFLite] Inicializando TensorFlow.js...');
    await tf.setBackend('webgl'); // Intenta usar GPU primero
    await tf.ready();
    
    // Ruta a los archivos WASM
    // En Capacitor/Vite, estos estarán en /tflite/
    tflite.setWasmPath('/tflite/');
    
    console.log('[TFLite] Cargando modelo_mora.tflite...');
    model = await tflite.loadTFLiteModel('/models/modelo_mora.tflite');
    console.log('[TFLite] Modelo cargado con éxito.');
  } catch (error) {
    console.error('[TFLite] Error cargando modelo:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

export async function runInference(imageBase64: string) {
  if (!model) {
    await initializeModel();
  }
  if (!model) {
    throw new Error('El modelo no pudo ser cargado.');
  }

  return new Promise<any>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageBase64;
    img.onload = () => {
      try {
        // 1. Convertir imagen a Tensor
        const tensor = tf.browser.fromPixels(img);
        
        // 2. Pre-procesamiento (MobileNetV3 asume 224x224, valores normalizados)
        // Redimensionar
        const resized = tf.image.resizeBilinear(tensor, [224, 224]);
        
        // MobileNet standard normalization can be [-1, 1] or [0, 1]
        // Asumiendo normalización estándar [0, 1] para la mayoría de TFLite exportados de Keras
        const normalized = resized.div(255.0).expandDims(0); // [1, 224, 224, 3]

        // 3. Ejecutar modelo
        const resultTensor = model!.predict(normalized) as tf.Tensor;
        
        // 4. Obtener resultados
        const probabilities = resultTensor.dataSync() as Float32Array;
        console.log('[TFLite] Probabilidades sin procesar:', probabilities);

        // Limpiar memoria de tensores
        tensor.dispose();
        resized.dispose();
        normalized.dispose();
        resultTensor.dispose();

        // 5. Encontrar la clase ganadora
        let maxIndex = 0;
        let maxProb = probabilities[0];
        for (let i = 1; i < probabilities.length; i++) {
          if (probabilities[i] > maxProb) {
            maxProb = probabilities[i];
            maxIndex = i;
          }
        }

        const confidence = (maxProb * 100).toFixed(1);
        
        // Mapear resultado
        // Fallback safety if the model outputs fewer or more classes
        const predictedClassIndex = maxIndex < CLASSES.length ? maxIndex : 0;
        const diseaseData = CLASSES[predictedClassIndex];

        resolve({
          ...diseaseData,
          confidence,
          phytosanitaryNotes: `${diseaseData.phytosanitaryNotes} [Inferencia Ejecutada 100% On-Device con TFLite / TF.js]`
        });

      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => {
      reject(new Error('No se pudo cargar la imagen para inferencia.'));
    };
  });
}
