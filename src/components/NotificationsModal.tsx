import React from 'react';
import { Language, NotificationItem } from '../types';
import { Modal } from './Modal';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  lang: Language;
  onOpenAiChatWithPrompt?: (prompt: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  lang,
  onOpenAiChatWithPrompt,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'es' ? 'Notificaciones Agrícolas' : 'Farm Notifications'}
      icon="notifications"
      maxWidthClass="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-200">
          <span className="text-slate-700 font-extrabold">
            {notifications.filter((n) => !n.read).length}{' '}
            {lang === 'es' ? 'sin leer' : 'unread'}
          </span>
          <button
            onClick={onMarkAllRead}
            className="text-purple-900 font-black hover:underline cursor-pointer"
          >
            {lang === 'es' ? 'Marcar todas como leídas' : 'Mark all as read'}
          </button>
        </div>

        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {notifications.map((notif) => {
            const title = lang === 'es' ? notif.titleEs : notif.titleEn;
            const desc = lang === 'es' ? notif.descEs : notif.descEn;

            return (
              <div
                key={notif.id}
                className={`p-4 transition-all space-y-2 ${
                  notif.read ? 'neu-raised' : 'neu-pressed bg-purple-50/50'
                }`}
                style={{ borderRadius: '18px' }}
              >
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h4 className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 flex-1">
                    {notif.type === 'alert' && (
                      <span className="material-symbols-outlined text-rose-800 text-base font-bold shrink-0">warning</span>
                    )}
                    {notif.type === 'scan' && (
                      <span className="material-symbols-outlined text-purple-900 text-base font-bold shrink-0">biotech</span>
                    )}
                    {notif.type === 'info' && (
                      <span className="material-symbols-outlined text-indigo-800 text-base font-bold shrink-0">info</span>
                    )}
                    {notif.type === 'crop_task' && (
                      <span className="material-symbols-outlined text-emerald-800 text-base font-bold shrink-0">calendar_month</span>
                    )}
                    <span>{title}</span>
                  </h4>
                  <span className="text-[10px] text-purple-900 font-extrabold shrink-0">{notif.time}</span>
                </div>

                {notif.folderName && (
                  <div className="inline-flex items-center gap-1 text-[10px] font-black text-purple-900 bg-purple-200/60 px-2 py-0.5 rounded-md">
                    <span className="material-symbols-outlined text-xs">folder</span>
                    <span>{notif.folderName}</span>
                  </div>
                )}

                <p className="text-xs text-slate-800 font-medium leading-relaxed">{desc}</p>

                {/* Robot Question Button */}
                {notif.actionPrompt && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenAiChatWithPrompt) {
                          onOpenAiChatWithPrompt(notif.actionPrompt!);
                          onClose();
                        }
                      }}
                      className="w-full py-2 px-3 liquid-glass hover:bg-purple-900 hover:text-white bg-purple-900/10 text-purple-950 font-black text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-purple-300 shadow-sm"
                      style={{ borderRadius: '90px' }}
                    >
                      <span className="material-symbols-outlined text-sm text-purple-900">smart_toy</span>
                      <span>
                        {lang === 'es' ? '🤖 Preguntar al Robot IA sobre este estado' : '🤖 Ask AI Robot about this status'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed py-3 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
          style={{ borderRadius: '90px' }}
        >
          {lang === 'es' ? 'Cerrar' : 'Close'}
        </button>
      </div>
    </Modal>
  );
};
