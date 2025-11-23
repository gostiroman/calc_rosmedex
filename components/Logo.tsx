import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-4 select-none">
      {/* Visual recreation of the left block "ЦЭ КК МП" */}
      <div className="flex flex-col text-cek_blue leading-none text-4xl font-normal tracking-tighter" style={{ fontFamily: 'sans-serif' }}>
        <div className="flex justify-between w-16">
          <span>Ц</span>
          <span>Э</span>
        </div>
        <div className="flex justify-between w-16">
          <span>К</span>
          <span>К</span>
        </div>
        <div className="flex justify-between w-16">
          <span>М</span>
          <span>П</span>
        </div>
      </div>
      
      {/* Right text block */}
      <div className="flex flex-col text-cek_blue text-xs tracking-widest font-normal h-full justify-between py-1">
        <span className="uppercase block mb-1">Центр</span>
        <span className="uppercase block mb-1">экспертизы</span>
        <span className="uppercase block mb-1">и контроля</span>
        <span className="uppercase block mb-1">качества</span>
        <span className="uppercase block">медицинской<br/>помощи</span>
      </div>
    </div>
  );
};

export default Logo;