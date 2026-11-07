import React from 'react';

export const MessengerSphere: React.FC<{ className?: string }> = ({ className = '' }) => (
  <a
    href="https://www.facebook.com/messages/t/1130638232810969"
    target="_blank"
    rel="noopener noreferrer"
    title="Open Team Messenger Chat"
    aria-label="Open Team Messenger Chat"
    className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-[#006AFF] via-[#00B2FF] to-[#00E5FF] shadow-[0_8px_20px_rgba(0,106,255,0.45),inset_0_2px_3px_rgba(255,255,255,0.55),inset_0_-3px_4px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5 active:scale-95 active:shadow-inner transition-all duration-200 cursor-pointer overflow-hidden group shrink-0 ${className}`}
  >
    <span className="absolute top-1.5 left-2.5 w-4 h-2 rounded-full bg-white/45 blur-[0.5px] -rotate-12 pointer-events-none" />
    <svg
      className="w-5 h-5 fill-current text-white shrink-0 group-hover:scale-110 transition-transform duration-200"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.915 1.455 5.518 3.734 7.218v3.524a.8.8 0 0 0 1.2.693l3.242-1.785c.59.102 1.2.158 1.824.158 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.383l-2.583-2.756-5.042 2.756 5.545-5.888 2.648 2.756 4.977-2.756-5.545 5.888z" />
    </svg>
  </a>
);

export const TelegramSphere: React.FC<{ className?: string }> = ({ className = '' }) => (
  <a
    href="https://web.telegram.org/k/#-4389414428"
    target="_blank"
    rel="noopener noreferrer"
    title="Open Team Telegram Chat"
    aria-label="Open Team Telegram Chat"
    className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-[#0088CC] via-[#24A1DE] to-[#37B7F7] shadow-[0_8px_20px_rgba(36,161,222,0.45),inset_0_2px_3px_rgba(255,255,255,0.55),inset_0_-3px_4px_rgba(0,0,0,0.35)] hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5 active:scale-95 active:shadow-inner transition-all duration-200 cursor-pointer overflow-hidden group shrink-0 ${className}`}
  >
    <span className="absolute top-1.5 left-2.5 w-4 h-2 rounded-full bg-white/45 blur-[0.5px] -rotate-12 pointer-events-none" />
    <svg
      className="w-5 h-5 fill-current text-white shrink-0 -ml-0.5 group-hover:scale-110 transition-transform duration-200"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.693c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
    </svg>
  </a>
);
