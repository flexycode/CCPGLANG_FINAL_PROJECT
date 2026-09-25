export default function SidePanel() {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-[linear-gradient(180deg,#E6D0C1_0%,#FFFAF6_34.13%,#EEE9E4_100%)] relative flex flex-col justify-center p-10 overflow-hidden max-md:px-6 max-md:py-[60px] max-md:items-center min-h-[250px]">
      <div className="flex items-center gap-4 z-10">

        {/* replace add logo here */}
        <div className="w-[50px] h-[50px] bg-[#A39E93] rounded-xl shrink-0 flex items-center justify-center text-white font-bold font-serif text-2xl shadow-sm">
          C
        </div>
        <div className="flex flex-col">
          <h2 className="text-[28px] font-bold font-serif m-0 text-[#1F2328] leading-[1.1]">Checkmate</h2>
          <p className="text-[10px] font-bold m-0 text-gray-500 tracking-[1.5px] uppercase mt-1">ATTENDANCE MONITORING</p>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute border border-black/5 rounded-full pointer-events-none" style={{ bottom: '-10%', left: '-10%', width: '300px', height: '300px' }}></div>
      <div className="absolute border border-black/5 rounded-full pointer-events-none" style={{ bottom: '10%', left: '10%', width: '400px', height: '400px' }}></div>
      <div className="absolute border border-black/5 rounded-full pointer-events-none" style={{ bottom: '-20%', left: '30%', width: '500px', height: '500px' }}></div>

      <div className="absolute bottom-6 left-10 text-xs text-gray-500 z-10 max-md:relative max-md:bottom-auto max-md:left-auto max-md:mt-10">
        &copy; 2026 Checkmate - Attendance Monitoring
      </div>
    </div>
  );
}
