import React from 'react';

const VersionInfo = () => {
  // Get version from environment or package.json
  const version = import.meta.env.VITE_APP_VERSION || '0.2.1';
  const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
  const gitCommit = import.meta.env.VITE_GIT_COMMIT || 'unknown';
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs p-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <span>v{version}</span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline truncate max-w-[100px]">{gitCommit.substring(0, 7)}</span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline text-[0.6rem]">{new Date(buildTime).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default VersionInfo;