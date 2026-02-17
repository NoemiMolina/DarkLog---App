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
      
      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 text-red-500">🚨 MAINTENANCE 🚨</h1>
        
        <p className="text-2xl mb-6 text-gray-300">
          Sorry folks, the site is under maintenance for the next <span className="text-yellow-400 font-bold">48 hours</span>
        </p>
        
        <p className="text-lg mb-8 text-gray-400">
          The Dev is fixing his mess right now (changing DNS servers for cloudflare, for the curious recruiters that might see this page). ⚙️
        </p>
        
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6 mb-8">
          <p className="text-base text-gray-300 italic">
            In the meantime, go watch some horror movies and come back to share them once FearLog is back from the dead again! 🎬👻
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
