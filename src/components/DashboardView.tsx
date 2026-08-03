import React, { useState } from 'react';
import { Language, DiseaseActivity, WeatherAlert, NotificationItem, CropFolder, CropFolderStep } from '../types';
import { Modal } from './Modal';

interface DashboardViewProps {
  lang: Language;
  weatherAlert: WeatherAlert;
  activities: DiseaseActivity[];
  onNewScan: () => void;
  onGoToLibrary: () => void;
  onUpdateActivityStatus: (id: string, newStatusType: 'ACTIONED' | 'URGENT') => void;
  onOpenAiChatWithPrompt?: (prompt: string) => void;
  onAddNotification?: (notif: NotificationItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  weatherAlert,
  activities,
  onNewScan,
  onGoToLibrary,
  onUpdateActivityStatus,
  onOpenAiChatWithPrompt,
  onAddNotification,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<DiseaseActivity | null>(null);

  // Crop Folders State
  const [folders, setFolders] = useState<CropFolder[]>([
    {
      id: 'folder-1',
      name: 'Carpeta Lote #1 - Mora de Castilla (Valle Central)',
      phaseEs: 'Floración y Cuajado de Fruto',
      phaseEn: 'Flowering & Fruit Setting',
      plantCount: 450,
      steps: [
        {
          id: 's-1',
          dayRange: 'Días 1 - 7',
          titleEs: 'Poda de Ventilación y Limpieza de Hojas Bajas',
          titleEn: 'Ventilation Pruning & Basal Sanitation',
          descEs: 'Remover hojas senescentes y ramas pegadas al suelo para evitar microclima húmedo del Mildeo Velloso.',
          descEn: 'Remove lower leaves and ground branches to break humid microclimates favoring Downy Mildew.',
          completed: true,
          type: 'SANITATION',
        },
        {
          id: 's-2',
          dayRange: 'Días 8 - 14',
          titleEs: 'Aplicación Foliar Preventiva de Trichoderma + Calcio/Boro',
          titleEn: 'Preventive Foliar Trichoderma + Calcium/Boron',
          descEs: 'Focalizar en botones florales para endurecer pared celular y prevenir Rajado de Frutos y Botrytis.',
          descEn: 'Apply on flower buds to strengthen cell walls and prevent Fruit Cracking and Botrytis.',
          completed: true,
          type: 'PREVENTION',
        },
        {
          id: 's-3',
          dayRange: 'Días 15 - 21',
          titleEs: 'Monitoreo Matutino de Rocío y Humedad Relativa',
          titleEn: 'Morning Dew & Relative Humidity Tracking',
          descEs: 'Revisar envés de hojas jóvenes. Si hay polvillo blanco/rosado, aplicar infusión biológica o fungicida cúprico.',
          descEn: 'Check underside of leaves. If white dust appears, apply biological bio-fungicide or copper.',
          completed: false,
          type: 'PREVENTION',
        },
        {
          id: 's-4',
          dayRange: 'Días 22 - 30',
          titleEs: 'Fertirriego Potásico y Bioestimulante de Llenado',
          titleEn: 'Potassium Fertigation & Fruit Bio-stimulant',
          descEs: 'Suministrar Nitrato de Potasio (CE 1.4 dS/m) para asegurar frutos de gran calibre, firmeza y dulzor.',
          descEn: 'Apply Potassium Nitrate (EC 1.4 dS/m) to ensure large, firm and sweet berries.',
          completed: false,
          type: 'NUTRITION',
        },
      ],
    },
    {
      id: 'folder-2',
      name: 'Carpeta Lote #2 - Parcela Alta (Crecimiento Vegetativo)',
      phaseEs: 'Brote de Tallos Principales y Tupidez',
      phaseEn: 'Main Cane Shoot & Vegetative Growth',
      plantCount: 300,
      steps: [
        {
          id: 's-201',
          dayRange: 'Días 1 - 10',
          titleEs: 'Tutorado de Tallos Bajos y Amarre Ligero',
          titleEn: 'Lower Cane Trellising & Light Tying',
          descEs: 'Guiar los rebrotes sobre la espaldera doble para evitar roturas por viento.',
          descEn: 'Guide new shoots onto trellis wires to prevent wind breakage.',
          completed: true,
          type: 'SANITATION',
        },
        {
          id: 's-202',
          dayRange: 'Días 11 - 20',
          titleEs: 'Inoculación de Micorrizas en Sistema Radicular',
          titleEn: 'Mycorrhizae Soil Inoculation',
          descEs: 'Mejorar absorción de Fósforo para un desarrollo radicular profundo.',
          descEn: 'Enhance Phosphorus uptake for strong root development.',
          completed: false,
          type: 'NUTRITION',
        },
      ],
    },
  ]);

  const [activeFolderId, setActiveFolderId] = useState<string>('folder-1');
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPhase, setNewFolderPhase] = useState('');
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDesc, setNewStepDesc] = useState('');
  const [newStepDays, setNewStepDays] = useState('Días 1 - 7');

  const currentFolder = folders.find((f) => f.id === activeFolderId) || folders[0];

  const toggleStepCompleted = (folderId: string, stepId: string) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id !== folderId) return f;
        return {
          ...f,
          steps: f.steps.map((st) => (st.id === stepId ? { ...st, completed: !st.completed } : st)),
        };
      })
    );
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const folderNameClean = newFolderName.trim();
    const folderPhaseClean = newFolderPhase.trim() || 'Etapa de Desarrollo Generativo';

    const created: CropFolder = {
      id: `folder-${Date.now()}`,
      name: folderNameClean,
      phaseEs: folderPhaseClean,
      phaseEn: folderPhaseClean,
      plantCount: 250,
      steps: [
        {
          id: `st-${Date.now()}-1`,
          dayRange: 'Días 1 - 7',
          titleEs: 'Inspección de Plagas, Fumigación o Deslavar',
          titleEn: 'Pest Inspection, Spray or Foliage Wash',
          descEs: 'Paso inicial programado para sanear la parcela y activar controles agronómicos.',
          descEn: 'Initial step scheduled to inspect plot and activate agronomic controls.',
          completed: false,
          type: 'PREVENTION',
        },
      ],
    };

    setFolders((prev) => [...prev, created]);
    setActiveFolderId(created.id);

    if (onAddNotification) {
      onAddNotification({
        id: `notif-folder-${Date.now()}`,
        titleEs: `📁 Carpeta Creada: ${folderNameClean}`,
        titleEn: `📁 Folder Created: ${folderNameClean}`,
        descEs: `Programado para la etapa "${folderPhaseClean}". El Robot Agrónomo tiene listas las recomendaciones de fumigación, deslavado y cosecha.`,
        descEn: `Created for "${folderPhaseClean}". AI Bot is ready with spray, foliage wash and harvest advice.`,
        time: 'Ahora',
        read: false,
        type: 'crop_task',
        folderName: folderNameClean,
        actionType: 'OTRO',
        actionPrompt: `Hola Robot Agrónomo, acabo de registrar la carpeta de lote "${folderNameClean}" en etapa "${folderPhaseClean}". ¿Cuáles son las recomendaciones específicas de fumigación, deslavado de follaje y cosecha para esta carpeta?`,
      });
    }

    setNewFolderName('');
    setNewFolderPhase('');
    setShowAddFolderModal(false);
  };

  const handleAddStepToFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) return;
    const titleClean = newStepTitle.trim();
    const descClean = newStepDesc.trim() || 'Paso personalizado de manejo agronómico.';
    const daysClean = newStepDays.trim() || 'Días 1 - 7';

    const newStep: CropFolderStep = {
      id: `st-${Date.now()}`,
      dayRange: daysClean,
      titleEs: titleClean,
      titleEn: titleClean,
      descEs: descClean,
      descEn: descClean,
      completed: false,
      type: 'PREVENTION',
    };

    setFolders((prev) =>
      prev.map((f) => (f.id === currentFolder.id ? { ...f, steps: [...f.steps, newStep] } : f))
    );

    if (onAddNotification) {
      const lower = titleClean.toLowerCase();
      const isFumigar = lower.includes('fumig') || lower.includes('fungic') || lower.includes('aplic');
      const isDeslavar = lower.includes('deslav') || lower.includes('poda') || lower.includes('lavad') || lower.includes('sanit');
      const isCosechar = lower.includes('cosech') || lower.includes('recolec') || lower.includes('fruto');
      const actionType = isFumigar ? 'FUMIGAR' : isDeslavar ? 'DESLAVAR' : isCosechar ? 'COSECHAR' : 'OTRO';

      onAddNotification({
        id: `notif-step-${Date.now()}`,
        titleEs: `📅 Programación (${daysClean}): ${titleClean}`,
        titleEn: `📅 Schedule (${daysClean}): ${titleClean}`,
        descEs: `En ${currentFolder.name}: "${descClean}". Tarea activa para consultar con el Robot IA.`,
        descEn: `In ${currentFolder.name}: "${descClean}". Active task to consult with AI Bot.`,
        time: 'Ahora',
        read: false,
        type: 'crop_task',
        folderName: currentFolder.name,
        actionType,
        actionPrompt: `Hola Robot Agrónomo, tengo programado en mi carpeta (${currentFolder.name}) la tarea (${daysClean}): "${titleClean}". ${descClean}. ¿Cuáles son tus consejos técnicos para este paso?`,
      });
    }

    setNewStepTitle('');
    setNewStepDesc('');
    setShowAddStepModal(false);
  };

  const completedStepsCount = currentFolder.steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedStepsCount / Math.max(1, currentFolder.steps.length)) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return lang === 'es' ? 'Buenos días' : 'Good morning';
    } else if (hour >= 12 && hour < 19) {
      return lang === 'es' ? 'Buenas tardes' : 'Good afternoon';
    } else {
      return lang === 'es' ? 'Buenas noches' : 'Good evening';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Primary Greeting & Action - NEW SCAN */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 neu-card p-5 sm:p-6 border border-white/80">
        <div>
          <h2 className="font-headline-lg-mobile sm:text-2xl font-black text-slate-900">
            {getGreeting()}
          </h2>
          <p className="text-slate-700 font-medium text-xs sm:text-sm mt-0.5">
            {lang === 'es'
              ? 'Manejo fitosanitario y control agronómico de lotes de Mora de Castilla.'
              : 'Phytosanitary management and agronomic control for blackberry crops.'}
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="px-8 py-3.5 neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed font-extrabold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all cursor-pointer shrink-0 w-full sm:w-auto"
          style={{ borderRadius: '90px' }}
        >
          <span className="material-symbols-outlined text-xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
            photo_camera
          </span>
          <span>
            {lang === 'es' ? 'NUEVO ESCANEO' : 'NEW SCAN'}
          </span>
        </button>
      </div>

      {/* CROP FOLDERS & TIMED STEP-BY-STEP AI MODULE */}
      <div className="neu-card p-6 sm:p-8 space-y-6 border border-white/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300/70 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-900 text-2xl font-bold">folder</span>
              <h3 className="font-headline-md text-xl font-black text-slate-900">
                {lang === 'es' ? 'Carpeta de Lote & Pasos Fitosanitarios IA' : 'Crop Folder & AI Phytosanitary Steps'}
              </h3>
            </div>
            <p className="text-xs text-slate-700 font-bold mt-1">
              {lang === 'es'
                ? 'Guía programada paso a paso para nutrición, poda y prevención de plagas por lote.'
                : 'Step-by-step timed schedule for nutrition, pruning and pest prevention by lot.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddFolderModal(true)}
            className="px-4 py-2.5 neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all self-start md:self-auto"
            style={{ borderRadius: '90px' }}
          >
            <span className="material-symbols-outlined text-base">create_new_folder</span>
            <span>{lang === 'es' ? 'Nueva Carpeta de Lote' : 'New Lot Folder'}</span>
          </button>
        </div>

        {/* Folder Selectors Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {folders.map((f) => {
            const isActive = f.id === activeFolderId;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFolderId(f.id)}
                className={`px-4.5 py-3 text-xs font-black transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'neu-btn-primary-raised text-white'
                    : 'neu-raised active:neu-pressed text-slate-800'
                }`}
                style={{ borderRadius: '90px' }}
              >
                <span className="material-symbols-outlined text-base">
                  {isActive ? 'folder_open' : 'folder'}
                </span>
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Folder Details Card */}
        <div className="neu-pressed p-5 sm:p-6 space-y-5" style={{ borderRadius: '20px' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="px-3 py-1 neu-raised text-purple-950 font-black text-[11px] uppercase tracking-wider inline-block mb-1" style={{ borderRadius: '90px' }}>
                 Etapa: {lang === 'es' ? currentFolder.phaseEs : currentFolder.phaseEn}
              </span>
              <h4 className="font-black text-lg text-slate-900">{currentFolder.name}</h4>
              <p className="text-xs text-slate-700 font-bold mt-0.5">
                {lang === 'es' ? `Total de plantas bajo seguimiento: ${currentFolder.plantCount} matas` : `${currentFolder.plantCount} plants monitored`}
              </p>
            </div>

            {/* Folder Progress Meter */}
            <div className="w-full sm:w-56 neu-raised p-3 flex flex-col gap-1.5" style={{ borderRadius: '16px' }}>
              <div className="flex justify-between items-center text-xs font-black text-purple-950">
                <span>{lang === 'es' ? 'Progreso Lote' : 'Lot Progress'}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-3 neu-pressed overflow-hidden p-0.5" style={{ borderRadius: '90px' }}>
                <div
                  className="h-full bg-gradient-to-r from-purple-700 via-purple-900 to-emerald-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%`, borderRadius: '90px' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Timed Step Checklist */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <h5 className="font-black text-xs text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-purple-900">format_list_bulleted</span>
                {lang === 'es' ? 'Pasos Cronológicos Recomendados por la IA:' : 'AI Timed Recommended Steps:'}
              </h5>
              <button
                onClick={() => setShowAddStepModal(true)}
                className="text-xs text-purple-900 font-black hover:underline cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                {lang === 'es' ? 'Agregar Paso' : 'Add Step'}
              </button>
            </div>

            <div className="space-y-3">
              {currentFolder.steps.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleStepCompleted(currentFolder.id, st.id)}
                  className={`p-4 transition-all cursor-pointer flex items-start gap-3.5 ${
                    st.completed ? 'neu-pressed opacity-80' : 'neu-raised border border-purple-300/50'
                  }`}
                  style={{ borderRadius: '18px' }}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      st.completed ? 'bg-emerald-600 text-white' : 'neu-pressed text-slate-400'
                    }`}
                  >
                    {st.completed && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 neu-pressed text-purple-950" style={{ borderRadius: '8px' }}>
                        ⏱️ {st.dayRange}
                      </span>
                      {st.completed && (
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                          ✓ {lang === 'es' ? 'Completado' : 'Completed'}
                        </span>
                      )}
                    </div>
                    <h6 className={`font-black text-xs sm:text-sm ${st.completed ? 'line-through text-slate-600' : 'text-slate-900'}`}>
                      {lang === 'es' ? st.titleEs : st.titleEn}
                    </h6>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {lang === 'es' ? st.descEs : st.descEn}
                    </p>

                    {onOpenAiChatWithPrompt && (
                      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            const stepTitle = lang === 'es' ? st.titleEs : st.titleEn;
                            const stepDesc = lang === 'es' ? st.descEs : st.descEn;
                            onOpenAiChatWithPrompt(
                              `Hola Robot Agrónomo, sobre la tarea "${stepTitle}" (${st.dayRange}) del ${currentFolder.name} (Etapa: ${currentFolder.phaseEs}): ${stepDesc}. ¿Cuáles son tus consejos técnicos de aplicación, dosis o prevención de enfermedades?`
                            );
                          }}
                          className="px-3 py-1.5 liquid-glass hover:bg-purple-900 hover:text-white bg-purple-900/10 text-purple-950 font-black text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border border-purple-300 shadow-sm"
                          style={{ borderRadius: '90px' }}
                        >
                          <span className="material-symbols-outlined text-xs">smart_toy</span>
                          <span>{lang === 'es' ? '🤖 Preguntar al Robot IA sobre este paso' : '🤖 Ask AI Robot about this step'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row inside Folder */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {onOpenAiChatWithPrompt && (
              <button
                onClick={() =>
                  onOpenAiChatWithPrompt(
                    lang === 'es'
                      ? `¿Qué recomendaciones fitosanitarias adicionales tienes para el ${currentFolder.name} en etapa de ${currentFolder.phaseEs}?`
                      : `What additional phytosanitary advice do you have for ${currentFolder.name}?`
                  )
                }
                className="flex-1 py-3 neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all"
                style={{ borderRadius: '90px' }}
              >
                <span className="material-symbols-outlined text-base">smart_toy</span>
                <span>{lang === 'es' ? 'Consultar al Robot IA sobre esta Carpeta' : 'Ask AI Robot about this Folder'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Crop Status Card */}
        <div className="md:col-span-7 neu-card p-6 sm:p-8 relative overflow-hidden group border border-white/60">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-headline-md text-xl font-extrabold text-purple-950">
                {lang === 'es' ? 'Salud del Cultivo' : 'Crop Health Score'}
              </h3>
              <p className="text-slate-600 font-body-sm-italic text-xs sm:text-sm font-medium">
                {lang === 'es' ? 'Promedio General de Lotes' : 'Average Across Lots'}
              </p>
            </div>
            <div className="w-12 h-12 neu-raised flex items-center justify-center" style={{ borderRadius: '90px' }}>
              <span className="material-symbols-outlined text-purple-900 text-2xl">potted_plant</span>
            </div>
          </div>

          <div className="flex items-end gap-4">
            <span className="text-5xl sm:text-6xl font-black text-purple-950 drop-shadow-sm">94%</span>
            <div className="mb-2">
              <span className="text-emerald-700 flex items-center font-extrabold text-sm">
                <span className="material-symbols-outlined text-sm">arrow_upward</span> 2.4%
              </span>
              <p className="text-xs text-slate-600 font-medium">
                {lang === 'es' ? 'desde ayer' : 'since yesterday'}
              </p>
            </div>
          </div>

          {/* Mini Visualization Bar Graph */}
          <div className="mt-8 flex gap-2 h-14 items-end pt-2">
            <div className="flex-1 bg-purple-700/30 rounded-t-lg h-8 group-hover:h-10 transition-all duration-500"></div>
            <div className="flex-1 bg-purple-800/50 rounded-t-lg h-6 group-hover:h-8 transition-all duration-500"></div>
            <div className="flex-1 bg-purple-700/30 rounded-t-lg h-10 group-hover:h-12 transition-all duration-500"></div>
            <div className="flex-1 bg-purple-800/70 rounded-t-lg h-5 group-hover:h-7 transition-all duration-500"></div>
            <div className="flex-1 bg-purple-900 rounded-t-lg h-12 group-hover:h-14 transition-all duration-500"></div>
            <div className="flex-1 bg-purple-700/40 rounded-t-lg h-7 group-hover:h-9 transition-all duration-500"></div>
          </div>
        </div>

        {/* Weather Alert Card */}
        <div className="md:col-span-5 neu-card p-6 sm:p-8 relative overflow-hidden border border-rose-300/60">
          <div className="flex items-center gap-2 mb-3 text-rose-700 font-black text-xs tracking-wider uppercase">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <span>{lang === 'es' ? weatherAlert.regionEs : weatherAlert.regionEn}</span>
          </div>

          <h3 className="font-headline-md text-xl text-slate-900 font-black mb-2">
            {lang === 'es' ? weatherAlert.titleEs : weatherAlert.titleEn}
          </h3>
          <p className="text-slate-700 text-xs sm:text-sm mb-6 leading-relaxed font-medium">
            {lang === 'es' ? weatherAlert.descriptionEs : weatherAlert.descriptionEn}
          </p>

          <div className="flex justify-between border-t border-slate-300/70 pt-4">
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-black tracking-wider">
                {lang === 'es' ? 'HUMEDAD' : 'HUMIDITY'}
              </p>
              <p className="text-lg font-black text-purple-950">{weatherAlert.humidity}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-black tracking-wider">
                {lang === 'es' ? 'TEMP' : 'TEMP'}
              </p>
              <p className="text-lg font-black text-purple-950">{weatherAlert.temperature}</p>
            </div>
          </div>
        </div>

        {/* Recent Disease Activity */}
        <div className="md:col-span-12 neu-card p-6 sm:p-8 border border-white/60">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-xl text-purple-950 font-extrabold">
              {lang === 'es' ? 'Actividad Reciente de Patógenos' : 'Recent Disease Activity'}
            </h3>
            <button
              onClick={onGoToLibrary}
              className="px-3.5 py-1.5 neu-raised text-purple-950 font-bold text-xs sm:text-sm flex items-center gap-1 active:neu-pressed transition-all cursor-pointer"
              style={{ borderRadius: '90px' }}
            >
              {lang === 'es' ? 'Biblioteca' : 'History'}{' '}
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((item) => {
              const isUrgent = item.statusType === 'URGENT';
              const title = lang === 'es' ? item.titleEs : item.titleEn;
              const location = lang === 'es' ? item.locationEs : item.locationEn;
              const time = lang === 'es' ? item.timeEs : item.timeEn;
              const statusLabel = lang === 'es' ? item.statusEs : item.statusEn;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedActivity(item)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 neu-raised hover:neu-pressed transition-all cursor-pointer gap-4"
                  style={{ borderRadius: '20px' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 neu-raised overflow-hidden flex-shrink-0 p-1" style={{ borderRadius: '18px' }}>
                      <img className="w-full h-full object-cover rounded-xl" src={item.image} alt={title} />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-base">{title}</p>
                      <p className="text-xs text-slate-600 font-medium">
                        {location} • {time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span
                      className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider neu-pressed ${
                        isUrgent
                          ? 'text-rose-800 border border-rose-300'
                          : 'text-emerald-800 border border-emerald-300'
                      }`}
                      style={{ borderRadius: '90px' }}
                    >
                      {statusLabel}
                    </span>
                    <span className="material-symbols-outlined text-purple-900 text-lg">info</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Add New Lot Folder */}
      <Modal
        isOpen={showAddFolderModal}
        onClose={() => setShowAddFolderModal(false)}
        title={lang === 'es' ? 'Crear Nueva Carpeta de Lote' : 'Create New Lot Folder'}
        icon="create_new_folder"
        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleCreateFolder} className="space-y-4 text-xs font-bold pt-1">
          <div>
            <label className="block text-slate-800 mb-1">
              {lang === 'es' ? 'Nombre del Lote / Parcela *' : 'Lot Name *'}
            </label>
            <input
              type="text"
              required
              placeholder="ej. Carpeta Lote #4 - Invernadero Sur"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-800 mb-1">
              {lang === 'es' ? 'Etapa Fenológica' : 'Growth Stage'}
            </label>
            <input
              type="text"
              placeholder="ej. Floración, Crecimiento Vegetativo, Cosecha"
              value={newFolderPhase}
              onChange={(e) => setNewFolderPhase(e.target.value)}
              className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 neu-btn-primary-raised hover:neu-btn-primary-pressed text-white font-extrabold text-xs cursor-pointer transition-all"
              style={{ borderRadius: '90px' }}
            >
              {lang === 'es' ? 'Guardar Carpeta' : 'Save Folder'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddFolderModal(false)}
              className="px-5 py-3 neu-raised active:neu-pressed text-slate-800 font-extrabold text-xs cursor-pointer transition-all"
              style={{ borderRadius: '90px' }}
            >
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Step (Sub-node) to Current Folder */}
      <Modal
        isOpen={showAddStepModal}
        onClose={() => setShowAddStepModal(false)}
        title={lang === 'es' ? 'Agregar Paso al Lote' : 'Add Step to Lot'}
        icon="add_task"
        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleAddStepToFolder} className="space-y-4 text-xs font-bold pt-1">
          <div>
            <label className="block text-slate-800 mb-1">
              {lang === 'es' ? 'Rango de Días / Fecha' : 'Days / Date Range'}
            </label>
            <input
              type="text"
              placeholder="ej. Días 5 - 12 o Muestreo Semanal"
              value={newStepDays}
              onChange={(e) => setNewStepDays(e.target.value)}
              className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-800 mb-1">
              {lang === 'es' ? 'Título de la Acción *' : 'Action Title *'}
            </label>
            <input
              type="text"
              required
              placeholder="ej. Aplicación de Oxicloruro de Cobre o Bioestimulante"
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-800 mb-1">
              {lang === 'es' ? 'Descripción o Dosis' : 'Description or Dosage'}
            </label>
            <textarea
              rows={2}
              placeholder="ej. Dosis 2g/L en envés de hojas tempranas..."
              value={newStepDesc}
              onChange={(e) => setNewStepDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 neu-btn-primary-raised hover:neu-btn-primary-pressed text-white font-extrabold text-xs cursor-pointer transition-all"
              style={{ borderRadius: '90px' }}
            >
              {lang === 'es' ? 'Agregar Paso' : 'Add Step'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddStepModal(false)}
              className="px-5 py-3 neu-raised active:neu-pressed text-slate-800 font-extrabold text-xs cursor-pointer transition-all"
              style={{ borderRadius: '90px' }}
            >
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Activity Detail Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title={selectedActivity ? (lang === 'es' ? selectedActivity.titleEs : selectedActivity.titleEn) : ''}
        subtitle={lang === 'es' ? 'Ficha de Actividad' : 'Activity Datasheet'}
        icon="description"
        maxWidthClass="max-w-md"
      >
        {selectedActivity && (
          <div className="space-y-4 pt-1">
            <div className="h-36 overflow-hidden p-1 bg-white/70 rounded-2xl border border-white shadow-inner">
              <img
                src={selectedActivity.image}
                alt="Disease Detail"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-800 font-medium">
              <p className="flex justify-between border-b border-purple-100 pb-1">
                <strong className="text-purple-950">{lang === 'es' ? 'Ubicación:' : 'Location:'}</strong>
                <span>{lang === 'es' ? selectedActivity.locationEs : selectedActivity.locationEn}</span>
              </p>
              <p className="flex justify-between border-b border-purple-100 pb-1">
                <strong className="text-purple-950">{lang === 'es' ? 'Detección:' : 'Detection:'}</strong>
                <span>{lang === 'es' ? selectedActivity.timeEs : selectedActivity.timeEn}</span>
              </p>
              {selectedActivity.confidence && (
                <p className="flex justify-between border-b border-purple-100 pb-1">
                  <strong className="text-purple-950">{lang === 'es' ? 'Confianza Diagnóstica:' : 'Diagnostic Confidence:'}</strong>
                  <span className="text-purple-900 font-black">{selectedActivity.confidence}</span>
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              {selectedActivity.statusType === 'URGENT' ? (
                <button
                  onClick={() => {
                    onUpdateActivityStatus(selectedActivity.id, 'ACTIONED');
                    setSelectedActivity(null);
                  }}
                  className="flex-1 neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed py-2.5 font-extrabold text-xs transition-all cursor-pointer"
                  style={{ borderRadius: '90px' }}
                >
                  {lang === 'es' ? 'Marcar como Gestionado' : 'Mark as Actioned'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onUpdateActivityStatus(selectedActivity.id, 'URGENT');
                    setSelectedActivity(null);
                  }}
                  className="flex-1 neu-raised active:neu-pressed text-amber-900 py-2.5 font-extrabold text-xs transition-all cursor-pointer"
                  style={{ borderRadius: '90px' }}
                >
                  {lang === 'es' ? 'Marcar como Urgente' : 'Mark as Urgent'}
                </button>
              )}
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-5 neu-raised active:neu-pressed py-2.5 font-extrabold text-xs text-slate-800 transition-all cursor-pointer"
                style={{ borderRadius: '90px' }}
              >
                {lang === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

