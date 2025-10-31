import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: | 'dashboard' | 'log' | 'food' | 'settings' | 'add' | 'edit' | 'delete' | 'close' 
        | 'upload' | 'check' | 'reset' | 'confirm' | 'cancel' | 'search' | 'star' | 'star-outline' | 'camera'
        | 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'calories' | 'protein' | 'carbs' | 'fat' | 'info' | 'back'
        | 'chevron-down' | 'chevron-up' | 'grid' | 'sliders' | 'plus' | 'sun' | 'moon' | 'more-horizontal';
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  // Collection of SVG paths for each icon name
  const icons: { [key in IconProps['name']]: React.ReactElement } = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />,
    log: <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />,
    food: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75v4.5a3.75 3.75 0 01-3.75 3.75h-9a3.75 3.75 0 01-3.75-3.75v-4.5m16.5 0a3.75 3.75 0 00-3.75-3.75h-9a3.75 3.75 0 00-3.75 3.75m16.5 0v.001M6.375 9.75v.001" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.008 1.11-1.226a11.95 11.95 0 013.59 0c.55.218 1.02.684 1.11 1.226m-5.814 0c.34-.203.716-.347 1.106-.438m4.608 0c.39.091.766.235 1.106.438m-7.218 0l-.54-2.893.54 2.893zm11.238 0l.54-2.893-.54 2.893M12 21a9 9 0 110-18 9 9 0 010 18zM12 15a3 3 0 110-6 3 3 0 010 6z" />,
    add: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />,
    delete: <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
    reset: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.696L7.985 5.356m0 0v4.992m0 0h4.992m0 0l3.181-3.183a8.25 8.25 0 0111.667 0l3.181 3.183" />,
    confirm: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
    cancel: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
    star: <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />,
    'star-outline': <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />,
    camera: <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.214 2.214 0 015.185 7.5c-1.264 0-2.285.93-2.285 2.082v4.834c0 1.151 1.021 2.082 2.285 2.082h13.628c1.264 0 2.285-.93 2.285-2.082v-4.834c0-1.152-1.021-2.082-2.285-2.082a2.214 2.214 0 00-1.642 1.325l-1.556 2.313m-6.733 0l-1.556-2.313m0 0a2.235 2.235 0 01-1.285-2.082c0-1.263 1.02-2.285 2.285-2.285h.046a2.215 2.215 0 011.64 1.325m6.733 0c.224-.333.39-.71.48-1.107a2.215 2.215 0 00-1.64-1.325h-.046c-1.263 0-2.285 1.022-2.285 2.285a2.235 2.235 0 001.285 2.082m-6.733 0c.34-.503.77-.93 1.285-1.248m-1.285 1.248a2.235 2.235 0 01-.48 1.107" />,
    breakfast: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />,
    lunch: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM3 18.75h18" />,
    dinner: <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />,
    snack: <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5-7.5-7.5 7.5-7.5zM11.25 12.33l-3.32-3.32-3.32 3.32 3.32 3.32 3.32-3.32z" />,
    calories: <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.62c1.309 0 2.587-.513 3.536-1.464A8.252 8.252 0 0115.362 5.214zM12 12.62a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z" />,
    protein: <path strokeLinecap="round" strokeLinejoin="round" d="M12.94 6.94a1.5 1.5 0 11-2.12-2.122 1.5 1.5 0 012.12 2.122zM6.528 12.472l6.944-6.944a1.5 1.5 0 012.122 0l1.414 1.414a1.5 1.5 0 010 2.122l-6.944 6.944a1.5 1.5 0 01-2.122 0L6.528 14.59a1.5 1.5 0 010-2.122zM12.94 17.06a4.5 4.5 0 11-6.364-6.364 4.5 4.5 0 016.364 6.364z" />,
    carbs: <path strokeLinecap="round" strokeLinejoin="round" d="M6.375 21v-5.625a3.375 3.375 0 013.375-3.375h4.5a3.375 3.375 0 013.375 3.375V21m-11.25 0h11.25" />,
    fat: <path strokeLinecap="round" strokeLinejoin="round" d="M14.12 7.88a5.25 5.25 0 00-7.24 0 5.25 5.25 0 000 7.24 5.25 5.25 0 007.24 0 5.25 5.25 0 000-7.24zM10.5 4.5v-.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.75" />,
    info: <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />,
    'chevron-down': <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />,
    'chevron-up': <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />,
    grid: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 8.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 8.25 20.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />,
    sliders: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM10.5 12h9.75M10.5 12a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM10.5 18h9.75M10.5 18a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
    sun: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />,
    moon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />,
    'more-horizontal': <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />,
  };

  const iconElement = icons[name];
  if (!iconElement) return null; // Fallback for any missing icon

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      {...props}
    >
      {iconElement}
    </svg>
  );
};

export default Icon;