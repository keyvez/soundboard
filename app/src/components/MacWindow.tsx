interface MacWindowProps {
  title: string;
  children: React.ReactNode;
}

export function MacWindow({ title, children }: MacWindowProps) {
  return (
    <div className="inline-block bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Title Bar */}
      <div className="bg-white border-b-2 border-black flex items-center px-1 py-1">
        {/* Close button */}
        <div className="w-4 h-4 border border-black flex items-center justify-center mr-1 bg-white">
          <div className="w-2 h-2 border border-black bg-white"></div>
        </div>
        
        {/* Title bar stripes */}
        <div className="flex-1 flex items-center justify-center gap-[2px] px-2">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-[2px] h-3 bg-black"></div>
          ))}
        </div>
      </div>
      
      {/* Window title */}
      <div className="text-center py-1 border-b-2 border-black bg-white">
        <span className="font-mono">{title}</span>
      </div>
      
      {/* Content */}
      <div className="p-4 bg-[#c0c0c0]">
        {children}
      </div>
    </div>
  );
}
