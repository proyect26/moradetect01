import React, { useState } from 'react';
import { Language, LearnStage } from '../types';
import { LEARN_STAGES, USER_PROFILE } from '../data/mockData';
import { Modal } from './Modal';

interface LearnViewProps {
  lang: Language;
}

export const LearnView: React.FC<LearnViewProps> = ({ lang }) => {
  const [selectedStage, setSelectedStage] = useState<LearnStage | null>(null);
  const [phVal, setPhVal] = useState<number>(6.0);

  return (
    <div className="space-y-12 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header Section */}
      <section className="text-center space-y-3">
        <span className="font-label-caps text-xs text-purple-950 tracking-widest uppercase font-black">
          {lang === 'es' ? 'Ruta de Capacitación Moradetec' : 'Moradetec Training Pathway'}
        </span>
        <h2 className="font-headline-lg text-3xl sm:text-4xl font-black text-slate-900">
          {lang === 'es' ? 'Aprende conmigo' : 'Learn with Me'}
        </h2>
        <p className="font-body-lg text-sm sm:text-base text-slate-700 font-medium max-w-xl mx-auto leading-relaxed">
          {lang === 'es'
            ? 'Domina la ciencia de la agricultura sostenible a través de nuestro viaje educativo interactivo.'
            : 'Master the science of sustainable agriculture through our interactive educational journey.'}
        </p>
      </section>

      {/* Learning Tree Vertical Layout */}
      <div className="relative w-full flex flex-col items-center space-y-16 sm:space-y-20 py-4">
        {/* Connector Line */}
        <div className="absolute top-10 bottom-10 w-1.5 bg-gradient-to-b from-purple-400 via-purple-300 to-slate-300 rounded-full z-0 shadow-inner"></div>

        {LEARN_STAGES.map((stage, idx) => {
          const isLeft = idx % 2 === 0;
          const title = lang === 'es' ? stage.titleEs : stage.titleEn;
          const description = lang === 'es' ? stage.descriptionEs : stage.descriptionEn;
          const tags = lang === 'es' ? stage.tagsEs : stage.tagsEn;

          return (
            <div
              key={stage.id}
              className={`relative z-10 w-full flex justify-center ${
                isLeft ? 'md:justify-start md:pl-8' : 'md:justify-end md:pr-8'
              }`}
            >
              <div
                onClick={() => setSelectedStage(stage)}
                className="neu-card p-6 sm:p-8 w-full max-w-md cursor-pointer hover:scale-[1.02] transition-all duration-300 border border-white/80 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 neu-raised flex items-center justify-center text-purple-900 flex-shrink-0 group-hover:text-purple-950 transition-colors" style={{ borderRadius: '90px' }}>
                    <span className="material-symbols-outlined text-3xl font-bold">{stage.icon}</span>
                  </div>
                  <div>
                    <span className="font-label-caps text-xs text-purple-950 font-black tracking-widest uppercase">
                      {lang === 'es' ? `Etapa ${stage.stageNumber}` : `Stage ${stage.stageNumber}`}
                    </span>
                    <h3 className="font-headline-md text-xl font-black text-slate-900">{title}</h3>
                  </div>
                </div>

                <p className="font-body-md text-xs sm:text-sm text-slate-800 font-medium mb-6 leading-relaxed">
                  {description}
                </p>

                {/* Stage 02 - pH Range Widget */}
                {stage.targetPh && (
                  <div className="neu-pressed p-4 mb-4" style={{ borderRadius: '16px' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-purple-950 uppercase">
                        {lang === 'es' ? 'Rango de pH Objetivo' : 'Target pH Range'}
                      </span>
                      <span className="text-xs font-black text-purple-900">{stage.targetPh}</span>
                    </div>
                    <div className="w-full h-3 neu-card-inset rounded-full overflow-hidden relative p-0.5">
                      <div className="h-full w-2/3 bg-purple-800 ml-[20%] rounded-full"></div>
                    </div>
                  </div>
                )}

                {/* Stage 04 - SisFito Status Badge */}
                {stage.statusBadgeEs && (
                  <div className="flex items-center justify-between p-3.5 neu-pressed mb-4" style={{ borderRadius: '16px' }}>
                    <span className="text-xs font-black text-purple-950">
                      {lang === 'es' ? 'Estado de SisFito' : 'SisFito Status'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full animate-ping"></div>
                      <span className="text-xs font-black text-slate-900">
                        {lang === 'es' ? stage.statusBadgeEs : stage.statusBadgeEn}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3.5 py-1.5 neu-pressed text-purple-950 font-black text-[10px] uppercase tracking-wider"
                      style={{ borderRadius: '90px' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Single Image (Stage 01) */}
                {stage.image && (
                  <div className="mt-6 w-full h-32 neu-card-inset overflow-hidden p-1">
                    <img className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" src={stage.image} alt={title} />
                  </div>
                )}

                {/* Dual Images (Stage 03) */}
                {stage.images && (
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {stage.images.map((imgUrl, iIdx) => (
                      <div key={iIdx} className="h-24 neu-card-inset overflow-hidden p-1">
                        <img className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" src={imgUrl} alt={`${title} ${iIdx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 text-right">
                  <span className="text-xs font-extrabold text-purple-900 group-hover:underline inline-flex items-center gap-1">
                    {lang === 'es' ? 'Ver lección detallada' : 'View detailed lesson'}{' '}
                    <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Detail Drawer Modal */}
      <Modal
        isOpen={!!selectedStage}
        onClose={() => setSelectedStage(null)}
        title={selectedStage ? (lang === 'es' ? selectedStage.titleEs : selectedStage.titleEn) : ''}
        subtitle={selectedStage ? (lang === 'es' ? `Etapa ${selectedStage.stageNumber}` : `Stage ${selectedStage.stageNumber}`) : ''}
        icon={selectedStage?.icon || 'school'}
        maxWidthClass="max-w-lg"
      >
        {selectedStage && (
          <div className="space-y-4 pt-1 text-slate-950">
            <p className="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed">
              {lang === 'es' ? selectedStage.descriptionEs : selectedStage.descriptionEn}
            </p>

            {/* Interactive pH Simulator for Stage 02 */}
            {selectedStage.id === 'stage-2' && (
              <div className="bg-purple-50/90 border border-purple-200 p-4 space-y-3" style={{ borderRadius: '18px' }}>
                <h4 className="text-xs font-black text-purple-950 uppercase">
                  {lang === 'es' ? 'Simulador de pH de Sustrato' : 'Substrate pH Simulator'}
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-950">
                    {lang === 'es' ? 'pH Actual:' : 'Current pH:'} {phVal.toFixed(1)}
                  </span>
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                      phVal >= 5.5 && phVal <= 6.5
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-amber-100 text-amber-950 border border-amber-300'
                    }`}
                  >
                    {phVal >= 5.5 && phVal <= 6.5
                      ? lang === 'es'
                        ? 'Óptimo'
                        : 'Optimal'
                      : lang === 'es'
                      ? 'Ajuste requerido'
                      : 'Adjustment needed'}
                  </span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="8.0"
                  step="0.1"
                  value={phVal}
                  onChange={(e) => setPhVal(parseFloat(e.target.value))}
                  className="w-full accent-purple-800 cursor-pointer"
                />
                <p className="text-[11px] text-slate-900 font-semibold">
                  {lang === 'es'
                    ? 'El cultivo de rosa absorbe hierro, zinc y manganeso con máxima eficiencia a pH 5.8.'
                    : 'Rose plants absorb iron, zinc, and manganese with maximum efficiency at pH 5.8.'}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-purple-950 tracking-wider">
                {lang === 'es' ? 'Puntos Clave Fitosanitarios' : 'Key Phytosanitary Points'}
              </h4>
              <ul className="space-y-2">
                {(lang === 'es' ? selectedStage.keyTakeawaysEs : selectedStage.keyTakeawaysEn).map(
                  (takeaway, kIdx) => (
                    <li key={kIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-950 font-semibold">
                      <span className="material-symbols-outlined text-purple-900 text-base flex-shrink-0 font-bold">
                        check_circle
                      </span>
                      <span>{takeaway}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Expert Instructor */}
            <div className="flex items-center gap-3 p-3.5 bg-purple-50/90 border border-purple-200" style={{ borderRadius: '18px' }}>
              <img
                src={USER_PROFILE.expertAvatar}
                alt="Expert Instructor"
                className="w-10 h-10 rounded-full object-cover neu-raised p-0.5"
              />
              <div className="text-xs">
                <p className="font-black text-slate-950">Dra. Elena Vasquez</p>
                <p className="text-purple-950 font-bold">
                  {lang === 'es' ? 'Especialista en Fisiología Vegetal Moradetec' : 'Moradetec Plant Physiologist'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedStage(null)}
              className="w-full neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed py-3.5 font-extrabold text-xs uppercase tracking-wider cursor-pointer transition-all text-white"
              style={{ borderRadius: '90px' }}
            >
              {lang === 'es' ? 'Completar Etapa' : 'Complete Stage'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
