'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  X, 
  CheckCircle2, 
  Lightbulb, 
  Info, 
  ArrowLeftRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processScannerImage } from './actions';
import Link from 'next/link';

export default function ScannerPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      handleScan(imageSrc);
    }
  }, [webcamRef]);

  const handleScan = async (image: string) => {
    setIsScanning(true);
    setError(null);
    try {
      const result = await processScannerImage(image);
      if (result.error) {
        setError(result.error);
      } else {
        setAnalysis(result.analysis);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image';
      setError(errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="flex-1 bg-black flex overflow-hidden relative">
      {/* Main Camera Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center">
        {!capturedImage ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              videoConstraints={{ facingMode: 'environment' }}
            />
            {/* Viewfinder Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-10">
              <div className="w-full max-w-md aspect-square relative border-4 border-white/20 rounded-3xl">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-3xl -m-1" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-3xl -m-1" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-3xl -m-1" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-3xl -m-1" />
              </div>
            </div>
          </>
        ) : (
          <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover" alt="Captured" />
        )}

        {/* UI Controls Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
          <header className="flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent p-4 -m-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0">
                <X className="w-6 h-6" />
              </Button>
            </Link>
            <span className="text-white font-bold tracking-tight">AI Food Scanner</span>
            <div className="w-10" />
          </header>

          <div className="flex flex-col items-center gap-6 mb-8">
            {!capturedImage ? (
              <>
                <p className="text-white text-sm bg-black/40 backdrop-blur-md px-6 py-2 rounded-full shadow-lg">
                  Position your food in the frame and click Scan
                </p>
                <button 
                  onClick={capture}
                  className="bg-[#ff6e49] text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Camera className="w-8 h-8" />
                </button>
                <button className="text-white text-sm underline decoration-white/40 hover:decoration-white transition-all">
                  Upload image instead
                </button>
              </>
            ) : isScanning ? (
              <div className="flex flex-col items-center gap-4 bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                <Loader2 className="w-12 h-12 text-[#ff6e49] animate-spin" />
                <p className="text-white font-medium">Analyzing your meal...</p>
                <p className="text-xs text-gray-400">Gemini AI is calculating nutrients</p>
              </div>
            ) : error ? (
              <div className="bg-red-500/90 backdrop-blur-md p-6 rounded-2xl text-white flex flex-col items-center gap-4 max-w-xs text-center">
                <p className="text-sm font-medium">{error}</p>
                <Button onClick={reset} variant="secondary" className="w-full">Try Again</Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Result Panel */}
      <AnimatePresence>
        {analysis && !isScanning && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-30 flex flex-col overflow-y-auto"
          >
            <div className="p-8 flex-1 flex flex-col gap-8">
              <header className="flex justify-between items-start border-b border-[#e0e3de] pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{analysis.food_name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Portion: {analysis.portion}</p>
                </div>
                <button onClick={reset} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </header>

              {/* Health Score */}
              <div className="flex items-center gap-6 bg-[#f7faf5] p-6 rounded-2xl border border-[#e0e3de]">
                <div className="w-16 h-16 rounded-full bg-[#ff6e49]/10 border-2 border-[#ff6e49] flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-[#ff6e49]">
                    {analysis.score >= 8 ? 'A' : analysis.score >= 6 ? 'B' : 'C'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">Health Score: {analysis.score}/10</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{analysis.tip}</p>
                </div>
              </div>

              {/* Macros Grid */}
              <div className="grid grid-cols-4 gap-3">
                <MacroCard label="CAL" value={analysis.macros.calories} />
                <MacroCard label="PRO" value={`${analysis.macros.protein}g`} />
                <MacroCard label="CARB" value={`${analysis.macros.carbs}g`} />
                <MacroCard label="FAT" value={`${analysis.macros.fat}g`} color="text-[#ff6e49]" />
              </div>

              {/* Smart Swap */}
              <div className="bg-[#f1f5ef] border-l-4 border-[#1e6b47] rounded-r-2xl border border-y-[#e0e3de] border-r-[#e0e3de] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-[#1e6b47]" />
                  <span className="text-[10px] font-bold text-[#1e6b47] uppercase tracking-wider">AI Tip</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Suggested Adjustment</h4>
                <p className="text-xs text-gray-600 mt-1">Consider reducing the portion of grains to lower carb intake.</p>
              </div>
            </div>

            <footer className="p-8 bg-white border-t border-[#e0e3de] space-y-3">
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-[#1e6b47] hover:bg-[#005232] text-white py-6 rounded-xl flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Log this meal
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="rounded-xl py-6 border-[#e0e3de] text-gray-700">
                  <Info className="w-4 h-4 mr-2" />
                  Details
                </Button>
                <Button variant="outline" className="rounded-xl py-6 border-[#e0e3de] text-gray-700">
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Swap
                </Button>
              </div>
            </footer>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function MacroCard({ label, value, color = 'text-gray-900' }: { label: string, value: string | number, color?: string }) {
  return (
    <div className="bg-white border border-[#e0e3de] rounded-xl p-3 text-center shadow-sm">
      <span className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}
