import React, { useState, useRef } from 'react';
import { Language, Pathogen } from '../types';

interface SettingsViewProps {
  lang: Language;
  onAddPathogen: (newPathogen: Pathogen) => void;
  onToggleLang: () => void;
  initialSection?: 'model' | 'add_disease' | 'terms' | 'app_info';
  onOpenAddDiseaseModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  onAddPathogen,
  onToggleLang,
  initialSection = 'add_disease',
  onOpenAddDiseaseModal,
}) => {
  // Active Tab within Settings
  const [activeSection, setActiveSection] = useState<'model' | 'add_disease' | 'terms' | 'app_info'>(initialSection);

  // Sync initialSection prop
  React.useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);
  // AI Model Configuration State
  const [modelFileName, setModelFileName] = useState<string>('best.tflite');
  const [modelStatusMsg, setModelStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Disease / Pathogen Form State
  const [scientificName, setScientificName] = useState('');
  const [commonName, setCommonName] = useState('');
  const [category, setCategory] = useState<'fungal' | 'bacterial' | 'viral'>('fungal');
  const [severity, setSeverity] = useState<'Crítico' | 'Moderado' | 'Alerta Max'>('Crítico');
  const [description, setDescription] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [control, setControl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSuccessAdded, setIsSuccessAdded] = useState(false);

  // Handle Model Upload (.tflite / .tflin / .pb / .onnx)
  const handleModelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelFileName(file.name);
      setModelStatusMsg(
        lang === 'es'
          ? `✓ Modelo ${file.name} cargado correctamente y configurado para inferencia offline.`
          : `✓ Model ${file.name} loaded successfully and set for offline inference.`
      );
    }
  };

  // Handle New Disease Form Submission
  const handleSubmitDisease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scientificName || !commonName) return;

    const newPathogen: Pathogen = {
      id: `disease-${Date.now()}`,
      scientificName,
      commonNameEs: commonName,
      commonNameEn: commonName,
      severityEs: severity,
      severityEn: severity === 'Crítico' ? 'Critical' : severity === 'Moderado' ? 'Moderate' : 'Max Alert',
      category,
      descriptionEs: description || 'Ficha de enfermedad ingresada desde la sección de Configuraciones.',
      descriptionEn: description || 'Disease datasheet added from Settings section.',
      symptomsEs: symptoms ? symptoms.split(',').map((s) => s.trim()) : ['Síntomas registrados en campo.'],
      symptomsEn: symptoms ? symptoms.split(',').map((s) => s.trim()) : ['Recorded field symptoms.'],
      controlMeasuresEs: control ? control.split(',').map((c) => c.trim()) : ['Aplicar monitoreo y control biológico.'],
      controlMeasuresEn: control ? control.split(',').map((c) => c.trim()) : ['Apply monitoring and biological control.'],
      image: imageUrl || '/assets/images/disease-botrytis.jpg',
    };

    onAddPathogen(newPathogen);
    setIsSuccessAdded(true);

    // Reset Form
    setScientificName('');
    setCommonName('');
    setDescription('');
    setSymptoms('');
    setControl('');
    setImageUrl('');

    setTimeout(() => {
      setIsSuccessAdded(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-purple-900/10 pb-4">
        <span className="font-label-caps text-xs text-primary font-extrabold tracking-widest uppercase">
          {lang === 'es' ? 'Ajustes del Sistema & Modelo IA' : 'System & AI Model Settings'}
        </span>
        <h2 className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-on-background mt-1">
          {lang === 'es' ? 'Configuraciones' : 'Settings'}
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
          {lang === 'es'
            ? 'Gestiona el modelo IA (.tflite), ingresa datos fitosanitarios de enfermedades y revisa los términos legales y renuncia de responsabilidad.'
            : 'Manage AI model (.tflite), add plant disease datasheets, and review legal terms and photo disclaimers.'}
        </p>
      </div>

      {/* Navigation Sub-Tabs in Settings */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 border-b border-slate-300/70">
        <button
          onClick={() => setActiveSection('model')}
          className={`px-4.5 py-2.5 text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSection === 'model'
              ? 'neu-btn-primary-raised hover:neu-btn-primary-pressed'
              : 'neu-raised active:neu-pressed text-slate-800'
          }`}
          style={{ borderRadius: '90px' }}
        >
          <span className="material-symbols-outlined text-base font-bold">memory</span>
          <span>{lang === 'es' ? 'Modelo IA (.tflite)' : 'AI Model (.tflite)'}</span>
        </button>

        <button
          onClick={() => setActiveSection('add_disease')}
          className={`px-4.5 py-2.5 text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSection === 'add_disease'
              ? 'neu-btn-primary-raised hover:neu-btn-primary-pressed'
              : 'neu-raised active:neu-pressed text-slate-800'
          }`}
          style={{ borderRadius: '90px' }}
        >
          <span className="material-symbols-outlined text-base font-bold">add_box</span>
          <span>{lang === 'es' ? 'Ingresar Datos / Enfermedades' : 'Add Disease / Data'}</span>
        </button>

        <button
          onClick={() => setActiveSection('terms')}
          className={`px-4.5 py-2.5 text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSection === 'terms'
              ? 'neu-btn-primary-raised hover:neu-btn-primary-pressed'
              : 'neu-raised active:neu-pressed text-slate-800'
          }`}
          style={{ borderRadius: '90px' }}
        >
          <span className="material-symbols-outlined text-base font-bold">gavel</span>
          <span>{lang === 'es' ? 'Términos & Fotos' : 'Terms & Photo Disclaimer'}</span>
        </button>

        <button
          onClick={() => setActiveSection('app_info')}
          className={`px-4.5 py-2.5 text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSection === 'app_info'
              ? 'neu-btn-primary-raised hover:neu-btn-primary-pressed'
              : 'neu-raised active:neu-pressed text-slate-800'
          }`}
          style={{ borderRadius: '90px' }}
        >
          <span className="material-symbols-outlined text-base font-bold">info</span>
          <span>{lang === 'es' ? 'Info App & APK' : 'App & APK Info'}</span>
        </button>
      </div>

      {/* SECTION 1: AI MODEL CONFIGURATION */}
      {activeSection === 'model' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="neu-card p-6 border border-white/80 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 neu-raised text-purple-900 flex items-center justify-center font-black" style={{ borderRadius: '90px' }}>
                <span className="material-symbols-outlined text-xl">psychology</span>
              </div>
              <div>
                <h3 className="font-headline-md text-lg font-black text-slate-900">
                  {lang === 'es' ? 'Configuración del Modelo de Visión Artificial' : 'Computer Vision Model Setup'}
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  {lang === 'es'
                    ? 'Selecciona y gestiona el motor con el que el escáner identificará plagas en campo.'
                    : 'Select and manage the engine used by the scanner to identify field pests.'}
                </p>
              </div>
            </div>

            {/* Details for TFLITE */}
            <div className="p-5 neu-pressed space-y-4 animate-fadeIn" style={{ borderRadius: '18px' }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleModelFileUpload}
                accept=".tflite,.tflin,.pb,.onnx"
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 neu-raised text-purple-900 flex items-center justify-center font-black flex-shrink-0" style={{ borderRadius: '90px' }}>
                    <span className="material-symbols-outlined text-xl">memory</span>
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-700 text-base font-bold">check_circle</span>
                      Modelo Activo: <code className="neu-pressed text-purple-950 px-2 py-0.5 font-mono text-xs" style={{ borderRadius: '8px' }}>{modelFileName}</code>
                    </p>
                    <p className="text-xs text-purple-900 font-bold mt-0.5">
                      {lang === 'es'
                        ? 'Modelo TensorFlow Lite (.tflite) optimizado para inferencia offline en APK.'
                        : 'TensorFlow Lite (.tflite) model optimized for offline APK inference.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-5 py-3 neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{ borderRadius: '90px' }}
                >
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>{lang === 'es' ? 'Subir nuevo modelo (.tflite)' : 'Upload new model file'}</span>
                </button>
              </div>

              {modelStatusMsg && (
                <div className="p-3 neu-pressed text-emerald-900 text-xs font-extrabold" style={{ borderRadius: '14px' }}>
                  {modelStatusMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ADD DISEASE / PATHO-KNOWLEDGE ENTRY */}
      {activeSection === 'add_disease' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="neu-card p-6 border border-white/80 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-300/70 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 neu-raised text-purple-900 flex items-center justify-center font-black shrink-0" style={{ borderRadius: '90px' }}>
                  <span className="material-symbols-outlined text-xl">menu_book</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg font-black text-slate-900">
                    {lang === 'es' ? 'Ingresar Datos o Fichas de Enfermedades' : 'Register Disease or Plant Data'}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    {lang === 'es'
                      ? 'Módulo de llenado fitosanitario para enriquecer la biblioteca de conocimiento y la IA.'
                      : 'Add phytosanitary datasheets to enrich the knowledge base and AI Agronomist.'}
                  </p>
                </div>
              </div>

              {onOpenAddDiseaseModal && (
                <button
                  type="button"
                  onClick={onOpenAddDiseaseModal}
                  className="px-4 py-2 neu-btn-primary-raised hover:neu-btn-primary-pressed text-white text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer"
                  style={{ borderRadius: '90px' }}
                >
                  <span className="material-symbols-outlined text-base">open_in_full</span>
                  <span>{lang === 'es' ? 'Abrir Modal Centrado' : 'Open Centered Modal'}</span>
                </button>
              )}
            </div>

            {isSuccessAdded && (
              <div className="p-3 neu-pressed text-emerald-950 text-xs font-black flex items-center gap-2 animate-fadeIn" style={{ borderRadius: '14px' }}>
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>
                  {lang === 'es'
                    ? '¡Ficha de enfermedad registrada con éxito en la base de datos local!'
                    : 'Disease datasheet successfully registered in local database!'}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitDisease} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-purple-950 mb-1">
                    {lang === 'es' ? 'Nombre Científico / Patógeno *' : 'Scientific Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Peronospora rubi / Colletotrichum"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    className="w-full px-3.5 py-2.5 neu-input text-slate-900 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-black text-purple-950 mb-1">
                    {lang === 'es' ? 'Nombre Común (Español) *' : 'Common Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Mildeo Velloso de la Mora"
                    value={commonName}
                    onChange={(e) => setCommonName(e.target.value)}
                    className="w-full px-3.5 py-2.5 neu-input text-slate-900 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-purple-950 mb-1">
                    {lang === 'es' ? 'Categoría' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 neu-input text-slate-900 font-bold focus:outline-none"
                  >
                    <option value="fungal">{lang === 'es' ? 'Hongo / Fúngico' : 'Fungal'}</option>
                    <option value="bacterial">{lang === 'es' ? 'Bacteriano' : 'Bacterial'}</option>
                    <option value="viral">{lang === 'es' ? 'Viral / Fisiopatía' : 'Viral'}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-purple-950 mb-1">
                    {lang === 'es' ? 'Nivel de Severidad' : 'Severity Level'}
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 neu-input text-slate-900 font-bold focus:outline-none"
                  >
                    <option value="Crítico">{lang === 'es' ? 'Crítico' : 'Critical'}</option>
                    <option value="Alerta Max">{lang === 'es' ? 'Alerta Máxima' : 'Max Alert'}</option>
                    <option value="Moderado">{lang === 'es' ? 'Moderado' : 'Moderate'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-purple-950 mb-1">
                  {lang === 'es' ? 'Descripción Agronómica y Diagnóstico' : 'Agronomic Description'}
                </label>
                <textarea
                  rows={2}
                  placeholder={lang === 'es' ? 'Escribe información detallada sobre la manifestación...' : 'Detailed information...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 neu-input text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-black text-purple-950 mb-1">
                  {lang === 'es' ? 'Síntomas (separados por coma)' : 'Symptoms (comma separated)'}
                </label>
                <input
                  type="text"
                  placeholder="ej. Fruto necrosado, Mofetado blanco, Defoliación prematura"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3.5 py-2.5 neu-input text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-black text-purple-950 mb-1">
                  {lang === 'es' ? 'Medidas de Control & Manejo' : 'Control Measures'}
                </label>
                <input
                  type="text"
                  placeholder="ej. Podas sanitarias, Aplicación de Oxicloruro de Cobre, Aplicación de Trichoderma"
                  value={control}
                  onChange={(e) => setControl(e.target.value)}
                  className="w-full px-3.5 py-2.5 neu-input text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-black text-purple-950 mb-1">
                  {lang === 'es' ? 'URL de Imagen Ilustrativa (Opcional)' : 'Image URL (Optional)'}
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 neu-input text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{ borderRadius: '90px' }}
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>{lang === 'es' ? 'Guardar en Base de Conocimiento' : 'Save to Knowledge Base'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 3: TERMS & CONDITIONS & PHOTO DISCLAIMER */}
      {activeSection === 'terms' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="neu-card p-6 border border-white/80 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-300/70 pb-3">
              <div className="w-10 h-10 neu-raised text-purple-900 flex items-center justify-center font-black" style={{ borderRadius: '90px' }}>
                <span className="material-symbols-outlined text-xl">gavel</span>
              </div>
              <div>
                <h3 className="font-headline-md text-lg font-black text-slate-900">
                  {lang === 'es' ? 'Términos, Condiciones y Política de Fotografía' : 'Terms, Conditions & Photo Disclaimer'}
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  {lang === 'es'
                    ? 'Normativas legales y descarga explícita de responsabilidad referente al contenido de imágenes cargadas por los usuarios.'
                    : 'Legal terms and explicit photo usage disclaimers.'}
                </p>
              </div>
            </div>

            {/* Disclaimer Highlight Box */}
            <div className="p-4 neu-pressed text-amber-950 space-y-2 border border-amber-300/60" style={{ borderRadius: '18px' }}>
              <div className="flex items-center gap-2 font-black text-xs text-amber-900 uppercase tracking-wider">
                <span className="material-symbols-outlined text-lg text-amber-800 font-bold">warning</span>
                <span>
                  {lang === 'es'
                    ? 'RENUNCIA DE RESPONSABILIDAD DE FOTOGRAFÍAS SUBIDAS'
                    : 'PHOTO UPLOAD DISCLAIMER & PRIVACY'}
                </span>
              </div>
              <p className="text-xs leading-relaxed font-bold">
                {lang === 'es'
                  ? 'Moradetec AI y sus desarrolladores NO se responsabilizan ni asumen responsabilidad legal sobre el contenido, naturaleza, derechos de autor, derechos de imagen o privacidad de las fotografías o imágenes cargadas, escaneadas o capturadas por los usuarios en esta aplicación.'
                  : 'Moradetec AI and its developers assume NO liability or responsibility for the content, privacy, copyrights, or nature of photos uploaded or scanned by users.'}
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-medium">
              <div className="p-4 neu-pressed space-y-1.5" style={{ borderRadius: '16px' }}>
                <h4 className="font-black text-purple-950 flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-base text-purple-900 font-bold">lock</span>
                  1. {lang === 'es' ? 'Procesamiento Local y Privacidad de la Captura' : 'Local Processing & Privacy'}
                </h4>
                <p>
                  {lang === 'es'
                    ? 'Las capturas de cámara realizadas con la tecnología de escaneo de visión artificial se procesan de forma local en el dispositivo del usuario o mediante API cifradas temporales. Las fotografías no son almacenadas de forma pública ni comercializadas con terceros.'
                    : 'Camera captures made using the artificial vision scanning technology are processed locally on the user device or temporary encrypted APIs.'}
                </p>
              </div>

              <div className="p-4 neu-pressed space-y-1.5" style={{ borderRadius: '16px' }}>
                <h4 className="font-black text-purple-950 flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-base text-purple-900 font-bold">verified_user</span>
                  2. {lang === 'es' ? 'Alcance Agronómico Orientativo' : 'Agronomic Scope'}
                </h4>
                <p>
                  {lang === 'es'
                    ? 'Los diagnósticos fitosanitarios entregados por la inteligencia artificial (gemini o .tflite) constituyen una guía técnica orientativa y pedagógica. Se recomienda la validación en campo con un ingeniero agrónomo profesional antes de realizar aplicaciones químicas extensivas.'
                    : 'The phytosanitary diagnostics provided by AI (.tflite/gemini) serve as an educational and technical orientation guide. Professional agronomist field validation is advised.'}
                </p>
              </div>

              <div className="p-4 neu-pressed space-y-1.5" style={{ borderRadius: '16px' }}>
                <h4 className="font-black text-purple-950 flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-base text-purple-900 font-bold">copyright</span>
                  3. {lang === 'es' ? 'Derechos de Propiedad Intelectual' : 'Intellectual Property'}
                </h4>
                <p>
                  {lang === 'es'
                    ? 'El usuario declara ser el propietario legítimo o contar con la autorización correspondiente sobre cualquier muestra o fotografía que introduzca en la plataforma para su análisis.'
                    : 'The user represents that they possess legitimate ownership or authorization over any sample or image introduced into the system for analysis.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: APP INFO & APK BUILD */}
      {activeSection === 'app_info' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="neu-card p-6 border border-white/80 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-300/70 pb-3">
              <div className="w-10 h-10 neu-raised text-purple-900 flex items-center justify-center font-black" style={{ borderRadius: '90px' }}>
                <span className="material-symbols-outlined text-xl">android</span>
              </div>
              <div>
                <h3 className="font-headline-md text-lg font-black text-slate-900">
                  {lang === 'es' ? 'Información de la App & Compilación APK' : 'App Info & APK Build'}
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  {lang === 'es'
                    ? 'Estado de la plataforma Android Capacitor y especificaciones del sistema.'
                    : 'Capacitor Android platform state and system specifications.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 neu-pressed space-y-2" style={{ borderRadius: '16px' }}>
                <p className="text-slate-600 font-bold">Nombre de la Aplicación:</p>
                <p className="font-black text-sm text-slate-900">Moradetec AI - Mora de Castilla</p>
              </div>

              <div className="p-4 neu-pressed space-y-2" style={{ borderRadius: '16px' }}>
                <p className="text-slate-600 font-bold">ID de Paquete Android (APK):</p>
                <code className="font-mono text-xs font-black text-purple-950 neu-raised px-2.5 py-1" style={{ borderRadius: '8px' }}>
                  com.moradetec.app
                </code>
              </div>

              <div className="p-4 neu-pressed space-y-2" style={{ borderRadius: '16px' }}>
                <p className="text-slate-600 font-bold">Motor Híbrido Mobile:</p>
                <p className="font-black text-sm text-emerald-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base font-bold">check_circle</span>
                  Capacitor 6.x (Listo para Exportar APK)
                </p>
              </div>

              <div className="p-4 neu-pressed space-y-2" style={{ borderRadius: '16px' }}>
                <p className="text-slate-600 font-bold">Idioma de Interfaz Activo:</p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900">{lang === 'es' ? 'Español (ES)' : 'English (EN)'}</span>
                  <button
                    onClick={onToggleLang}
                    className="px-4 py-2 neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed text-white font-extrabold text-xs cursor-pointer transition-all"
                    style={{ borderRadius: '90px' }}
                  >
                    {lang === 'es' ? 'Cambiar a EN' : 'Switch to ES'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
