import React from 'react';

export const HospitalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H4zm11 6a1 1 0 10-2 0v2H9a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
  </svg>
);

export const DoctorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2a4 4 0 00-4 4v2a1 1 0 001 1h6a1 1 0 001-1V6a4 4 0 00-4-4zM8.5 13a4.5 4.5 0 119 0v4.32a.5.5 0 01-.13.33L16.5 19h-9l-.87-1.35a.5.5 0 01-.13-.33V13z" clipRule="evenodd" />
  </svg>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" clipRule="evenodd" />
  </svg>
);

export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z" />
        <path d="M17 11a1 1 0 011 1v1a5 5 0 01-10 0v-1a1 1 0 112 0v1a3 3 0 006 0v-1a1 1 0 011-1z" />
        <path d="M19 11a1 1 0 011 1v.5a7 7 0 01-14 0V12a1 1 0 112 0v.5a5 5 0 0010 0V12a1 1 0 011-1z" />
    </svg>
);

export const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM4 12a8 8 0 1016 0H4zm9-7.5a1 1 0 00-2 0V12h2V4.5zM7.5 13a1 1 0 000 2H12v-2H7.5zm7-2a1 1 0 011-1 4 4 0 010 8 1 1 0 110-2 2 2 0 100-4 1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M3 17a2 2 0 012-2h14a2 2 0 110 4H5a2 2 0 01-2-2zm3 2a1 1 0 011-1h8a1 1 0 110 2H7a1 1 0 01-1-1zM12 3a1 1 0 011 1v8.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L11 12.586V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

export const PieChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm-1.5 3a1.5 1.5 0 013 0v7.5A1.5 1.5 0 0112 14h-1.5a1.5 1.5 0 01-1.5-1.5V5z" />
        <path d="M12 14a1.5 1.5 0 011.5 1.5v3.086a1.5 1.5 0 01-3 0V15.5A1.5 1.5 0 0112 14z" opacity="0.5" />
    </svg>
);

export const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);