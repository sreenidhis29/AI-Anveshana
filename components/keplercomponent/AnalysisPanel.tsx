"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Globe, Sun, Thermometer, Zap, Orbit, Satellite, AlertCircle, Sparkles, Upload, Table, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanetData } from './KeplerVisualizer';
import { ResultDialog } from '@/components/ui/result-dialog';
import { toast } from 'sonner';

interface AnalysisPanelProps {
  planet: PlanetData;
  onClose: () => void;
  onUpdate: (data: Partial<PlanetData>) => void;
}


interface ParameterConfig {
  key: keyof PlanetData;
  label: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
}

const parameters: ParameterConfig[] = [
  {
    key: 'koi_period',
    label: 'Orbital Period',
    icon: <Orbit className="h-4 w-4" />,
    min: 0.5,
    max: 100,
    step: 0.1,
    unit: 'days',
    description: 'Orbital Period. Kepler is optimized for longer periods.'
  },
  {
    key: 'koi_duration',
    label: 'Transit Duration',
    icon: <Activity className="h-4 w-4" />,
    min: 0.5,
    max: 12,
    step: 0.1,
    unit: 'hours',
    description: 'Transit Duration in hours'
  },
  {
    key: 'koi_depth',
    label: 'Transit Depth',
    icon: <Zap className="h-4 w-4" />,
    min: 0.00001,
    max: 0.5,
    step: 0.00001,
    unit: 'fraction',
    description: 'Transit Depth as fraction or ppm'
  },
  {
    key: 'koi_prad',
    label: 'Planet Radius',
    icon: <Globe className="h-4 w-4" />,
    min: 0.5,
    max: 20.0,
    step: 0.1,
    unit: 'R⊕',
    description: 'Planet Radius in Earth radii'
  },
  {
    key: 'koi_insol',
    label: 'Incident Stellar Flux',
    icon: <Sun className="h-4 w-4" />,
    min: 0.1,
    max: 100000,
    step: 0.1,
    unit: 'S⊕',
    description: 'Incident Stellar Flux received by planet'
  },
  {
    key: 'koi_teq',
    label: 'Equilibrium Temperature',
    icon: <Thermometer className="h-4 w-4" />,
    min: 100,
    max: 3000,
    step: 1,
    unit: 'K',
    description: 'Planet Equilibrium Temperature'
  },
  {
    key: 'koi_steff',
    label: 'Stellar Temperature',
    icon: <Thermometer className="h-4 w-4" />,
    min: 3000,
    max: 7000,
    step: 10,
    unit: 'K',
    description: 'Star\'s Effective Temperature'
  },
  {
    key: 'koi_slogg',
    label: 'Stellar Surface Gravity',
    icon: <Activity className="h-4 w-4" />,
    min: 3.0,
    max: 5.0,
    step: 0.01,
    unit: 'log₁₀(cm/s²)',
    description: 'Star\'s Surface Gravity (logarithmic)'
  },
  {
    key: 'koi_srad',
    label: 'Stellar Radius',
    icon: <Sun className="h-4 w-4" />,
    min: 0.3,
    max: 10.0,
    step: 0.01,
    unit: 'R☉',
    description: 'Star\'s Radius in Solar radii'
  },
  {
    key: 'koi_score',
    label: 'KOI Score',
    icon: <Satellite className="h-4 w-4" />,
    min: 0.0,
    max: 1.0,
    step: 0.01,
    unit: 'score',
    description: 'TESS Magnitude (brightness in TESS bandpass)'
  },
  {
    key: 'koi_impact',
    label: 'Impact Parameter',
    icon: <Satellite className="h-4 w-4" />,
    min: 0,
    max: 1,
    step: 0.01,
    unit: 'b',
    description: 'Impact parameter (0 = central transit, 1 = grazing)'
  },
  {
    key: 'koi_time0bk',
    label: 'Transit Epoch',
    icon: <Activity className="h-4 w-4" />,
    min: 0,
    max: 1000,
    step: 0.1,
    unit: 'days',
    description: 'Time of first transit (BJD - 2454833)'
  },
  {
    key: 'koi_model_snr',
    label: 'Model SNR',
    icon: <Zap className="h-4 w-4" />,
    min: 0,
    max: 100,
    step: 0.1,
    unit: 'SNR',
    description: 'Signal-to-noise ratio of the transit model'
  },
  {
    key: 'koi_srho',
    label: 'Stellar Density',
    icon: <Sun className="h-4 w-4" />,
    min: 0.1,
    max: 100,
    step: 0.1,
    unit: 'g/cm³',
    description: 'Stellar density from transit fit'
  },
];

export default function AnalysisPanel({ planet, onClose, onUpdate }: AnalysisPanelProps) {
  const [formData, setFormData] = useState(() => ({
    ...planet,
    // Ensure all numeric values are defined with random values if undefined
    koi_period: planet.koi_period ?? Math.random() * 50 + 1,
    koi_duration: planet.koi_duration ?? Math.random() * 8 + 1,
    koi_depth: planet.koi_depth ?? Math.random() * 0.01 + 0.0001,
    koi_prad: planet.koi_prad ?? Math.random() * 3 + 0.5,
    koi_insol: planet.koi_insol ?? Math.random() * 1000 + 0.1,
    koi_teq: planet.koi_teq ?? Math.random() * 1000 + 200,
    koi_steff: planet.koi_steff ?? Math.random() * 2000 + 4000,
    koi_slogg: planet.koi_slogg ?? Math.random() * 1.5 + 3.5,
    koi_srad: planet.koi_srad ?? Math.random() * 2 + 0.5,
    koi_score: planet.koi_score ?? Math.random() * 0.5 + 0.5,
    koi_impact: planet.koi_impact ?? Math.random() * 0.5 + 0.25,
    koi_time0bk: planet.koi_time0bk ?? Math.random() * 100 + 10,
    koi_model_snr: planet.koi_model_snr ?? Math.random() * 50 + 5,
    koi_srho: planet.koi_srho ?? Math.random() * 10 + 1,
  }));
  const [showResultDialog, setShowResultDialog] = useState(false);
  
  // CSV Upload States
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [selectedCsvRow, setSelectedCsvRow] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setFormData(planet);
  }, [planet]);


  const handleInputChange = (key: keyof PlanetData, value: number) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    onUpdate({ [key]: value });
  };

  const getTessDispositionName = (disposition: string) => {
    switch (disposition) {
      case 'PC': return 'PC (Planetary Candidate)';
      case 'CP': return 'CP (Confirmed Planet)';
      case 'FP': return 'FP (False Positive)';
      case 'APC': return 'APC (Ambiguous Planetary Candidate)';
      case 'KP': return 'KP (Known Planet)';
      default: return disposition;
    }
  };

  const handleAnalyze = async () => {
    try {
      onUpdate({ isAnalyzing: true });

      const payload = {
        koi_period: formData.koi_period,
        koi_duration: formData.koi_duration,
        koi_depth: formData.koi_depth,
        koi_prad: formData.koi_prad,
        koi_insol: formData.koi_insol,
        koi_teq: formData.koi_teq,
        koi_steff: formData.koi_steff,
        koi_slogg: formData.koi_slogg,
        koi_srad: formData.koi_srad,
        koi_score: formData.koi_score,
        koi_impact: formData.koi_impact,
        koi_time0bk: formData.koi_time0bk,
        koi_model_snr: formData.koi_model_snr,
        koi_srho: formData.koi_srho,
      };

      const response = await fetch('/api/predict-keppler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      let prediction: 'confirmed' | 'false-positive' | 'candidate';
      if (result.disposition === 'CP' || result.disposition === 'KP') {
        prediction = 'confirmed';
      } else if (result.disposition === 'FP') {
        prediction = 'false-positive';
      } else {
      
        prediction = 'candidate';
      }

     
      onUpdate({ 
        isAnalyzing: false, 
        prediction: prediction,
        geminiResponse: {
          disposition: result.disposition,
          confidence: result.confidence,
          reasoning: result.reasoning,
          is_exoplanet: result.is_exoplanet,
          planet_type: result.planet_type
        }
      });

      // Show success toast
      toast.success('Gemini  AI Analysis Complete!', {
        description: `Classification: ${getTessDispositionName(result.disposition)}`,
        duration: 5000,
      });

      // Show result dialog
      setShowResultDialog(true);

    } catch (error) {
      console.error('Analysis failed:', error);
      onUpdate({ isAnalyzing: false });
      
      const errorMessage = error instanceof Error ? error.message : 'TESS analysis failed. Please check your AWS credentials and try again.';
      
      // Show error toast
      if (errorMessage.includes('credential') || errorMessage.includes('auth')) {
        toast.error('Authentication Error', {
          description: 'Please configure your AWS credentials and try again.',
          duration: 6000,
        });
      } else {
        toast.error('Gemini  AI Analysis Failed', {
          description: errorMessage,
          duration: 5000,
        });
      }
    }
  };


  const handleGeminiAnalyzeClick = () => {
    // Validation: If on CSV tab, must have a row selected
    if (activeTab === 'csv' && selectedCsvRow === null) {
      toast.error('No CSV Row Selected', {
        description: 'Please select a row from the CSV table before analyzing.',
        duration: 4000,
      });
      return;
    }
    
    // Validation: If on CSV tab with selected row, ensure all parameters are present
    if (activeTab === 'csv' && selectedCsvRow !== null) {
      const row = csvData[selectedCsvRow];
      const paramCheck = checkCsvParameters(row);
      if (paramCheck.found !== paramCheck.total) {
        toast.error('Incomplete Parameters', {
          description: `Selected row is missing ${paramCheck.total - paramCheck.found} parameter(s). Cannot proceed with analysis.`,
          duration: 5000,
        });
        return;
      }
    }
    
    // Proceed directly with Gemini analysis
    handleAnalyze();
  };


  const handleFlaskAnalyze = async () => {
    // Validation: If on CSV tab, must have a row selected
    if (activeTab === 'csv' && selectedCsvRow === null) {
      toast.error('No CSV Row Selected', {
        description: 'Please select a row from the CSV table before analyzing.',
        duration: 4000,
      });
      return;
    }
    
    // Validation: If on CSV tab with selected row, ensure all parameters are present
    if (activeTab === 'csv' && selectedCsvRow !== null) {
      const row = csvData[selectedCsvRow];
      const paramCheck = checkCsvParameters(row);
      if (paramCheck.found !== paramCheck.total) {
        toast.error('Incomplete Parameters', {
          description: `Selected row is missing ${paramCheck.total - paramCheck.found} parameter(s). Cannot proceed with analysis.`,
          duration: 5000,
        });
        return;
      }
    }
    
    try {
     
      onUpdate({ isAnalyzing: true });

      const payload = {
        features: {
          koi_period: formData.koi_period,
          koi_duration: formData.koi_duration,
          koi_depth: formData.koi_depth,
          koi_prad: formData.koi_prad,
          koi_insol: formData.koi_insol,
          koi_teq: formData.koi_teq,
          koi_steff: formData.koi_steff,
          koi_slogg: formData.koi_slogg,
          koi_srad: formData.koi_srad,
          koi_score: formData.koi_score,
          koi_impact: formData.koi_impact,
          koi_time0bk: formData.koi_time0bk,
          koi_model_snr: formData.koi_model_snr,
          koi_srho: formData.koi_srho,
        }
      };

      const response = await fetch('https://ml-backend-1zgp.onrender.com/predict/tess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'QzQBpd3vd1K4fBeRdPMBvH4rwphF7Nns4Y-T1cfj9PY'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Flask API Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Flask API Response:', result);
      
    
      let prediction: 'confirmed' | 'false-positive' | 'candidate';
      
      // Determine prediction based on tfopwg_disp
      // CP (Confirmed Planet), KP (Known Planet) -> confirmed
      // FP (False Positive), FA (False Alarm) -> false-positive
      // PC (Planetary Candidate), APC (Ambiguous Planetary Candidate) -> candidate
      if (result.tfopwg_disp === 'CP' || result.tfopwg_disp === 'KP') {
        prediction = 'confirmed';
      } else if (result.tfopwg_disp === 'FP' || result.tfopwg_disp === 'FA') {
        prediction = 'false-positive';
      } else {
        // PC, APC, or other
        prediction = 'candidate';
      }

   
      onUpdate({ 
        isAnalyzing: false, 
        prediction: prediction,
        flaskResponse: {
          is_exoplanet: result.is_exoplanet,
          koi_pdisposition: result.koi_pdisposition,
          probability: result.probability,
          status: 'success',
          timestamp: new Date().toISOString()
        }
      });

      // Show success toast
      toast.success('ML Model Analysis Complete!', {
        description: `Classification: ${result.koi_pdisposition}`,
        duration: 5000,
      });

      // Show result dialog
      setShowResultDialog(true);

    } catch (error) {
      console.error('Flask analysis failed:', error);
      onUpdate({ isAnalyzing: false });
      
      const errorMessage = error instanceof Error ? error.message : 'Connection failed. Make sure Flask server is running on http://127.0.0.1:5000';
      
      // Show error toast
      toast.error('Flask API Error', {
        description: errorMessage,
        duration: 6000,
      });
    }
  };

  // CSV Upload Handler
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      toast.error('Empty CSV file');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      return row;
    });

    setCsvHeaders(headers);
    setCsvData(rows);
    setActiveTab('csv');
    toast.success(`CSV loaded: ${rows.length} rows found`);
  };

  const handleSelectCsvRow = (index: number) => {
    const row = csvData[index];
    const paramCheck = checkCsvParameters(row);
    
    // Validate that ALL parameters are present
    if (paramCheck.found !== paramCheck.total) {
      toast.error('Incomplete Parameters', {
        description: `This row is missing ${paramCheck.total - paramCheck.found} required parameter(s). Please select a row with all ${paramCheck.total} parameters.`,
        duration: 5000,
      });
      return;
    }
    
    setSelectedCsvRow(index);
    
    // Map CSV data to form data
    const mappedData: Record<string, number> = {};
    parameters.forEach(param => {
      const value = parseFloat(row[param.key] || row[param.label] || '0');
      if (!isNaN(value)) {
        mappedData[param.key] = value;
      }
    });

    // Update form data
    setFormData(prev => ({ ...prev, ...mappedData }));
    onUpdate(mappedData);
    
    toast.success(`Row ${index + 1} Selected`, {
      description: `All ${paramCheck.total} parameters loaded successfully!`,
      duration: 3000,
    });
  };

  const getRequiredParameters = () => {
    return parameters.map(p => p.key);
  };

  const checkCsvParameters = (row: Record<string, string>) => {
    const required = getRequiredParameters();
    const found = required.filter(key => 
      row[key] !== undefined || row[parameters.find(p => p.key === key)?.label || ''] !== undefined
    );
    return { found: found.length, total: required.length };
  };

  // Drag and Drop Handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          parseCSV(text);
        };
        reader.readAsText(file);
      } else {
        toast.error('Invalid file type', {
          description: 'Please upload a CSV file',
          duration: 3000,
        });
      }
    }
  };

  const getPredictionBadge = () => {
    if (planet.isAnalyzing) {
      return (
        <Badge variant="outline" className="border-red-400/50 text-red-400 bg-red-400/10 animate-pulse">
          🔄 Analyzing...
        </Badge>
      );
    }

    if (planet.prediction === 'confirmed') {
      return (
        <Badge variant="outline" className="border-green-400/50 text-green-400 bg-green-400/10">
          ✅ Confirmed Exoplanet
        </Badge>
      );
    }

    if (planet.prediction === 'false-positive') {
      return (
        <Badge variant="outline" className="border-red-400/50 text-red-400 bg-red-400/10">
          ❌ False Positive
        </Badge>
      );
    }

    if (planet.prediction === 'candidate') {
      return (
        <Badge variant="outline" className="border-yellow-400/50 text-yellow-400 bg-yellow-400/10">
          🟡 Planet Candidate
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-gray-400/50 text-gray-400 bg-gray-400/10">
        🔍 Ready for Analysis
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      className="fixed right-0 top-0 h-full w-96 z-50 bg-black/40 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl"
    >
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
        <Card className="h-full bg-transparent border-0 rounded-none">
          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg border border-red-400/30">
                  <Satellite className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white font-bold">
                    {planet.id}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    TESS Exoplanet Analysis Panel
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800/60 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              {getPredictionBadge()}
              
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tabs for Manual / CSV Mode */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'manual' | 'csv')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50">
                <TabsTrigger value="manual" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/90 data-[state=active]:to-rose-600/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/20 transition-all duration-300">
                  <Activity className="h-4 w-4 mr-2" />
                  Manual Input
                </TabsTrigger>
                <TabsTrigger value="csv" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/90 data-[state=active]:to-rose-600/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/20 transition-all duration-300">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  CSV Upload
                </TabsTrigger>
              </TabsList>

              {/* Manual Input Tab */}
              <TabsContent value="manual" className="space-y-4 mt-4">
            {/* Parameters Grid */}
            <div className="space-y-4">
              {parameters.map((param, index) => (
                <motion.div
                  key={param.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label 
                      htmlFor={param.key} 
                      className="text-sm font-medium text-gray-200 flex items-center gap-2 group-hover:text-white transition-colors duration-200"
                    >
                      <span className="text-red-400 group-hover:text-red-300 transition-colors duration-200">{param.icon}</span>
                      {param.label}
                    </Label>
                    <div className="text-xs text-gray-300 font-mono bg-gray-800/40 px-2 py-1 rounded border border-gray-700/50">
                      {Number(formData[param.key] || 0).toFixed(param.step < 0.1 ? 2 : 1)} {param.unit}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Slider
                      value={[Number(formData[param.key] || 0)]}
                      onValueChange={([value]) => handleInputChange(param.key, value)}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      className="w-full"
                    />
                    
                    <Input
                      id={param.key}
                      type="number"
                      value={Number(formData[param.key] || 0)}
                      onChange={(e) => handleInputChange(param.key, parseFloat(e.target.value) || 0)}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      className="h-8 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-gray-600/60 text-white text-xs
                        focus:border-red-400/80 focus:ring-2 focus:ring-red-400/30 focus:bg-gradient-to-r focus:from-gray-700/80 focus:to-gray-800/80
                        hover:border-red-500/60 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1 leading-tight bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-700/30">
                    {param.description}
                  </p>

                  {index < parameters.length - 1 && (
                    <Separator className="mt-4 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* CSV Upload Tab */}
          <TabsContent value="csv" className="space-y-4 mt-4">
            {/* CSV Upload Section */}
            <motion.div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              animate={{
                borderColor: isDragging ? 'rgb(220, 38, 38)' : 'rgb(75, 85, 99)',
                backgroundColor: isDragging ? 'rgba(220, 38, 38, 0.1)' : 'rgba(0, 0, 0, 0)',
                scale: isDragging ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center overflow-hidden
                ${isDragging ? 'border-red-500 bg-gradient-to-br from-red-500/20 to-rose-500/20' : 'border-gray-600/60 hover:border-red-500/60 bg-gradient-to-br from-gray-800/40 to-gray-900/40'}
                transition-all duration-300 cursor-pointer group backdrop-blur-sm`}
            >
              {/* Animated Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Upload Icon with Animation */}
              <motion.div
                animate={{
                  y: isDragging ? -10 : 0,
                  scale: isDragging ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-red-600/30 to-rose-600/30 
                  flex items-center justify-center border border-red-500/40 group-hover:border-red-400/60 transition-all duration-300 shadow-lg shadow-red-500/20">
                  <Upload className={`h-8 w-8 transition-colors duration-300 ${
                    isDragging ? 'text-red-400' : 'text-red-500 group-hover:text-red-400'
                  }`} />
                </div>

                <Label htmlFor="csv-upload-tess" className="cursor-pointer relative z-10">
                  <div className="space-y-2">
                    <div className="text-base font-semibold text-white group-hover:text-red-300 transition-colors">
                      {isDragging ? (
                        <span className="text-red-400 flex items-center justify-center gap-2">
                          <FileSpreadsheet className="h-5 w-5" />
                          Drop your CSV file here
                        </span>
                      ) : (
                        <>
                          Drag & Drop CSV File
                        </>
                      )}
                    </div>
                    
                    {!isDragging && (
                      <>
                        <div className="text-sm text-gray-400">
                          or{' '}
                          <span className="text-red-400 hover:text-red-300 font-medium underline underline-offset-2">
                            browse files
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 mt-3">
                          <Badge variant="outline" className="border-gray-600 text-gray-400 bg-gray-800/50 text-xs">
                            <FileSpreadsheet className="h-3 w-3 mr-1" />
                            .csv files only
                          </Badge>
                          <Badge variant="outline" className="border-red-600/50 text-red-400 bg-red-600/10 text-xs">
                            <Activity className="h-3 w-3 mr-1" />
                            {getRequiredParameters().length} parameters
                          </Badge>
                        </div>

                        <div className="text-xs text-gray-400 mt-4 max-w-xs mx-auto">
                          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-lg p-3 border border-gray-700/60 backdrop-blur-sm">
                            <div className="font-medium text-gray-300 mb-1 flex items-center justify-center gap-1">
                              <AlertCircle className="h-3 w-3 text-red-400" />
                              Required Parameters
                            </div>
                            <div className="text-gray-400 leading-relaxed">
                              pl_orbper, pl_trandurh, pl_rade, st_teff, st_tmag, and 8 more...
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Label>

                <Input
                  id="csv-upload-tess"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
              </motion.div>

              {/* Decorative Corner Elements */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-red-500/30 rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-red-500/30 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-red-500/30 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-red-500/30 rounded-br-lg" />
            </motion.div>

            {/* CSV Data Table */}
            {csvData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                {/* Header Stats */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-red-400/50 text-red-300 bg-red-400/10">
                      <Table className="h-3 w-3 mr-1" />
                      {csvData.length} {csvData.length === 1 ? 'row' : 'rows'} loaded
                    </Badge>
                    <Badge variant="outline" className="border-orange-400/50 text-orange-300 bg-orange-400/10">
                      <FileSpreadsheet className="h-3 w-3 mr-1" />
                      {csvHeaders.length} columns
                    </Badge>
                  </div>
                  
                  {selectedCsvRow !== null && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Badge variant="outline" className="border-green-400/50 text-green-300 bg-green-400/10">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Row {selectedCsvRow + 1} selected
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Data Table */}
                <div className="relative rounded-lg border border-gray-700/60 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm overflow-hidden shadow-lg">
                  {/* Table Header - Sticky */}
                  <div className="bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-md border-b border-gray-700/60 sticky top-0 z-10">
                    <div className="grid grid-cols-12 gap-2 px-3 py-3 text-xs font-semibold text-gray-300">
                      <div className="col-span-1 text-center">#</div>
                      <div className="col-span-5">Parameters Preview</div>
                      <div className="col-span-3 text-center">Match Status</div>
                      <div className="col-span-3 text-center">Action</div>
                    </div>
                  </div>

                  {/* Table Body - Scrollable */}
                  <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-600/50 scrollbar-track-gray-800/50">
                    {csvData.map((row, index) => {
                      const paramCheck = checkCsvParameters(row);
                      const matchPercentage = Math.round((paramCheck.found / paramCheck.total) * 100);
                      const isSelected = selectedCsvRow === index;

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`grid grid-cols-12 gap-2 px-3 py-3 text-xs border-t border-gray-700/40 
                            transition-all duration-200 hover:bg-gradient-to-r hover:from-red-600/10 hover:to-rose-600/10
                            ${isSelected ? 'bg-gradient-to-r from-red-600/20 to-rose-600/20 border-red-500/40' : ''}`}
                        >
                          {/* Row Number */}
                          <div className="col-span-1 text-center">
                            <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                              ${isSelected ? 'bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30' : 'bg-gray-700/60 text-gray-300'}`}>
                              {index + 1}
                            </div>
                          </div>

                          {/* Parameters Preview */}
                          <div className="col-span-5 text-gray-300">
                            <div className="space-y-1">
                              {Object.entries(row).slice(0, 2).map(([key, value], i) => (
                                <div key={i} className="flex items-center gap-1 truncate">
                                  <span className="text-gray-500 text-[10px]">{key}:</span>
                                  <span className="text-gray-300 font-mono text-[10px]">{String(value)}</span>
                                </div>
                              ))}
                              {Object.keys(row).length > 2 && (
                                <span className="text-gray-500 text-[10px]">+{Object.keys(row).length - 2} more...</span>
                              )}
                            </div>
                          </div>

                          {/* Match Status */}
                          <div className="col-span-3 flex items-center justify-center">
                            <div className="space-y-1 text-center">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  matchPercentage === 100
                                    ? 'border-green-400/50 text-green-300 bg-green-400/10'
                                    : matchPercentage >= 70
                                    ? 'border-yellow-400/50 text-yellow-300 bg-yellow-400/10'
                                    : 'border-red-400/50 text-red-300 bg-red-400/10'
                                }`}
                              >
                                {paramCheck.found}/{paramCheck.total}
                              </Badge>
                              <div className="text-[10px] text-gray-500">
                                {matchPercentage}% match
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="col-span-3 flex items-center justify-center">
                            <Button
                              size="sm"
                              onClick={() => handleSelectCsvRow(index)}
                              disabled={matchPercentage !== 100}
                              className={`h-7 text-xs transition-all duration-200 ${
                                isSelected
                                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-red-400/60 shadow-lg shadow-red-500/20'
                                  : matchPercentage === 100
                                  ? 'bg-gradient-to-r from-gray-700/60 to-gray-800/60 hover:from-red-600/20 hover:to-rose-600/20 text-gray-200 hover:text-red-200 border-gray-600/60 hover:border-red-500/60'
                                  : 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 text-gray-500 border-gray-700/60 cursor-not-allowed opacity-50'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Selected
                                </>
                              ) : matchPercentage === 100 ? (
                                <>
                                  <Activity className="h-3 w-3 mr-1" />
                                  Select
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Incomplete
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Clear CSV Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCsvData([]);
                    setCsvHeaders([]);
                    setSelectedCsvRow(null);
                    toast.success('CSV data cleared');
                  }}
                  className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-400 border-red-600/30 hover:border-red-500/50"
                >
                  <X className="h-3 w-3 mr-2" />
                  Clear CSV Data
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

            {/* Analysis Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-4 border-t border-gray-700/50 space-y-3"
            >
              {/* Gemini  AI Analysis Button */}
              <Button
                onClick={handleGeminiAnalyzeClick}
                disabled={planet.isAnalyzing || (activeTab === 'csv' && selectedCsvRow === null)}
                className="w-full bg-gradient-to-r from-red-600 via-red-700 to-orange-700 
                  hover:from-red-700 hover:via-red-800 hover:to-orange-800 
                  text-white h-12 font-semibold shadow-2xl shadow-red-600/30 
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  border border-red-500/30 hover:border-red-400/50"
              >
                {planet.isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    <span className="animate-pulse">Gemini  AI Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    {activeTab === 'csv' && selectedCsvRow === null 
                      ? 'Select CSV Row to Analyze'
                      : 'Analyze with Gemini  AI'}
                  </>
                )}
              </Button>

              {/* Flask ML Model Button */}
              <Button
                onClick={handleFlaskAnalyze}
                disabled={planet.isAnalyzing || (activeTab === 'csv' && selectedCsvRow === null)}
                variant="outline"
                className="w-full bg-gradient-to-r from-orange-600 via-orange-700 to-yellow-700 
                  hover:from-orange-700 hover:via-orange-800 hover:to-yellow-800 
                  text-white h-12 font-semibold shadow-2xl shadow-orange-600/30 
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  border border-orange-500/30 hover:border-orange-400/50"
              >
                {planet.isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    <span className="animate-pulse">ML Model Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    {activeTab === 'csv' && selectedCsvRow === null 
                      ? 'Select CSV Row to Analyze'
                      : 'Analyze with ML Model'}
                  </>
                )}
              </Button>

              {/* Info Text */}
              <div className="text-xs text-gray-500 text-center space-y-1 my-3">
                <p><strong>Gemini  AI:</strong> Advanced reasoning & scientific analysis</p>
                <p><strong>ML Model:</strong> Trained on TESS mission dataset patterns</p>
                <p className="flex "><AlertCircle className="h-3 w-3"/> AI models can make mistakes. Please review results carefully.</p>
              </div>

              {/* View Results Button - Show when there are results */}
              {(planet.geminiResponse || planet.flaskResponse) && (
                <Button
                  onClick={() => setShowResultDialog(true)}
                  variant="outline"
                  className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 
                    hover:from-purple-600/30 hover:to-pink-600/30 
                    text-purple-300 h-10 font-medium shadow-lg shadow-purple-600/20 
                    transition-all duration-300
                    border border-purple-500/30 hover:border-purple-400/50"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  View Detailed Results
                </Button>
              )}
            </motion.div>

            {/* Planet Stats Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 rounded-xl p-4 border border-gray-700/50"
            >
              <h4 className="text-sm font-semibold text-white mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-400">Habitability</div>
                  <div className="text-red-300 font-medium">
                    {formData.koi_teq > 200 && formData.koi_teq < 350 ? 'Potential' : 'Unlikely'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Size Class</div>
                  <div className="text-red-300 font-medium">
                    {formData.koi_prad < 1.25 ? 'Earth-like' : 
                     formData.koi_prad < 2 ? 'Super-Earth' : 'Gas Giant'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Orbit Type</div>
                  <div className="text-red-300 font-medium">
                    {formData.koi_period < 10 ? 'Ultra-Short' : 
                     formData.koi_period < 100 ? 'Short' : 'Long'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Transit Signal</div>
                  <div className="text-red-300 font-medium">
                    {formData.koi_depth > 0.001 ? 'Strong' : 
                     formData.koi_depth > 0.0001 ? 'Moderate' : 'Weak'}
                  </div>
                </div>
              </div>
            </motion.div>

          </CardContent>
        </Card>
      </div>


      {/* Result Dialog */}
      <ResultDialog
        open={showResultDialog}
        onOpenChange={setShowResultDialog}
        geminiResponse={planet.geminiResponse}
        flaskResponse={planet.flaskResponse}
        prediction={planet.prediction}
        planetName={planet.id}
      />
    </motion.div>
  );
}