import React, { useState } from 'react';
import Logo from './components/Logo';
import StandardCalculator from './components/StandardCalculator';
import AICalculator from './components/AICalculator';
import CurrencyConverter from './components/CurrencyConverter';
import { CalculatorMode, HistoryItem } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<CalculatorMode>(CalculatorMode.STANDARD);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = (expression: string, result: string) => {
    setHistory(prev => [{ expression, result, timestamp: Date.now() }, ...prev].slice(0, 10));
  };

  const renderContent = () => {
    switch (mode) {
      case CalculatorMode.STANDARD:
        return <StandardCalculator onHistoryUpdate={addToHistory} />;
      case CalculatorMode.AI_MEDICAL:
        return <AICalculator onHistoryUpdate={addToHistory} />;
      case CalculatorMode.CURRENCY:
        return <CurrencyConverter onHistoryUpdate={addToHistory} />;
      default:
        return <StandardCalculator onHistoryUpdate={addToHistory} />;
    }
  };

  const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
        active 
          ? 'bg-white text-cek_blue shadow-sm' 
          : 'text-gray-500 hover:text-cek_blue'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#eef2f6] flex items-center justify-center p-4 font-sans">
      <main className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
        
        {/* Left Sidebar / History */}
        <aside className="w-full md:w-1/3 bg-white border-r border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-white">
            <Logo />
          </div>
          
          <div className="flex-grow flex flex-col p-4 bg-[#fcfcfd]">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">История операций</h2>
            {history.length === 0 ? (
              <div className="flex-grow flex items-center justify-center text-gray-300 text-sm italic">
                Нет записей
              </div>
            ) : (
              <ul className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {history.map((item) => (
                  <li key={item.timestamp} className="bg-white p-3 rounded border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-xs text-gray-400 mb-1 truncate" title={item.expression}>{item.expression}</div>
                    <div className="text-lg font-medium text-cek_blue text-right">{item.result}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex rounded-lg bg-gray-100 p-1 gap-1 overflow-x-auto">
              <TabButton 
                active={mode === CalculatorMode.STANDARD} 
                onClick={() => setMode(CalculatorMode.STANDARD)} 
                label="Обычный" 
              />
              <TabButton 
                active={mode === CalculatorMode.AI_MEDICAL} 
                onClick={() => setMode(CalculatorMode.AI_MEDICAL)} 
                label="AI Эксперт" 
              />
              <TabButton 
                active={mode === CalculatorMode.CURRENCY} 
                onClick={() => setMode(CalculatorMode.CURRENCY)} 
                label="Валюты" 
              />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="w-full md:w-2/3 bg-white flex flex-col relative">
          {/* Header Decoration */}
          <div className="h-2 bg-cek_blue w-full absolute top-0 left-0"></div>
          
          <div className="flex-grow h-full pt-2">
            {renderContent()}
          </div>
        </section>
      </main>

      {/* Footer / Copyright */}
      <footer className="fixed bottom-4 text-center w-full text-xs text-gray-400 pointer-events-none hidden md:block">
        &copy; {new Date().getFullYear()} ЦЭККМП. Все права защищены.
      </footer>
    </div>
  );
};

export default App;