import React from "react";

const MaintenancePage: React.FC = () => {
  return (
    <div 
      className="min-h-screen text-white flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/maintenance-sad.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-500">🚨 MAINTENANCE 🚨</h1>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-300">
          Sorry folks, the site is under maintenance.
        </p>
        
        <p className="text-base sm:text-lg mb-8 text-gray-400">
          The Dev is fixing its mess right now. ⚙️
        </p>
        
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4 sm:p-6 mb-8">
          <p className="text-sm sm:text-base text-gray-300 italic">
            In the meantime, go watch some horror movies and come back to share them once FearLog is back from the dead again! 🎬👻
          </p>
        </div>        
        <p className="text-xs sm:text-sm text-gray-500">
          We'll be back soon. Thanks for your patience! 🍿
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
