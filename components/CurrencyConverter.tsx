import React, { useState } from 'react';
import { convertCurrency, CurrencySource } from '../services/geminiService';

interface CurrencyConverterProps {
  onHistoryUpdate: (expression: string, result: string) => void;
}

const CURRENCIES = [
  { code: 'RUB', name: 'Российский рубль', flag: '🇷🇺' },
  { code: 'USD', name: 'Доллар США', flag: '🇺🇸' },
  { code: 'EUR', name: 'Евро', flag: '🇪🇺' },
  { code: 'CNY', name: 'Китайский юань', flag: '🇨🇳' },
  { code: 'GBP', name: 'Фунт стерлингов', flag: '🇬🇧' },
  { code: 'BYN', name: 'Белорусский рубль', flag: '🇧🇾' },
  { code: 'KZT', name: 'Казахстанский тенге', flag: '🇰🇿' },
  { code: 'TRY', name: 'Турецкая лира', flag: '🇹🇷' },
  { code: 'AED', name: 'Дирхам ОАЭ', flag: '🇦🇪' },
];

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ onHistoryUpdate }) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('RUB');
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<CurrencySource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setSources([]);
  };

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) {
      setError("Введите корректную сумму");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setSources([]);

    const data = await convertCurrency(amount, fromCurrency, toCurrency);

    if (data.error) {
      setError(data.error);
    } else {
      setResult(data.value);
      setSources(data.sources);
      onHistoryUpdate(`${amount} ${fromCurrency} -> ${toCurrency}`, data.value);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full p-6 bg-white rounded-lg">
      <h3 className="text-cek_blue font-medium mb-6 flex items-center gap-2">
        <span className="text-xl">💱</span> Конвертер валют
      </h3>

      <div className="flex flex-col gap-6">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Сумма</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 text-2xl font-light border border-gray-300 rounded-md focus:ring-2 focus:ring-cek_blue focus:border-transparent outline-none text-cek_dark"
            placeholder="0"
          />
        </div>

        {/* Currency Selectors */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Из</label>
            <div className="relative">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-cek_blue outline-none cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>
          </div>

          <button 
            onClick={handleSwap}
            className="w-10 h-10 mt-6 rounded-full bg-gray-100 hover:bg-cek_blue hover:text-white text-gray-500 transition-colors flex items-center justify-center shadow-sm"
            title="Поменять местами"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">В</label>
            <div className="relative">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-cek_blue outline-none cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConvert}
          disabled={isLoading || !amount}
          className={`w-full py-4 mt-2 rounded-md text-white font-medium text-lg transition-all ${
            isLoading || !amount
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-cek_blue hover:bg-sky-600 shadow-lg hover:shadow-xl active:scale-[0.99]'
          }`}
        >
          {isLoading ? 'Получение курса...' : 'Конвертировать'}
        </button>

        {/* Result Area */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-100 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-2 animate-fade-in">
            <div className="p-6 bg-cek_light border-l-4 border-cek_blue rounded-r-md">
              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Результат</span>
              <div className="text-3xl text-cek_dark font-light">{result}</div>
            </div>
            
            {sources.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Источники данных</p>
                <ul className="space-y-1">
                  {sources.map((source, index) => (
                    <li key={index} className="text-xs truncate">
                      <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cek_blue hover:underline flex items-center gap-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-cek_blue inline-block"></span>
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;