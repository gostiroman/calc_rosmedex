import React, { useState } from 'react';
import { calculateWithAI } from '../services/geminiService';

interface AICalculatorProps {
  onHistoryUpdate: (expression: string, result: string) => void;
}

const AICalculator: React.FC<AICalculatorProps> = ({ onHistoryUpdate }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSolve = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResult(null);

    const aiResponse = await calculateWithAI(input);
    
    setResult(aiResponse);
    onHistoryUpdate(input, aiResponse);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full p-6 bg-white rounded-lg">
      <h3 className="text-cek_blue font-medium mb-4">Интеллектуальный помощник</h3>
      <p className="text-sm text-gray-500 mb-4">
        Введите сложную формулу, медицинский расчет (например, ИМТ) или вопрос на естественном языке.
      </p>
      
      <textarea
        className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-cek_blue focus:border-transparent resize-none outline-none mb-4 text-gray-700"
        rows={4}
        placeholder="Пример: Рассчитать ИМТ вес 75кг рост 180см..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSolve}
        disabled={isLoading || !input.trim()}
        className={`w-full py-3 rounded-md text-white font-medium transition-all ${
          isLoading || !input.trim() 
          ? 'bg-gray-300 cursor-not-allowed' 
          : 'bg-cek_blue hover:bg-sky-600 shadow-md active:scale-[0.99]'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Вычисление...
          </span>
        ) : 'Рассчитать'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-cek_light border-l-4 border-cek_blue rounded-r-md animate-fade-in">
          <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Результат</span>
          <p className="text-cek_dark text-lg whitespace-pre-wrap leading-relaxed">
            {result}
          </p>
        </div>
      )}
    </div>
  );
};

export default AICalculator;