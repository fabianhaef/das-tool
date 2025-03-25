"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  AreaChart,
  Activity,
  PanelRight,
  Layers,
  AlertTriangle,
  Cpu,
  MemoryStick,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export default function ArchitectureDashboard() {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isSimulating, setIsSimulating] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [userLoad, setUserLoad] = useState(50)
  const [dataComplexity, setDataComplexity] = useState(50)
  const [moduleMetrics, setModuleMetrics] = useState<Record<string, {
    latency: number;
    errorRate: number;
    throughput: number;
    reliability: number;
    status: 'normal' | 'warning' | 'error';
  }>>({})
  const [simulationSpeed, setSimulationSpeed] = useState(1000) // ms between updates
  
  const modules = [
    { id: 'dataIngestion', name: 'Data Ingestion', inputs: ['API', 'Database'], outputs: ['Parser'] },
    { id: 'parser', name: 'Parser', inputs: ['Data Ingestion'], outputs: ['Analyzer', 'Storage'] },
    { id: 'analyzer', name: 'Analyzer', inputs: ['Parser'], outputs: ['Decision Engine', 'Reporting'] },
    { id: 'decisionEngine', name: 'Decision Engine', inputs: ['Analyzer'], outputs: ['API', 'UI', 'Logger'] },
    { id: 'storage', name: 'Storage', inputs: ['Parser'], outputs: ['Analyzer', 'Reporting'] },
    { id: 'reporting', name: 'Reporting', inputs: ['Analyzer', 'Storage'], outputs: ['UI'] },
    { id: 'ui', name: 'UI', inputs: ['Decision Engine', 'Reporting'], outputs: ['User'] },
    { id: 'logger', name: 'Logger', inputs: ['Decision Engine'], outputs: [] },
  ]
  
  const performanceMetrics = {
    responseTime: 320, // ms
    cpuUsage: 42, // %
    memoryUsage: 1.7, // GB
    explainabilityScore: 86, // %
  }
  
  // Function to calculate module metrics based on simulation parameters
  const calculateModuleMetrics = (moduleId: string, userLoad: number, dataComplexity: number) => {
    const baseLatency = 40 // base latency in ms
    const baseErrorRate = 0.02 // base error rate percentage
    const baseThroughput = 150 // base requests per second
    const baseReliability = 99.95 // base reliability percentage

    // Impact factors
    const loadImpact = (userLoad - 50) / 50 // -1 to 1
    const complexityImpact = (dataComplexity - 50) / 50 // -1 to 1

    // Calculate metrics with randomness and parameter impacts
    const latency = Math.max(1, Math.round(
      baseLatency * (1 + loadImpact * 0.5 + complexityImpact * 0.3) * (0.9 + Math.random() * 0.2)
    ))
    const errorRate = Math.max(0, Number(
      (baseErrorRate * (1 + loadImpact * 0.3 + complexityImpact * 0.4) * (0.95 + Math.random() * 0.1)).toFixed(3)
    ))
    const throughput = Math.max(1, Math.round(
      baseThroughput * (1 - loadImpact * 0.2 - complexityImpact * 0.1) * (0.95 + Math.random() * 0.1)
    ))
    const reliability = Math.min(100, Number(
      (baseReliability * (1 - loadImpact * 0.05 - complexityImpact * 0.05) * (0.999 + Math.random() * 0.002)).toFixed(2)
    ))

    // Determine module status
    let status: 'normal' | 'warning' | 'error' = 'normal'
    if (latency > baseLatency * 1.5 || errorRate > baseErrorRate * 1.5) {
      status = 'warning'
    }
    if (latency > baseLatency * 2 || errorRate > baseErrorRate * 2) {
      status = 'error'
    }

    return { latency, errorRate, throughput, reliability, status }
  }

  // Function to run simulation step
  const runSimulationStep = () => {
    const newMetrics: Record<string, any> = {}
    
    modules.forEach(module => {
      newMetrics[module.id] = calculateModuleMetrics(module.id, userLoad, dataComplexity)
    })

    setModuleMetrics(newMetrics)
  }

  // Effect to handle simulation
  useEffect(() => {
    if (!isSimulating) return

    const interval = setInterval(runSimulationStep, simulationSpeed)
    return () => clearInterval(interval)
  }, [isSimulating, userLoad, dataComplexity, simulationSpeed])

  // Function to handle simulation start/stop
  const toggleSimulation = () => {
    if (!isSimulating) {
      runSimulationStep() // Run first step immediately
    }
    setIsSimulating(!isSimulating)
  }

  // Function to handle user load change
  const handleUserLoadChange = (value: number[]) => {
    setUserLoad(value[0])
  }

  // Function to handle data complexity change
  const handleDataComplexityChange = (value: number[]) => {
    setDataComplexity(value[0])
  }

  // Function to get module status class
  const getModuleStatusClass = (moduleId: string) => {
    const metrics = moduleMetrics[moduleId]
    if (!metrics) return ''
    
    switch (metrics.status) {
      case 'warning':
        return 'border-yellow-400'
      case 'error':
        return 'border-red-400'
      default:
        return ''
    }
  }

  // Function to handle module selection
  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId === selectedModule ? null : moduleId)
  }
  
  // Function to handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      if (direction === 'in' && prev < 2) return prev + 0.25
      if (direction === 'out' && prev > 0.5) return prev - 0.25
      return prev
    })
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 p-4 bg-black/90">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary glow-text">Architecture Dashboard & Function Analysis</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleZoom('out')}
            className="text-foreground border-primary/30 hover:text-primary"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleZoom('in')}
            className="text-foreground border-primary/30 hover:text-primary"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant={isSimulating ? "default" : "outline"} 
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
            className="text-foreground border-primary/30 hover:text-primary"
          >
            {isSimulating ? (
              <><Pause className="h-4 w-4 mr-1" /> Pause Simulation</>
            ) : (
              <><Play className="h-4 w-4 mr-1" /> Run Simulation</>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 flex-1">
        {/* Left side - Module Map */}
        <div className="flex-1 hologram p-4 overflow-hidden">
          <h2 className="text-sm font-semibold text-primary mb-4 flex items-center">
            <Layers className="h-4 w-4 mr-1" /> Module Architecture
          </h2>
          
          <div 
            className="relative w-full h-[calc(100%-2rem)] overflow-hidden"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
          >
            {/* Module visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              {modules.map((module, index) => {
                // Position modules in a circle
                const angle = (index / modules.length) * Math.PI * 2
                const radius = 150
                const x = Math.cos(angle) * radius + 250
                const y = Math.sin(angle) * radius + 200
                
                return (
                  <div 
                    key={module.id}
                    className={`absolute float cursor-pointer ${selectedModule === module.id ? 'glow' : ''}`}
                    style={{ 
                      left: x, 
                      top: y, 
                      animationDelay: `${index * 0.2}s`,
                      zIndex: selectedModule === module.id ? 10 : 1,
                    }}
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <div className={`hologram p-3 rounded-lg w-24 h-24 flex flex-col items-center justify-center text-center
                      ${isSimulating ? 'animate-pulse' : ''} 
                      ${selectedModule === module.id ? 'border-primary' : 'border-primary/30'}
                      ${isSimulating ? getModuleStatusClass(module.id) : ''}`}
                    >
                      <div className="text-xs font-semibold text-foreground mb-1">{module.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        In: {module.inputs.length}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Out: {module.outputs.length}
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {modules.map(module => (
                  module.outputs.map(output => {
                    const targetModule = modules.find(m => m.name === output)
                    if (!targetModule) return null
                    
                    // Calculate positions for source and target
                    const sourceIndex = modules.findIndex(m => m.id === module.id)
                    const targetIndex = modules.findIndex(m => m.id === targetModule.id)
                    
                    const sourceAngle = (sourceIndex / modules.length) * Math.PI * 2
                    const targetAngle = (targetIndex / modules.length) * Math.PI * 2
                    
                    const radius = 150
                    const sourceX = Math.cos(sourceAngle) * radius + 250
                    const sourceY = Math.sin(sourceAngle) * radius + 200
                    const targetX = Math.cos(targetAngle) * radius + 250
                    const targetY = Math.sin(targetAngle) * radius + 200
                    
                    const isActive = selectedModule === module.id || selectedModule === targetModule.id
                    
                    return (
                      <g key={`${module.id}-${targetModule.id}`}>
                        <path 
                          d={`M ${sourceX + 12} ${sourceY + 12} C ${(sourceX + targetX) / 2} ${sourceY}, ${(sourceX + targetX) / 2} ${targetY}, ${targetX + 12} ${targetY + 12}`}
                          fill="none"
                          stroke={isActive ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.2)"}
                          strokeWidth={isActive ? 2 : 1}
                          strokeDasharray={isSimulating ? "4 2" : "none"}
                          className={isSimulating ? "animate-dash" : ""}
                        />
                        {isSimulating && (
                          <circle 
                            r="3" 
                            fill="rgba(255, 255, 255, 0.8)"
                            className="animate-flow"
                          >
                            <animateMotion
                              dur={`${3 + Math.random() * 2}s`}
                              repeatCount="indefinite"
                              path={`M ${sourceX + 12} ${sourceY + 12} C ${(sourceX + targetX) / 2} ${sourceY}, ${(sourceX + targetX) / 2} ${targetY}, ${targetX + 12} ${targetY + 12}`}
                            />
                          </circle>
                        )}
                      </g>
                    )
                  })
                ))}
              </svg>
            </div>
          </div>
        </div>
        
        {/* Right side - Analysis Panels */}
        <div className="w-80 flex flex-col gap-4">
          {/* Performance Metrics */}
          <Card className="hologram p-4 glow">
            <h2 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
              <Activity className="h-4 w-4 mr-1" /> Performance Metrics
            </h2>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-300 flex items-center"><Clock className="h-3 w-3 mr-1" /> Response Time</span>
                  <span className="text-blue-400">{performanceMetrics.responseTime} ms</span>
                </div>
                <div className="h-1.5 bg-blue-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${Math.min(performanceMetrics.responseTime / 10, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-300 flex items-center"><Cpu className="h-3 w-3 mr-1" /> CPU Usage</span>
                  <span className="text-blue-400">{performanceMetrics.cpuUsage}%</span>
                </div>
                <div className="h-1.5 bg-blue-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${performanceMetrics.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-300 flex items-center"><MemoryStick className="h-3 w-3 mr-1" /> Memory Usage</span>
                  <span className="text-blue-400">{performanceMetrics.memoryUsage} GB</span>
                </div>
                <div className="h-1.5 bg-blue-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${(performanceMetrics.memoryUsage / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-300 flex items-center"><ShieldCheck className="h-3 w-3 mr-1" /> Explainability</span>
                  <span className="text-blue-400">{performanceMetrics.explainabilityScore}%</span>
                </div>
                <div className="h-1.5 bg-blue-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${performanceMetrics.explainabilityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Module Details */}
          <Card className="hologram p-4 flex-1">
            <h2 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
              <PanelRight className="h-4 w-4 mr-1" /> 
              {selectedModule ? `${modules.find(m => m.id === selectedModule)?.name} Details` : 'Module Analysis'}
            </h2>
            
            {selectedModule ? (
              <div className="space-y-3">
                <div className="text-xs text-blue-300">
                  {modules.find(m => m.id === selectedModule)?.name} is operating normally.
                  {isSimulating && ' Processing data at 1.7 MB/s.'}
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-blue-400">Inputs:</div>
                  <div className="flex flex-wrap gap-1">
                    {modules.find(m => m.id === selectedModule)?.inputs.map(input => (
                      <span key={input} className="text-xs bg-blue-900/20 text-blue-300 px-2 py-0.5 rounded">
                        {input}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-blue-400">Outputs:</div>
                  <div className="flex flex-wrap gap-1">
                    {modules.find(m => m.id === selectedModule)?.outputs.map(output => (
                      <span key={output} className="text-xs bg-blue-900/20 text-blue-300 px-2 py-0.5 rounded">
                        {output}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs font-semibold text-blue-400 mt-2">Health Metrics:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-900/20 p-2 rounded">
                    <div className="text-[10px] text-blue-300">Latency</div>
                    <div className="text-sm font-mono text-blue-400">42 ms</div>
                  </div>
                  <div className="bg-blue-900/20 p-2 rounded">
                    <div className="text-[10px] text-blue-300">Error Rate</div>
                    <div className="text-sm font-mono text-blue-400">0.03%</div>
                  </div>
                  <div className="bg-blue-900/20 p-2 rounded">
                    <div className="text-[10px] text-blue-300">Throughput</div>
                    <div className="text-sm font-mono text-blue-400">178/s</div>
                  </div>
                  <div className="bg-blue-900/20 p-2 rounded">
                    <div className="text-[10px] text-blue-300">Reliability</div>
                    <div className="text-sm font-mono text-blue-400">99.98%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-blue-300/50 text-xs">
                <Layers className="h-12 w-12 mb-2 opacity-50" />
                Select a module to view details
              </div>
            )}
          </Card>
          
          {/* What-If Simulation */}
          <Card className="hologram p-4">
            <h2 className="text-sm font-semibold text-primary mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-1" /> What-If Simulation
            </h2>
            
            <div className="space-y-2">
              <div className="text-xs text-foreground">Input Parameters:</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">User Load</span>
                    <span className="text-primary">{userLoad * 10} req/s</span>
                  </div>
                  <Slider 
                    defaultValue={[50]} 
                    value={[userLoad]}
                    max={100} 
                    step={1} 
                    onValueChange={handleUserLoadChange}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">Data Complexity</span>
                    <span className="text-primary">
                      {dataComplexity < 33 ? 'Low' : dataComplexity < 66 ? 'Medium' : 'High'}
                    </span>
                  </div>
                  <Slider 
                    defaultValue={[50]} 
                    value={[dataComplexity]}
                    max={100} 
                    step={1}
                    onValueChange={handleDataComplexityChange}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">Simulation Speed</span>
                    <span className="text-primary">{simulationSpeed}ms</span>
                  </div>
                  <Slider 
                    defaultValue={[1000]} 
                    value={[simulationSpeed]}
                    min={100}
                    max={2000} 
                    step={100}
                    onValueChange={(value) => setSimulationSpeed(value[0])}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full mt-2 text-xs h-8" 
                variant={isSimulating ? "default" : "outline"}
                onClick={toggleSimulation}
              >
                {isSimulating ? 'Stop Simulation' : 'Run Simulation'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Bottom warning panel, appears during simulation */}
      {isSimulating && (
        <Card className="hologram p-3 text-yellow-400 flex items-center gap-2 mt-auto">
          <AlertTriangle className="h-4 w-4" />
          <div className="text-sm">Potential bottleneck detected in the Analyzer module under high load conditions.</div>
          <Button variant="outline" size="sm" className="ml-auto text-xs h-7 text-yellow-400 border-yellow-400/30">
            View Details
          </Button>
        </Card>
      )}
      
      <style jsx global>{`
        @keyframes animate-dash {
          to {
            stroke-dashoffset: 20;
          }
        }
        
        .animate-dash {
          animation: animate-dash 1s linear infinite;
        }
        
        @keyframes animate-flow {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        .animate-flow {
          animation: animate-flow 2s linear infinite;
        }
      `}</style>
    </div>
  )
} 