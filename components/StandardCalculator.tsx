import React, { useState, useCallback, useEffect } from 'react';

interface StandardCalculatorProps {
  onHistoryUpdate: (expression: string, result: string) => void;
}

const StandardCalculator: React.FC<StandardCalculatorProps> = ({ onHistoryUpdate }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = useCallback((num: string) => {
    setDisplay(prev => {
      if (isNewNumber || prev === '0') {
        return num;
      }
      return prev + num;
    });
    setIsNewNumber(false);
  }, [isNewNumber]);

  const handleOperator = useCallback((op: string) => {
    setEquation(`${display} ${op} `);
    setIsNewNumber(true);
  }, [display]);

  const calculate = useCallback(() => {
    if (!equation) return;
    try {
      // Note: Using Function constructor is safer than eval, but still requires care.
      // For a simple calculator without user typed strings, this is acceptable.
      const fullEquation = equation + display;
      // eslint-disable-next-line no-new-func
      const result = new Function('return ' + fullEquation.replace('×', '*').replace('÷', '/'))();
      
      const formattedResult = String(Math.round(result * 100000000) / 100000000);
      setDisplay(formattedResult);
      setEquation('');
      setIsNewNumber(true);
      onHistoryUpdate(fullEquation, formattedResult);
    } catch (e) {
      setDisplay('Ошибка');
      setIsNewNumber(true);
    }
  }, [display, equation, onHistoryUpdate]);

  const clear = useCallback(() => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  }, []);

  const handlePercent = useCallback(() => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
    setIsNewNumber(true);
  }, [display]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
      if (e.key === '.') handleNumber('.');
      if (e.key === 'Enter') calculate();
      if (e.key === 'Escape') clear();
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('*');
      if (e.key === '/') handleOperator('/');
      if (e.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, calculate, clear, handleOperator]);

  const Btn = ({ label, onClick, className = "" }: { label: string, onClick: () => void, className?: string }) => (
    <button
      onClick={onClick}
      className={`h-16 text-xl font-medium transition-colors duration-200 active:scale-95 ${className}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Display Screen */}
      <div className="bg-cek_light p-6 rounded-t-lg text-right border-b border-gray-200">
        <div className="text-gray-400 text-sm h-6 font-mono">{equation}</div>
        <div className="text-4xl text-cek_dark font-light truncate">{display}</div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-[1px] bg-gray-200 p-[1px] flex-grow">
        <Btn label="C" onClick={clear} className="bg-white text-cek_blue hover:bg-gray-50" />
        <Btn label="+/-" onClick={() => setDisplay(String(parseFloat(display) * -1))} className="bg-white text-cek_blue hover:bg-gray-50" />
        <Btn label="%" onClick={handlePercent} className="bg-white text-cek_blue hover:bg-gray-50" />
        <Btn label="÷" onClick={() => handleOperator('/')} className="bg-cek_blue text-white hover:bg-sky-600" />

        <Btn label="7" onClick={() => handleNumber('7')} className="bg-white hover:bg-gray-50" />
        <Btn label="8" onClick={() => handleNumber('8')} className="bg-white hover:bg-gray-50" />
        <Btn label="9" onClick={() => handleNumber('9')} className="bg-white hover:bg-gray-50" />
        <Btn label="×" onClick={() => handleOperator('*')} className="bg-cek_blue text-white hover:bg-sky-600" />

        <Btn label="4" onClick={() => handleNumber('4')} className="bg-white hover:bg-gray-50" />
        <Btn label="5" onClick={() => handleNumber('5')} className="bg-white hover:bg-gray-50" />
        <Btn label="6" onClick={() => handleNumber('6')} className="bg-white hover:bg-gray-50" />
        <Btn label="-" onClick={() => handleOperator('-')} className="bg-cek_blue text-white hover:bg-sky-600" />

        <Btn label="1" onClick={() => handleNumber('1')} className="bg-white hover:bg-gray-50" />
        <Btn label="2" onClick={() => handleNumber('2')} className="bg-white hover:bg-gray-50" />
        <Btn label="3" onClick={() => handleNumber('3')} className="bg-white hover:bg-gray-50" />
        <Btn label="+" onClick={() => handleOperator('+')} className="bg-cek_blue text-white hover:bg-sky-600" />

        <Btn label="0" onClick={() => handleNumber('0')} className="col-span-2 bg-white hover:bg-gray-50" />
        <Btn label="." onClick={() => handleNumber('.')} className="bg-white hover:bg-gray-50" />
        <Btn label="=" onClick={calculate} className="bg-cek_blue text-white hover:bg-sky-600" />
      </div>
    </div>
  );
};

export default StandardCalculator;