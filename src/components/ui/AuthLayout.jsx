import React from 'react';
import { Layers, Globe } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { LANGUAGES } from '../../config/constants';

export const AuthLayout = ({ children, t, theme, isDarkMode, lang, setLang }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${isDarkMode ? 'bg-[#121214] text-white' : 'bg-[#F3F4F6] text-slate-900'}`}>
      <div className={`w-full max-w-5xl h-[650px] flex rounded-[2.5rem] overflow-hidden shadow-2xl relative ${isDarkMode ? 'bg-[#1E1E24]' : 'bg-white'}`}>
        
        <div className="absolute top-6 right-6 md:top-12 md:right-12 z-20 w-48">
           <CustomSelect 
              value={lang} 
              onChange={setLang} 
              options={LANGUAGES} 
              icon={Globe} 
           />
        </div>

        <div className={`hidden md:flex w-5/12 ${theme.bg} p-12 flex-col justify-between text-white relative h-full`}>
          <div className="absolute top-0 right-0 p-40 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 p-40 bg-black opacity-10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 mt-10">
            <div className="w-20 h-20 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-xl border border-white/10">
                <Layers size={40} />
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tighter leading-tight">{t.appName}</h1>
            <p className="opacity-90 font-medium text-lg leading-relaxed">{t.syncSlogan}</p> 
          </div>
          
          <div className="relative z-10 opacity-60"></div>
        </div>

        <div className="w-full md:w-7/12 h-full flex flex-col justify-center px-6 md:px-20 py-10 overflow-y-auto no-scrollbar relative">
          <div className="md:hidden flex items-center gap-3 mb-10 mt-10">
              <div className={`w-12 h-12 rounded-xl ${theme.bg} flex items-center justify-center text-white`}>
                  <Layers size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">{t.appName}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};