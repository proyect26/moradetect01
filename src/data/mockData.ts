import { Pathogen, DiseaseActivity, LearnStage, WeatherAlert, NotificationItem } from '../types';

export const USER_PROFILE = {
  name: "Chief / Jefe Agrónomo",
  avatar: "/assets/images/profile-chief.jpg",
  labAvatar: "/assets/images/profile-lab.jpg",
  expertAvatar: "/assets/images/profile-expert.jpg"
};

export const INITIAL_WEATHER_ALERT: WeatherAlert = {
  regionEs: "ALERTA CLIMÁTICA ECUADOR",
  regionEn: "ECUADOR WEATHER ALERT",
  titleEs: "Alto Riesgo de Helada",
  titleEn: "High Frost Risk",
  descriptionEs: "Humedad al 89% con descensos localizados a 4°C esta noche. Prepare los sistemas de riego por microaspersión e inversión térmica.",
  descriptionEn: "Humidity at 89% with localized temp drops to 4°C tonight. Prepare irrigation systems.",
  humidity: "89%",
  temperature: "4.2°C"
};

export const INITIAL_DISEASE_ACTIVITIES: DiseaseActivity[] = [
  {
    id: "act-1",
    titleEs: "Mildeo Polvoso",
    titleEn: "Powdery Mildew",
    locationEs: "Detectado en Zona B",
    locationEn: "Detected in Zone B",
    timeEs: "hace 2h",
    timeEn: "2h ago",
    statusEs: "GESTIONADO",
    statusEn: "ACTIONED",
    statusType: "ACTIONED",
    image: "/assets/images/disease-oidium.jpg",
    confidence: "94.2%"
  },
  {
    id: "act-2",
    titleEs: "Sospecha de Pudrición de Raíz",
    titleEn: "Root Rot Suspicion",
    locationEs: "Alta confianza • Zona C",
    locationEn: "High confidence • Zone C",
    timeEs: "hace 5h",
    timeEn: "5h ago",
    statusEs: "URGENTE",
    statusEn: "URGENT",
    statusType: "URGENT",
    image: "/assets/images/activity-rot.jpg",
    confidence: "98.1%"
  }
];

export const PATHOGENS_LIBRARY: Pathogen[] = [
  {
    id: "botrytis-mora",
    scientificName: "Botrytis cinerea (Mora)",
    commonNameEs: "Moho Gris de la Mora",
    commonNameEn: "Grey Mold on Blackberry",
    severityEs: "Crítico",
    severityEn: "Critical",
    category: "fungal",
    descriptionEs: "Enfermedad grave en frutales de mora de Castilla (Rubus glaucus). Pudre los frutos en formación y maduros, cubriéndolos de un micelio gris velloso. Favorecida por lluvias y humedad relativa mayor a 80%.",
    descriptionEn: "Severe disease in Andean blackberry (Rubus glaucus). Rots developing and ripe fruits, covering them with grey velvety mycelium.",
    symptomsEs: [
      "Ablandamiento y pudrición acuosa de la drupamanía del fruto.",
      "Masa gris de esporas fúngicas sobre las drupas de mora.",
      "Muerte descendente de brotes florales y pedúnculos."
    ],
    symptomsEn: [
      "Softening and watery rot of drupelets.",
      "Grey mass of fungal spores over blackberry drupes.",
      "Dieback of floral buds and peduncles."
    ],
    controlMeasuresEs: [
      "Poda de aireación y deshoje sanitario de ramas rastreras.",
      "Cosecha frecuente para no dejar frutos sobremaduros.",
      "Aplicación de Trichoderma harzianum y fungicidas FRAC 9/11."
    ],
    controlMeasuresEn: [
      "Aeration pruning and removal of trailing branches.",
      "Frequent harvesting avoiding overripe fruits.",
      "Application of Trichoderma harzianum and FRAC 9/11 fungicides."
    ],
    image: "/assets/images/disease-botrytis.jpg"
  },
  {
    id: "peronospora-mora",
    scientificName: "Peronospora rubi",
    commonNameEs: "Mildeo Velloso de la Mora",
    commonNameEn: "Downy Mildew of Blackberry",
    severityEs: "Alerta Max",
    severityEn: "Max Alert",
    category: "fungal",
    descriptionEs: "Provoca la deformación y desecación de brotes jóvenes y frutos incompletos ('mora seca'). Ataca folíolos produciendo manchas rojizas o púrpuras en el haz y vello gris en el envés.",
    descriptionEn: "Causes deformation and drying of young shoots and incomplete fruit development ('dry blackberry'). Produces reddish/purple spots on top and grey fuzz underneath.",
    symptomsEs: [
      "Manchas irregulares purpúreas en hojas de mora.",
      "Frutos pequeños, duros y partidos que no maduran ('mora seca').",
      "Eflorescencia grisácea en el envés de las hojas infectadas."
    ],
    symptomsEn: [
      "Irregular purple lesions on blackberry leaves.",
      "Small, hard, cracked fruits that fail to ripen ('dry berry').",
      "Greyish bloom on lower leaf surfaces."
    ],
    controlMeasuresEs: [
      "Tutorado en espaldera para evitar contacto con el suelo.",
      "Aplicaciones preventivas de Metalaxil + Mancozeb o Fosetyl-Al.",
      "Eliminación y quema de tallos afectados por 'mora seca'."
    ],
    controlMeasuresEn: [
      "Trellis training to avoid ground contact.",
      "Preventive Metalaxyl + Mancozeb or Fosetyl-Al applications.",
      "Pruning and disposal of infected shoots."
    ],
    image: "/assets/images/disease-peronospora.jpg"
  },
  {
    id: "anthracnose-mora",
    scientificName: "Colletotrichum gloeosporioides",
    commonNameEs: "Antracnosis de la Mora",
    commonNameEn: "Blackberry Anthracnose",
    severityEs: "Moderado",
    severityEn: "Moderate",
    category: "fungal",
    descriptionEs: "Afecta tallos, hojas y frutos. Produce chancros o manchas unduladas cóncavas de color púrpura-grisáceo en los tallos vegetativos de mora.",
    descriptionEn: "Affects stems, leaves, and fruits. Produces sunken purple-grey lesions on vegetative canes.",
    symptomsEs: [
      "Chancros cóncavos morados con centro gris en ramas de mora.",
      "Atrofia de tallos productivos y amarilleamiento foliar.",
      "Drupas de mora momificadas y secas."
    ],
    symptomsEn: [
      "Sunken purple cankers with grey centers on canes.",
      "Stunting of fruiting canes and foliage yellowing.",
      "Mummified and dried drupelets."
    ],
    controlMeasuresEs: [
      "Poda de cañas viejas después de la cosecha.",
      "Desinfección de tijeras con alcohol o amonio cuaternario.",
      "Aplicación de fungicidas a base de Cobre u Oxicloruro."
    ],
    controlMeasuresEn: [
      "Pruning old canes post-harvest.",
      "Disinfecting shears with alcohol or quaternary ammonium.",
      "Copper oxychloride or hydroxide sprays."
    ],
    image: "/assets/images/disease-anthracnose.jpg"
  },
  {
    id: "oidium-mora",
    scientificName: "Oidium sp.",
    commonNameEs: "Mildio Polvoso de la Mora (Cenicilla)",
    commonNameEn: "Powdery Mildew of Blackberry",
    severityEs: "Crítico",
    severityEn: "Critical",
    category: "fungal",
    descriptionEs: "Enfermedad detectada con alta incidencia (hasta 75.8% en Pamplonita y Cundinamarca). Recubre hojas jóvenes, tallos, botones y frutos con un polvillo o moho blanco harinoso, causando deformación, encrespamiento y caída de rendimiento.",
    descriptionEn: "High incidence disease (up to 75.8%). Covers young leaves, stems, buds, and fruits with white powdery growth, causing curling and yield reduction.",
    symptomsEs: [
      "Polvillo blanco harinoso sobre el haz y envés de las hojas jóvenes.",
      "Encrespamiento, deformación y enroscamiento foliar.",
      "Capa blanca sobre flores y frutos, impidiendo su crecimiento normal."
    ],
    symptomsEn: [
      "White flour-like powdery coating on young leaf surfaces.",
      "Leaf curling, distortion, and stunting.",
      "White film over flowers and berries stopping growth."
    ],
    controlMeasuresEs: [
      "Poda de despunte y eliminación de rebrotes enfermos.",
      "Aplicación de azufre elemental en polvo o mojable.",
      "Manejo de ventilación e iluminación evitando sombra excesiva."
    ],
    controlMeasuresEn: [
      "Pruning infected shoot tips.",
      "Wettable sulfur applications.",
      "Canopy management for improved aeration and light exposure."
    ],
    image: "/assets/images/disease-peronospora.jpg"
  },
  {
    id: "roya-mora",
    scientificName: "Gerwasia rubi / Kuehneola",
    commonNameEs: "Roya de la Mora",
    commonNameEn: "Blackberry Rust",
    severityEs: "Alerta Max",
    severityEn: "Max Alert",
    category: "fungal",
    descriptionEs: "Enfermedad fúngica muy extendida en cultivos de mora de Castilla. Produce pústulas amarillas o anaranjadas en el envés de las hojas, causando defoliación prematura y pérdida de vigor del follaje.",
    descriptionEn: "Widespread fungal disease in Andean blackberry. Produces yellow or orange pustules on lower leaf surface, causing defoliation.",
    symptomsEs: [
      "Pústulas polvo de color amarillo o naranja brillante en el envés foliar.",
      "Defoliación masiva en ramas productivas de mora.",
      "Debilitamiento general de la planta y menor dulzor del fruto."
    ],
    symptomsEn: [
      "Bright yellow/orange powdery pustules on lower leaf surface.",
      "Massive defoliation on fruiting canes.",
      "Stunting and reduced berry sweetness."
    ],
    controlMeasuresEs: [
      "Recolección y quema de hojas secas del suelo.",
      "Monitoreo constante en época de alta radiación y humedad.",
      "Aplicación de fungicidas sistémicos triazoles (Tebuconazol / Azoxystrobin)."
    ],
    controlMeasuresEn: [
      "Gathering and burning fallen dry leaves.",
      "Frequent scouting during humid warm weather.",
      "Systemic triazole fungicide applications (Tebuconazole / Azoxystrobin)."
    ],
    image: "/assets/images/activity-rot.jpg"
  },
  {
    id: "acaro-mora",
    scientificName: "Acalitus essigi",
    commonNameEs: "Ácaro del Fruto Rojo de la Mora",
    commonNameEn: "Red Berry Mite",
    severityEs: "Moderado",
    severityEn: "Moderate",
    category: "viral",
    descriptionEs: "Plaga microscópica que inyecta toxinas en las drupas de mora. Evita la maduración uniforme de la fruta, haciendo que drupamanías individuales permanezcan duras y de color rojo brillante.",
    descriptionEn: "Microscopic pest injecting toxins into drupelets, preventing uniform ripening and keeping berries hard and bright red.",
    symptomsEs: [
      "Drupas de mora que no maduran y quedan rojas y duras.",
      "Frutos de mora sin sabor dulce y no aptos para mercado.",
      "Deformación leve en las yemas florales."
    ],
    symptomsEn: [
      "Berries that remain bright red and hard.",
      "Lack of sweetness and unmarketable fruit.",
      "Mild bud tissue distortion."
    ],
    controlMeasuresEs: [
      "Poda de tallos viejos que hospedan plagas.",
      "Aplicaciones de azufre elemental en polvo o mojable.",
      "Uso de extractos de neem o jabón potásico preventivo."
    ],
    controlMeasuresEn: [
      "Pruning old canes hosting mites.",
      "Wettable sulfur sprays.",
      "Preventive neem extract or potassium soap."
    ],
    image: "/assets/images/disease-botrytis.jpg"
  },
  {
    id: "botrytis-cinerea",
    scientificName: "Botrytis cinerea (Rosa)",
    commonNameEs: "Moho Gris en Rosa",
    commonNameEn: "Grey Mold in Rose",
    severityEs: "Crítico",
    severityEn: "Critical",
    category: "fungal",
    descriptionEs: "Principal patógeno en la Sierra Ecuatoriana. Se manifiesta como lesiones necróticas circulares en pétalos, evolucionando a una masa de micelio gris velloso bajo condiciones de alta humedad relativa (>85%).",
    descriptionEn: "Principal pathogen in the Ecuadorian Andes. Manifests as circular necrotic lesions on petals, evolving into a velvety grey mycelium mass under high relative humidity conditions (>85%).",
    symptomsEs: [
      "Manchas acuosas y circulares en los pétalos de rosa.",
      "Micelio gris con aspecto afelpado en botones florales.",
      "Pudrición blanda del cuello de la flor en poscosecha."
    ],
    symptomsEn: [
      "Water-soaked circular spots on rose petals.",
      "Velvety grey mycelium on flower buds.",
      "Soft rot at flower neck during post-harvest."
    ],
    controlMeasuresEs: [
      "Manejo de ventilación nocturna en invernaderos.",
      "Eliminación inmediata de restos florales.",
      "Aplicación de fungicidas preventivos previo al corte."
    ],
    controlMeasuresEn: [
      "Nocturnal greenhouse ventilation control.",
      "Immediate floral residue removal.",
      "Preventive fungicide application prior to harvest."
    ],
    image: "/assets/images/disease-botrytis.jpg"
  },
  {
    id: "colletotrichum",
    scientificName: "Colletotrichum spp.",
    commonNameEs: "Antracnosis",
    commonNameEn: "Anthracnose",
    severityEs: "Moderado",
    severityEn: "Moderate",
    category: "fungal",
    descriptionEs: "Causa lesiones hundidas y oscuras en tallos y hojas. En el contexto andino, su propagación se ve favorecida por el salpicado de agua de riego y temperaturas templadas constantes.",
    descriptionEn: "Causes dark sunken lesions on stems and foliage. In Andean climates, spread is promoted by splash irrigation and constant mild temperatures.",
    symptomsEs: [
      "Lesiones elípticas u oscuras con bordes rojizos en tallos.",
      "Defoliación prematura en brotes jóvenes.",
      "Anecrosamiento puntual de brotes basales."
    ],
    symptomsEn: [
      "Dark elliptical lesions with reddish borders on stems.",
      "Premature defoliation on young shoots.",
      "Basal shoot dieback."
    ],
    controlMeasuresEs: [
      "Optimización del sistema de riego por goteo.",
      "Poda sanitaria y desinfección de herramientas.",
      "Uso de sales de cobre como barrera física."
    ],
    controlMeasuresEn: [
      "Drip irrigation system optimization.",
      "Sanitary pruning and tool sterilization.",
      "Use of copper salts as a physical barrier."
    ],
    image: "/assets/images/disease-anthracnose.jpg"
  },
  {
    id: "peronospora-sparsa",
    scientificName: "Peronospora sparsa",
    commonNameEs: "Mildeo velloso",
    commonNameEn: "Downy Mildew",
    severityEs: "Alerta Max",
    severityEn: "Max Alert",
    category: "fungal",
    descriptionEs: "La enfermedad más devastadora para la exportación. Manchas irregulares púrpuras en el haz de la hoja. Se activa agresivamente con fluctuaciones térmicas bruscas típicas de los Andes.",
    descriptionEn: "The most devastating export disease. Irregular purplish spots on upper leaf surfaces. Activates aggressively with sudden thermal shifts in Andean valleys.",
    symptomsEs: [
      "Manchas poligonales púrpuras a marrones en hojas.",
      "Eflorescencia gris purpúrea en el envés foliolar.",
      "Desprendimiento masivo foliar al menor contacto."
    ],
    symptomsEn: [
      "Polygonal purple-to-brown spots on leaves.",
      "Purplish-grey bloom on underside of leaf.",
      "Massive leaf drop upon light contact."
    ],
    controlMeasuresEs: [
      "Control estricto de humedad relativa por debajo del 70%.",
      "Monitoreo diario en puntos de rocío.",
      "Rotación de fungicidas sistémicos específicos."
    ],
    controlMeasuresEn: [
      "Strict humidity control under 70%.",
      "Daily dew-point monitoring.",
      "Rotation of specialized systemic fungicides."
    ],
    image: "/assets/images/disease-peronospora.jpg"
  }
];

export const LEARN_STAGES: LearnStage[] = [
  {
    id: "stage-1",
    stageNumber: "01",
    titleEs: "Morfología",
    titleEn: "Morphology",
    descriptionEs: "Explora la biología básica de la planta, incluyendo un análisis detallado de Raíces, Tallos y Hojas.",
    descriptionEn: "Explore the foundational biology of the plant, including detailed analysis of Roots, Stems, and Leaves.",
    tagsEs: ["SISTEMA RADICULAR", "ANATOMÍA DEL TALLO", "FOLLAJE"],
    tagsEn: ["ROOT SYSTEM", "STEM ANATOMY", "FOLIAGE"],
    icon: "psychology",
    image: "/assets/images/disease-healthy.jpg",
    keyTakeawaysEs: [
      "Estructura foliar de rosa: Folíolos con estípulas dentadas y nervadura pinnada.",
      "Anatomía vascular: Xilema y floema para transporte hídrico en gradiente andino.",
      "Tallo y espinas: Protección mecánica y reserva de fotoasimilados."
    ],
    keyTakeawaysEn: [
      "Rose foliar structure: Leaflets with dentate stipules and pinnate venation.",
      "Vascular anatomy: Xylem and phloem for water transport under Andean gradients.",
      "Stem and prickles: Mechanical protection and photoassimilate storage."
    ]
  },
  {
    id: "stage-2",
    stageNumber: "02",
    titleEs: "Suelo y Siembra",
    titleEn: "Soil & Planting",
    descriptionEs: "Optimización del sustrato para el máximo rendimiento. Enfoque en Drenaje y mantenimiento de un pH entre 5.5-6.5.",
    descriptionEn: "Optimizing the substrate for maximum yield. Focus on Drains and maintaining a pH between 5.5-6.5.",
    tagsEs: ["SUSTRATO", "PH 5.5 - 6.5", "DRENAJE"],
    tagsEn: ["SUBSTRATE", "PH 5.5 - 6.5", "DRAINAGE"],
    icon: "layers",
    targetPh: "5.5 - 6.5",
    keyTakeawaysEs: [
      "Sustrato ideal: Mezcla equilibrada de cascarilla de arroz, turba y pómez.",
      "Monitoreo de CE (Conductividad Eléctrica): Mantener entre 1.2 y 1.8 dS/m.",
      "Capacidad de aireación mínima del 20% para prevenir asfixia radicular."
    ],
    keyTakeawaysEn: [
      "Ideal substrate: Balanced mix of rice husk, peat, and pumice.",
      "EC (Electrical Conductivity) monitoring: Keep between 1.2 and 1.8 dS/m.",
      "Minimum aeration capacity of 20% to prevent root asphyxiation."
    ]
  },
  {
    id: "stage-3",
    stageNumber: "03",
    titleEs: "Labores Culturales",
    titleEn: "Cultural Labors",
    descriptionEs: "Técnicas avanzadas de mantenimiento: Poda y el sistema especializado de Tutorado en configuración Doble T.",
    descriptionEn: "Advanced maintenance techniques: Pruning and the specialized Tutor system in Double T configuration.",
    tagsEs: ["TUTORADO DOBLE T", "PODA SANITARIA", "DESBOTONADO"],
    tagsEn: ["DOUBLE T TUTOR", "SANITARY PRUNING", "DISBUDDING"],
    icon: "content_cut",
    images: [
      "/assets/images/disease-botrytis.jpg",
      "/assets/images/disease-peronospora.jpg"
    ],
    keyTakeawaysEs: [
      "Configuración Doble T: Sostiene los tallos florales verticales previniendo arqueamientos.",
      "Poda de formación: Estimula el brotamiento basal continuo para ciclos de producción exportable.",
      "Desbotonado apical: Concentra fotoasimilados en el botón principal."
    ],
    keyTakeawaysEn: [
      "Double T Configuration: Keeps floral stems vertical, preventing bending.",
      "Formative Pruning: Stimulates continuous basal sprouting for export cycles.",
      "Apical Disbudding: Concentrates photoassimilates on the primary bud."
    ]
  },
  {
    id: "stage-4",
    stageNumber: "04",
    titleEs: "Manejo Fitosanitario",
    titleEn: "Phytosanitary Management",
    descriptionEs: "Prevención de enfermedades y seguimiento de salud en tiempo real utilizando el avanzado sistema de monitoreo SisFito.",
    descriptionEn: "Real-time disease prevention and health tracking using the advanced SisFito monitoring system.",
    tagsEs: ["MONITOREO SISFITO", "ROTACIÓN FUNGICIDAS", "PUNTO DE ROCÍO"],
    tagsEn: ["SISFITO MONITORING", "FUNGICIDE ROTATION", "DEW POINT"],
    icon: "monitoring",
    statusBadgeEs: "Monitoreo Activo",
    statusBadgeEn: "Active Monitoring",
    keyTakeawaysEs: [
      "SisFito Radar: Red de sensores en tiempo real para HR, Temperatura y Punto de Rocío.",
      "Resistencia Fúngica: Alternancia obligatoria entre FRAC groups (Triazoles, Strobilarinas, Carboxamidas).",
      "Calibración de Boquillas: Aplicación eficiente con tamaño de gota de 150-200 micras."
    ],
    keyTakeawaysEn: [
      "SisFito Radar: Real-time sensor network for RH, Temp, and Dew Point.",
      "Fungal Resistance: Mandatory alternation between FRAC groups.",
      "Nozzle Calibration: Efficient application with droplet size 150-200 microns."
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-crop-fumigar",
    titleEs: "🧪 Programación Lote #1: Momento de Fumigar",
    titleEn: "🧪 Lot #1 Schedule: Time to Spray",
    descEs: "Según la Carpeta Lote #1 (Días 8 - 14): Realizar Aplicación Foliar Preventiva de Trichoderma + Calcio/Boro para proteger floración contra Botrytis.",
    descEn: "According to Lot #1 Folder (Days 8-14): Apply preventive foliar Trichoderma + Calcium/Boron against Botrytis.",
    time: "Hoy - Programado",
    read: false,
    type: "crop_task",
    folderName: "Carpeta Lote #1 - Mora de Castilla",
    actionType: "FUMIGAR",
    actionPrompt: "Hola Robot Agrónomo Moradetec, mi Lote #1 de Mora está en etapa de Floración (Días 8-14) y me corresponde FUMIGAR. ¿Cuáles son las dosis exactas, técnica de aplicación y precauciones contra Botrytis?",
  },
  {
    id: "notif-crop-deslavar",
    titleEs: "🍃 Programación Lote #2: Día de Deslavar y Poda",
    titleEn: "🍃 Lot #2 Schedule: Foliage Washing & Pruning Day",
    descEs: "Según la Carpeta Lote #2 (Días 1 - 7): Corresponde deslavar follaje y poda de sanidad para reducir humedad acumulada y prevenir Mildeo.",
    descEn: "According to Lot #2 Folder (Days 1-7): Wash foliage and perform sanitation pruning to avoid humidity and Mildew.",
    time: "Hoy - En Curso",
    read: false,
    type: "crop_task",
    folderName: "Carpeta Lote #2 - Parcela Alta",
    actionType: "DESLAVAR",
    actionPrompt: "Hola Robot Agrónomo, debo DESLAVAR y sanear el follaje del Lote #2 en etapa de brote. ¿Cuál es el procedimiento correcto de lavado/desinfectado foliar sin afectar las yemas?",
  },
  {
    id: "notif-crop-cosechar",
    titleEs: "🫐 Programación Lote #1: Fecha de Cosecha",
    titleEn: "🫐 Lot #1 Schedule: Harvest Date",
    descEs: "Según la Carpeta Lote #1 (Días 22 - 30): Frutos listos para cosecha y recolección. Asegurar inocuidad y manejo poscosecha.",
    descEn: "According to Lot #1 Folder (Days 22-30): Fruits ready for harvest. Maintain food safety and post-harvest care.",
    time: "Próximo (Día 22)",
    read: false,
    type: "crop_task",
    folderName: "Carpeta Lote #1 - Mora de Castilla",
    actionType: "COSECHAR",
    actionPrompt: "Hola Robot Agrónomo, mi Lote #1 entra en etapa de COSECHA de Mora. ¿Qué recomendaciones de grados Brix, empaque y manipulación de poscosecha debo aplicar?",
  },
  {
    id: "notif-1",
    titleEs: "Riesgo de Helada en Valle Central",
    titleEn: "Frost Risk in Central Valley",
    descEs: "Inversión térmica proyectada para las 03:00 AM. Se recomienda encender microaspersores.",
    descEn: "Thermal inversion projected for 03:00 AM. Micro-sprinklers recommended.",
    time: "Hace 20 min",
    read: false,
    type: "alert"
  },
  {
    id: "notif-2",
    titleEs: "Alerta SisFito: Humedad en Zona B",
    titleEn: "SisFito Alert: Humidity in Zone B",
    descEs: "La humedad relativa superó el 88%. Incremento de spore count de Botrytis.",
    descEn: "Relative humidity exceeded 88%. Increase in Botrytis spore count.",
    time: "Hace 1 hora",
    read: false,
    type: "scan"
  },
  {
    id: "notif-3",
    titleEs: "Nuevo Protocolo Fitosanitario Disponible",
    titleEn: "New Phytosanitary Protocol Available",
    descEs: "Se actualizó la guía para Peronospora sparsa en el módulo de Biblioteca.",
    descEn: "Updated protocol for Peronospora sparsa in Library module.",
    time: "Hace 3 horas",
    read: true,
    type: "info"
  }
];
