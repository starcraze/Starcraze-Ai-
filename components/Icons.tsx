
import React from 'react';

export const LogoIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="url(#paint0_linear_1_2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="url(#paint1_linear_1_2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="paint0_linear_1_2" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="var(--color-primary)"/>
        <stop offset="1" stopColor="var(--color-accent)"/>
      </linearGradient>
      <linearGradient id="paint1_linear_1_2" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
         <stop stopColor="var(--color-primary)"/>
        <stop offset="1" stopColor="var(--color-accent)"/>
      </linearGradient>
    </defs>
  </svg>
);

export const CopyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

export const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const ImageIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

export const ZapIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

export const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73L12 3z"/>
        <path d="M4.5 4.5l3 3"/>
        <path d="M16.5 4.5l-3 3"/>
        <path d="M16.5 19.5l-3-3"/>
        <path d="M4.5 19.5l3-3"/>
    </svg>
);

export const NegativePromptIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

export const StoryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
);

export const BrushIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.06 11.9 2 22l10.1-7.06a1 1 0 0 1 1.25.25l3 4.01a1 1 0 0 0 1.63-.33l.99-1.66a1 1 0 0 0-.21-1.28l-4.01-3a1 1 0 0 1-.25-1.25z"></path>
        <path d="m22 2-2.5 2.5"></path>
    </svg>
);

export const XCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);

export const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

export const LoaderIcon: React.FC = () => (
    <svg width="48" height="48" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <g transform="translate(2 1)" stroke="url(#grad)" strokeWidth="1.5">
                <circle cx="42.601" cy="11.462" r="5" fillOpacity="0" fill="#fff">
                    <animate attributeName="fill-opacity"
                         begin="0s" dur="1.3s"
                         values="0;0;0;0;0;0;0;1" calcMode="linear"
                         repeatCount="indefinite" />
                </circle>
                <circle cx="49.063" cy="27.063" r="5" fillOpacity="0" fill="#fff">
                    <animate attributeName="fill-opacity"
                         begin="0s" dur="1.3s"
                         values="0;0;0;0;0;1;0;0" calcMode="linear"
                         repeatCount="indefinite" />
                </circle>
                <circle cx="42.601" cy="42.663" r="5" fillOpacity="0" fill="#fff">
                    <animate attributeName="fill-opacity"
                         begin="0s" dur="1.3s"
                         values="0;0;0;1;0;0;0;0" calcMode="linear"
                         repeatCount="indefinite" />
                </circle>
                <circle cx="27" cy="49.125" r="5" fillOpacity="0" fill="#fff">
                    <animate attributeName="fill-opacity"
                         begin="0s" dur="1.3s"
                         values="0;0;1;0;0;0;0;0" calcMode="linear"
                         repeatCount="indefinite" />
                </circle>
                <circle cx="11.399" cy="42.663" r="5" fillOpacity="0" fill="#fff">
                    <animate attributeName="fill-opacity"
                         begin="0s" dur="1.3s"
                         values="0;1;0;0;0;0;0;0" calcMode="linear"
                         repeatCount="indefinite" />
                </circle>
                <circle cx="4.938" cy="27.063" r="5" fillOpacity="0" fill="#fff">
                    <animate attributeName="fill-opacity"
                         begin="0s" dur="1.3s"
                         values="1;0;0;0;0;0;0;0" calcMode="linear"
                         repeatCount="indefinite" />
                </circle>
                <circle cx="11.399" cy="11.462" r="5" fillOpacity="0" fill="#fff">
                    <animate attributeName="fill-opacity"
                         begin="0s" dur="1.3s"
                         values="0;0;0;0;0;0;1;0" calcMode="linear"
                         repeatCount="indefinite" />
                </circle>
            </g>
        </g>
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
        </defs>
    </svg>
);

export const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const WandIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 4V2m0 14v-2m-7.5-1.5L6 13m0-2l-1.5-.5M12 9.5l.5-1.5m0 9l-.5 1.5M4.5 15l-1.5.5M19.5 9l1.5-.5M18 13l1.5.5m-5.5 2.5L13 18m-2 0l-1.5.5m9-3.5l1.5-.5"></path>
        <path d="M2 12h2M20 12h2"></path>
        <path d="M12 2v2M12 20v2"></path>
    </svg>
);

export const ChevronDownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);