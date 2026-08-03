import React, { useState } from 'react';
import { Language, Pathogen } from '../types';
import { PATHOGENS_LIBRARY, USER_PROFILE } from '../data/mockData';
import { Modal } from './Modal';

interface LibraryViewProps {
  lang: Language;
  onOpenScanner: () => void;
  pathogens?: Pathogen[];
  onAddPathogen?: (p: Pathogen) => void;
  onGoToSettings?: () => void;
  onOpenAddDiseaseModal?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  lang,
  onOpenScanner,
  pathogens = PATHOGENS_LIBRARY,
  onAddPathogen,
  onGoToSettings,
  onOpenAddDiseaseModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'critical' | 'fungal' | 'pests'>('all');
  const [activePathogen, setActivePathogen] = useState<Pathogen | null>(null);
  const [showProtocolModal, setShowProtocolModal] = useState(false);

  const filteredPathogens = pathogens.filter((p) => {
    const term = searchTerm.trim().toLowerCase();

    const nameEs = (p.commonNameEs || '').toLowerCase();
    const nameEn = (p.commonNameEn || '').toLowerCase();
    const sciName = (p.scientificName || '').toLowerCase();
    const descEs = (p.descriptionEs || '').toLowerCase();
    const descEn = (p.descriptionEn || '').toLowerCase();
    const sevEs = (p.severityEs || '').toLowerCase();
    const sevEn = (p.severityEn || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();

    const matchesSearch =
      !term ||
      sciName.includes(term) ||
      nameEs.includes(term) ||
      nameEn.includes(term) ||
      descEs.includes(term) ||
      descEn.includes(term) ||
      cat.includes(term) ||
      sevEs.includes(term) ||
      sevEn.includes(term);

    if (!matchesSearch) return false;

    if (selectedCategory === 'critical') {
      return (
        sevEs.includes('crít') ||
        sevEs.includes('crit') ||
        sevEs.includes('alert') ||
        sevEs.includes('alto') ||
        sevEn.includes('crit') ||
        sevEn.includes('alert') ||
        sevEn.includes('max') ||
        sevEn.includes('high')
      );
    }

    if (selectedCategory === 'fungal') {
      const isFungalCat = cat.includes('fung') || cat.includes('hong') || cat === 'fungal';
      const isFungalByTerm =
        sciName.includes('botrytis') ||
        sciName.includes('peronospora') ||
        sciName.includes('colletotrichum') ||
        sciName.includes('oidium') ||
        sciName.includes('gerwasia') ||
        nameEs.includes('mildeo') ||
        nameEs.includes('moho') ||
        nameEs.includes('roya') ||
        nameEs.includes('antracnosis') ||
        nameEs.includes('cenicilla');

      return isFungalCat || isFungalByTerm;
    }

    if (selectedCategory === 'pests') {
      const isPestCat = cat.includes('vir') || cat.includes('bact') || cat.includes('plag') || cat.includes('pest');
      const isPestByTerm =
        sciName.includes('acalitus') ||
        nameEs.includes('ácaro') ||
        nameEs.includes('acaro') ||
        nameEs.includes('plaga') ||
        nameEs.includes('virus');

      return isPestCat || isPestByTerm;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-black/5 pb-4">
        <div className="space-y-2">
          <span className="font-label-caps text-xs text-primary font-extrabold tracking-widest uppercase">
            {lang === 'es' ? 'Diagnóstico & Conocimiento Agrícola' : 'Phytosanitary Diagnostics & Knowledge'}
          </span>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-3xl md:text-4xl font-extrabold text-on-background">
            {lang === 'es' ? 'Biblioteca de Patógenos y Moras' : 'Pathogen & Blackberry Library'}
          </h2>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            {lang === 'es'
              ? 'Base de conocimiento fitosanitario de enfermedades en moras de Castilla. Para ingresar o editar datos, dirígete a la sección de Configuraciones.'
              : 'Knowledge base of diseases in Andean blackberries. To add or edit data, go to the Settings section.'}
          </p>
        </div>

        {(onOpenAddDiseaseModal || onGoToSettings) && (
          <button
            onClick={() => {
              if (onOpenAddDiseaseModal) {
                onOpenAddDiseaseModal();
              } else if (onGoToSettings) {
                onGoToSettings();
              }
            }}
            className="px-5 py-2.5 neu-btn-primary-raised hover:neu-btn-primary-pressed text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            style={{ borderRadius: '90px' }}
          >
            <span className="material-symbols-outlined text-lg">add_box</span>
            <span>{lang === 'es' ? 'Ingresar Datos / Nueva Ficha' : 'Add Disease Data'}</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-900">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === 'es'
                ? 'Buscar patógeno (ej. Botrytis, Mildeo)...'
                : 'Search pathogen (e.g. Botrytis, Mildew)...'
            }
            className="w-full pl-11 pr-4 py-3 neu-input text-xs sm:text-sm text-slate-900 font-bold focus:outline-none"
          />
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 shrink-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'neu-btn-primary-raised hover:neu-btn-primary-pressed'
                : 'neu-raised active:neu-pressed text-slate-800'
            }`}
            style={{ borderRadius: '90px' }}
          >
            {lang === 'es' ? 'Todos' : 'All'}
          </button>
          <button
            onClick={() => setSelectedCategory('critical')}
            className={`px-5 py-2.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'critical'
                ? 'neu-btn-primary-raised hover:neu-btn-primary-pressed'
                : 'neu-raised active:neu-pressed text-slate-800'
            }`}
            style={{ borderRadius: '90px' }}
          >
            {lang === 'es' ? '🚨 Críticos & Alertas' : '🚨 Critical & Alert'}
          </button>
          <button
            onClick={() => setSelectedCategory('fungal')}
            className={`px-5 py-2.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'fungal'
                ? 'neu-btn-primary-raised hover:neu-btn-primary-pressed'
                : 'neu-raised active:neu-pressed text-slate-800'
            }`}
            style={{ borderRadius: '90px' }}
          >
            {lang === 'es' ? '🍄 Fúngicos (Hongos)' : '🍄 Fungal'}
          </button>
          <button
            onClick={() => setSelectedCategory('pests')}
            className={`px-5 py-2.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === 'pests'
                ? 'neu-btn-primary-raised hover:neu-btn-primary-pressed'
                : 'neu-raised active:neu-pressed text-slate-800'
            }`}
            style={{ borderRadius: '90px' }}
          >
            {lang === 'es' ? '🐛 Plagas & Virus' : '🐛 Pests & Viruses'}
          </button>
        </div>
      </div>

      {/* Pathogens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPathogens.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 neu-card p-8 sm:p-12 text-center space-y-4 border border-purple-200">
            <div className="w-16 h-16 mx-auto neu-raised text-purple-900 flex items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-3xl font-bold">search_off</span>
            </div>
            <h3 className="font-headline-md text-xl text-slate-900 font-black">
              {lang === 'es' ? 'No se encontraron patógenos' : 'No pathogens found'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto font-medium leading-relaxed">
              {lang === 'es'
                ? 'No hay registros en la base de datos que coincidan con el término de búsqueda o el filtro activo.'
                : 'No records in the database match your search term or active filter.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-2.5 neu-btn-primary-raised text-white font-extrabold text-xs rounded-full cursor-pointer inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              <span>{lang === 'es' ? 'Restablecer Filtros y Búsqueda' : 'Reset Filters & Search'}</span>
            </button>
          </div>
        )}

        {filteredPathogens.map((item) => {
          const commonName = lang === 'es' ? item.commonNameEs : item.commonNameEn;
          const severity = lang === 'es' ? item.severityEs : item.severityEn;
          const description = lang === 'es' ? item.descriptionEs : item.descriptionEn;
          const controlMeasures = lang === 'es' ? item.controlMeasuresEs : item.controlMeasuresEn;

          const severityBadgeBg =
            item.severityEs === 'Crítico'
              ? 'text-purple-950 border border-purple-300'
              : item.severityEs === 'Alerta Max'
              ? 'text-rose-800 border border-rose-300'
              : 'text-amber-900 border border-amber-300';

          return (
            <article
              key={item.id}
              onClick={() => setActivePathogen(item)}
              className="neu-card cursor-pointer group flex flex-col h-full transition-all duration-300 hover:scale-[1.01] border border-white/80"
            >
              <div className="relative h-64 overflow-hidden neu-card-inset p-1.5">
                <img
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                  src={item.image}
                  alt={item.scientificName}
                />
                <div
                  className={`absolute top-4 right-4 neu-pressed px-3.5 py-1.5 text-xs font-black uppercase tracking-widest ${severityBadgeBg}`}
                  style={{ borderRadius: '90px' }}
                >
                  {severity}
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline-md text-xl text-slate-900 font-black">
                      {item.scientificName}
                    </h3>
                    <p className="font-body-sm-italic text-sm text-purple-900 font-extrabold">{commonName}</p>
                  </div>
                  <span className="material-symbols-outlined text-purple-900 text-3xl">coronavirus</span>
                </div>

                <div className="neu-pressed p-4 mb-6" style={{ borderRadius: '16px' }}>
                  <p className="font-body-md text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="font-label-caps text-[11px] font-black text-purple-950 mb-3 uppercase tracking-wider">
                    {lang === 'es' ? 'Medidas de Control' : 'Control Measures'}
                  </div>
                  <ul className="space-y-2 mb-4">
                    {controlMeasures.map((measure, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                        <span className="material-symbols-outlined text-purple-900 text-base flex-shrink-0 font-bold">
                          check_circle
                        </span>
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setActivePathogen(item)}
                    className="w-full neu-raised hover:neu-pressed active:neu-pressed text-purple-950 py-2.5 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{ borderRadius: '90px' }}
                  >
                    <span>{lang === 'es' ? 'Ficha Fitosanitaria Completa' : 'Full Protocol Datasheet'}</span>
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Real-time Analysis CTA Banner */}
      <section className="mt-12 neu-card p-6 sm:p-8 border-2 border-purple-400/40">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 neu-raised flex items-center justify-center animate-pulse" style={{ borderRadius: '90px' }}>
              <span className="material-symbols-outlined text-purple-900 text-5xl sm:text-6xl">
                psychology
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h4 className="font-headline-md text-2xl text-slate-900 font-black">
              {lang === 'es'
                ? '¿Necesitas un análisis en tiempo real?'
                : 'Need real-time diagnostic analysis?'}
            </h4>
            <p className="font-body-md text-sm text-slate-700 font-medium max-w-xl">
              {lang === 'es'
                ? 'Usa nuestra herramienta de escaneo con visión artificial para identificar instantáneamente patógenos en el campo con una precisión del 98.4%.'
                : 'Use our computer vision scan tool to instantly identify pathogens in the field with 98.4% diagnostic accuracy.'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={onOpenScanner}
                className="neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed px-6 py-3 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                style={{ borderRadius: '90px' }}
              >
                <span className="material-symbols-outlined text-lg">photo_camera</span>
                <span>{lang === 'es' ? 'Abrir Escáner' : 'Open Scanner'}</span>
              </button>
              <button
                onClick={() => setShowProtocolModal(true)}
                className="neu-raised active:neu-pressed text-purple-950 px-6 py-3 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                style={{ borderRadius: '90px' }}
              >
                <span className="material-symbols-outlined text-lg">description</span>
                <span>{lang === 'es' ? 'Descargar Protocolos' : 'Download Protocols'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pathogen Detail Modal */}
      <Modal
        isOpen={!!activePathogen}
        onClose={() => setActivePathogen(null)}
        title={activePathogen?.scientificName || ''}
        subtitle={activePathogen ? (lang === 'es' ? activePathogen.commonNameEs : activePathogen.commonNameEn) : ''}
        icon="bug_report"
        maxWidthClass="max-w-lg"
      >
        {activePathogen && (
          <div className="space-y-4 text-slate-950 pt-1">
            {/* Compact Image Banner */}
            <div className="h-40 overflow-hidden p-1 bg-white rounded-2xl border border-purple-100 shadow-md">
              <img src={activePathogen.image} alt={activePathogen.scientificName} className="w-full h-full object-cover rounded-xl" />
            </div>

            {/* Severity Indicator */}
            <div className="flex items-center justify-between p-3 bg-purple-50/90 border border-purple-200 rounded-2xl">
              <span className="text-xs font-black text-purple-950 uppercase">
                {lang === 'es' ? 'Nivel de Severidad:' : 'Severity Level:'}
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-950 border border-amber-300 font-black text-xs rounded-full">
                {lang === 'es' ? activePathogen.severityEs : activePathogen.severityEn}
              </span>
            </div>

            {/* Agronomic Description */}
            <div>
              <h4 className="text-xs font-black text-purple-950 uppercase mb-1">
                {lang === 'es' ? 'Descripción Agronómica' : 'Agronomic Description'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-950 font-semibold leading-relaxed">
                {lang === 'es' ? activePathogen.descriptionEs : activePathogen.descriptionEn}
              </p>
            </div>

            {/* Symptoms */}
            <div>
              <h4 className="text-xs font-black text-purple-950 uppercase mb-1.5">
                {lang === 'es' ? 'Sintomatología en el Cultivo' : 'Crop Symptoms'}
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-950 font-semibold">
                {(lang === 'es' ? activePathogen.symptomsEs : activePathogen.symptomsEn).map((sym, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-amber-700 text-base font-bold flex-shrink-0">warning</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rotational Chemical/Organic Protocol */}
            <div>
              <h4 className="text-xs font-black text-purple-950 uppercase mb-1.5">
                {lang === 'es' ? 'Rotación de Fungicidas Recomendada' : 'Fungicide Rotation'}
              </h4>
              <div className="p-3.5 bg-purple-50/90 border border-purple-200 text-xs text-slate-950 font-semibold space-y-1.5 rounded-2xl">
                <p>• <strong>FRAC 11:</strong> Azoxistrobina 250 g/L (0.4 cc/L)</p>
                <p>• <strong>FRAC 3:</strong> Difenoconazol 250 g/L (0.5 cc/L)</p>
                <p>• <strong>Bio-Fungicida:</strong> Aceite de Melaleuca (1.5 cc/L)</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  alert(
                    lang === 'es'
                      ? `Protocolo Fitosanitario de ${activePathogen.scientificName} descargado exitosamente.`
                      : `Phytosanitary Protocol for ${activePathogen.scientificName} downloaded successfully.`
                  );
                }}
                className="flex-1 neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed py-3 font-extrabold text-xs text-white transition-all cursor-pointer"
                style={{ borderRadius: '90px' }}
              >
                {lang === 'es' ? 'Descargar PDF' : 'Download PDF'}
              </button>
              <button
                onClick={() => setActivePathogen(null)}
                className="px-6 neu-raised active:neu-pressed text-slate-900 py-3 font-extrabold text-xs transition-all cursor-pointer"
                style={{ borderRadius: '90px' }}
              >
                {lang === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Protocol Download Modal */}
      <Modal
        isOpen={showProtocolModal}
        onClose={() => setShowProtocolModal(false)}
        title={lang === 'es' ? 'Protocolos Fitosanitarios SisFito' : 'SisFito Phytosanitary Protocols'}
        icon="menu_book"
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4 pt-1 text-slate-950">
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {lang === 'es'
              ? 'Selecciona los manuales técnicos oficiales Moradetec AI para la prevención de enfermedades en moras de Castilla:'
              : 'Select official Moradetec AI technical manuals for disease prevention in Andean blackberries:'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                alert(lang === 'es' ? 'Descargando Guía Integrada Botrytis...' : 'Downloading Botrytis Guide...');
                setShowProtocolModal(false);
              }}
              className="w-full text-left p-3.5 neu-raised hover:neu-pressed active:neu-pressed text-xs font-black text-slate-900 flex justify-between items-center cursor-pointer transition-all"
              style={{ borderRadius: '18px' }}
            >
              <span>📘 Guía Integrada Control Botrytis v2.4 (PDF)</span>
              <span className="material-symbols-outlined text-purple-900">download</span>
            </button>
            <button
              onClick={() => {
                alert(lang === 'es' ? 'Descargando Manual Mildeo Velloso...' : 'Downloading Downy Mildew Manual...');
                setShowProtocolModal(false);
              }}
              className="w-full text-left p-3.5 neu-raised hover:neu-pressed active:neu-pressed text-xs font-black text-slate-900 flex justify-between items-center cursor-pointer transition-all"
              style={{ borderRadius: '18px' }}
            >
              <span>📕 Manual Manejo Mildeo Velloso en Andes (PDF)</span>
              <span className="material-symbols-outlined text-purple-900">download</span>
            </button>
            <button
              onClick={() => {
                alert(lang === 'es' ? 'Descargando Calendario de Rotación...' : 'Downloading Rotation Calendar...');
                setShowProtocolModal(false);
              }}
              className="w-full text-left p-3.5 neu-raised hover:neu-pressed active:neu-pressed text-xs font-black text-slate-900 flex justify-between items-center cursor-pointer transition-all"
              style={{ borderRadius: '18px' }}
            >
              <span>📗 Calendario FRAC Rotación de Fungicidas (PDF)</span>
              <span className="material-symbols-outlined text-purple-900">download</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
