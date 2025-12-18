import { Play, BarChart3 } from 'lucide-react';
import logo from 'figma:asset/9392034b3e352e43abdb15718e6b1405d2af7287.png';

interface QuizStartProps {
  onStart: () => void;
  onShowHistory: () => void;
}

export function QuizStart({ onStart, onShowHistory }: QuizStartProps) {
  return (
    <div className="h-full flex flex-col justify-between" style={{ padding: 'clamp(1rem, 3vh, 2rem) clamp(1rem, 4vw, 2rem)' }}>
      <div className="flex-shrink-0">
        <div className="text-center" style={{ marginBottom: 'clamp(1rem, 3vh, 2rem)' }}>
          <div className="flex flex-col items-center" style={{ marginBottom: 'clamp(0.75rem, 2vh, 1.5rem)' }}>
            <img 
              src={logo}
              alt="Uniwersytety WSB Merito Logo" 
              style={{ width: 'clamp(10rem, 40vw, 15rem)', height: 'auto', marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)' }}
            />
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" style={{ width: 'clamp(8rem, 30vw, 12rem)', height: 'clamp(0.2rem, 0.5vh, 0.3rem)' }}></div>
          </div>
          
          <h1 className="text-gray-900 mb-2" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>
            Quiz UWSB Merito
          </h1>
          
          <p className="text-gray-600 px-4" style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>
            Sprawdź swoją wiedzę o uczelni UWSB Merito w Gdańsku!
          </p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center overflow-y-auto hide-scrollbar">
        <div className="bg-white rounded-2xl shadow-xl" style={{ padding: 'clamp(0.75rem, 2vh, 1.5rem)', marginBottom: 'clamp(0.75rem, 2vh, 1.5rem)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
            <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl" style={{ gap: 'clamp(0.5rem, 2vw, 1rem)', padding: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
              <div className="bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 'clamp(2rem, 8vw, 3rem)', height: 'clamp(2rem, 8vw, 3rem)' }}>
                <span className="text-white" style={{ fontSize: 'clamp(0.8rem, 3vw, 1.1rem)' }}>10</span>
              </div>
              <div className="flex-1">
                <div className="text-gray-900" style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>Pytań w quizie</div>
                <div className="text-gray-500" style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)' }}>Wiedza o uczelni</div>
              </div>
            </div>
            
            <div className="flex items-center bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl" style={{ gap: 'clamp(0.5rem, 2vw, 1rem)', padding: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
              <div className="bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 'clamp(2rem, 8vw, 3rem)', height: 'clamp(2rem, 8vw, 3rem)' }}>
                <span className="text-white" style={{ fontSize: 'clamp(0.8rem, 3vw, 1.1rem)' }}>~5</span>
              </div>
              <div className="flex-1">
                <div className="text-gray-900" style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>Minut</div>
                <div className="text-gray-500" style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)' }}>Szybki quiz</div>
              </div>
            </div>
            
            <div className="flex items-center bg-gradient-to-r from-green-50 to-green-100 rounded-xl" style={{ gap: 'clamp(0.5rem, 2vw, 1rem)', padding: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
              <div className="bg-green-600 rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 'clamp(2rem, 8vw, 3rem)', height: 'clamp(2rem, 8vw, 3rem)' }}>
                <span className="text-white" style={{ fontSize: 'clamp(0.8rem, 3vw, 1.1rem)' }}>1-4</span>
              </div>
              <div className="flex-1">
                <div className="text-gray-900" style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>Poprawne odpowiedzi do wyboru</div>
                <div className="text-gray-500" style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)' }}>Możliwość wielokrotnego wyboru</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          style={{ padding: 'clamp(0.75rem, 2vh, 1.25rem) 0', fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)' }}
        >
          <Play style={{ width: 'clamp(1rem, 4vw, 1.5rem)', height: 'clamp(1rem, 4vw, 1.5rem)' }} />
          <span>Rozpocznij Quiz</span>
        </button>
        
        <button
          onClick={onShowHistory}
          className="w-full bg-white text-gray-700 rounded-2xl hover:bg-gray-50 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 border-2 border-gray-200"
          style={{ padding: 'clamp(0.75rem, 2vh, 1.25rem) 0', fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)' }}
        >
          <BarChart3 style={{ width: 'clamp(1rem, 4vw, 1.5rem)', height: 'clamp(1rem, 4vw, 1.5rem)' }} />
          <span>Historia Gier</span>
        </button>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
    </div>
  );
}