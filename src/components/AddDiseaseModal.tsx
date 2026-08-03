import React, { useState } from 'react';
import { Language, Pathogen } from '../types';
import { Modal } from './Modal';

interface AddDiseaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddPathogen: (newPathogen: Pathogen) => void;
}

export const AddDiseaseModal: React.FC<AddDiseaseModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddPathogen,
}) => {
  const [scientificName, setScientificName] = useState('');
  const [commonName, setCommonName] = useState('');
  const [category, setCategory] = useState<'fungal' | 'bacterial' | 'viral'>('fungal');
  const [severity, setSeverity] = useState<'Crítico' | 'Alerta Max' | 'Moderado'>('Alerta Max');
  const [description, setDescription] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [control, setControl] = useState('');
  const [isSuccessAdded, setIsSuccessAdded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scientificName.trim() || !commonName.trim()) return;

    const symptomsList = symptoms
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const controlList = control
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const created: Pathogen = {
      id: `custom-${Date.now()}`,
      scientificName: scientificName.trim(),
      commonNameEs: commonName.trim(),
      commonNameEn: commonName.trim(),
      category,
      severityEs: severity as any,
      severityEn: (severity === 'Crítico' ? 'Critical' : severity === 'Moderado' ? 'Moderate' : 'Max Alert') as any,
      descriptionEs: description.trim() || 'Ficha fitosanitaria personalizada agregada por el usuario.',
      descriptionEn: description.trim() || 'Custom phytosanitary datasheet added by user.',
      symptomsEs: symptomsList.length > 0 ? symptomsList : ['Sintomatología foliar y de fruto registrada.'],
      symptomsEn: symptomsList.length > 0 ? symptomsList : ['Recorded foliar and fruit symptoms.'],
      controlMeasuresEs: controlList.length > 0 ? controlList : ['Manejo agronómico recomendado.'],
      controlMeasuresEn: controlList.length > 0 ? controlList : ['Recommended agronomic management.'],
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80',
    };

    onAddPathogen(created);
    setIsSuccessAdded(true);

    setTimeout(() => {
      setIsSuccessAdded(false);
      setScientificName('');
      setCommonName('');
      setDescription('');
      setSymptoms('');
      setControl('');
      onClose();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'es' ? 'Ingresar Ficha Fitosanitaria' : 'Add Phytosanitary Data'}
      subtitle={lang === 'es' ? 'Ingresa los datos para registrar el nodo' : 'Fill fields to register node data'}
      icon="add_box"
      maxWidthClass="max-w-md sm:max-w-lg"
    >
      <div className="space-y-4">
        {isSuccessAdded && (
          <div className="p-3 neu-pressed text-emerald-950 text-xs font-black flex items-center gap-2 animate-fadeIn shrink-0" style={{ borderRadius: '14px' }}>
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>
              {lang === 'es'
                ? '¡Ficha de enfermedad registrada con éxito!'
                : 'Disease datasheet successfully registered!'}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-800 mb-1">
                {lang === 'es' ? 'Nombre Científico / Patógeno *' : 'Scientific Name *'}
              </label>
              <input
                type="text"
                required
                placeholder="ej. Peronospora rubi"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-800 mb-1">
                {lang === 'es' ? 'Nombre Común (Español) *' : 'Common Name *'}
              </label>
              <input
                type="text"
                required
                placeholder="ej. Mildeo Velloso"
                value={commonName}
                onChange={(e) => setCommonName(e.target.value)}
                className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-800 mb-1">
                {lang === 'es' ? 'Categoría' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
              >
                <option value="fungal">{lang === 'es' ? 'Hongo / Fúngico' : 'Fungal'}</option>
                <option value="bacterial">{lang === 'es' ? 'Bacteriano' : 'Bacterial'}</option>
                <option value="viral">{lang === 'es' ? 'Viral / Fisiopatía' : 'Viral'}</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-800 mb-1">
                {lang === 'es' ? 'Nivel de Severidad' : 'Severity Level'}
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
              >
                <option value="Crítico">{lang === 'es' ? 'Crítico' : 'Critical'}</option>
                <option value="Alerta Max">{lang === 'es' ? 'Alerta Máxima' : 'Max Alert'}</option>
                <option value="Moderado">{lang === 'es' ? 'Moderado' : 'Moderate'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-800 mb-1">
              {lang === 'es' ? 'Descripción Agronómica' : 'Agronomic Description'}
            </label>
            <textarea
              rows={2}
              placeholder={lang === 'es' ? 'Escribe detalles de diagnóstico...' : 'Diagnostic details...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-800 mb-1">
              {lang === 'es' ? 'Síntomas (separados por coma)' : 'Symptoms (comma separated)'}
            </label>
            <input
              type="text"
              placeholder="ej. Fruto necrosado, Mofetado blanco"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-800 mb-1">
              {lang === 'es' ? 'Medidas de Control & Manejo' : 'Control Measures'}
            </label>
            <input
              type="text"
              placeholder="ej. Podas sanitarias, Oxicloruro de Cobre"
              value={control}
              onChange={(e) => setControl(e.target.value)}
              className="w-full px-3.5 py-2.5 neu-input text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2 shrink-0">
            <button
              type="submit"
              className="flex-1 py-3 neu-btn-primary-raised hover:neu-btn-primary-pressed text-white font-extrabold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
              style={{ borderRadius: '90px' }}
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>{lang === 'es' ? 'Guardar Ficha' : 'Save Datasheet'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 neu-raised active:neu-pressed text-slate-800 font-extrabold text-xs cursor-pointer transition-all"
              style={{ borderRadius: '90px' }}
            >
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
