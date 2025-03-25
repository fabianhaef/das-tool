"use client"

import { useState, useRef, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Play,
  Pause,
  Clock,
  History,
  GitBranch,
  Code,
  Edit2,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Lock,
  SkipForward,
  Bookmark,
} from 'lucide-react'

// Sample execution history
const timelineData = [
  { 
    id: 1, 
    timestamp: "09:32:14.456", 
    type: "initialization", 
    description: "System initialized", 
    status: "success",
    checkpoint: true,
    code: `function initialize() {\n  console.log("System startup");\n  return { status: "ready" };\n}`,
    changes: []
  },
  { 
    id: 2, 
    timestamp: "09:32:15.128", 
    type: "data_load", 
    description: "Training data loaded", 
    status: "success",
    checkpoint: false,
    code: `function loadData() {\n  const data = fetchTrainingData();\n  return data.length > 0;\n}`,
    changes: []
  },
  { 
    id: 3, 
    timestamp: "09:32:17.834", 
    type: "model_init", 
    description: "Model parameters initialized", 
    status: "success",
    checkpoint: false,
    code: `function initializeModel(config) {\n  const model = new Model(config);\n  model.setLearningRate(0.01);\n  return model;\n}`,
    changes: []
  },
  { 
    id: 4, 
    timestamp: "09:32:21.573", 
    type: "execution", 
    description: "First inference pass", 
    status: "warning",
    checkpoint: true,
    code: `function inference(model, input) {\n  const result = model.predict(input);\n  if (result.confidence < 0.6) {\n    console.warn("Low confidence prediction");\n  }\n  return result;\n}`,
    changes: [
      { user: "Emma Chen", timestamp: "09:45:32", note: "Adjusted confidence threshold to 0.5" }
    ]
  },
  { 
    id: 5, 
    timestamp: "09:32:25.128", 
    type: "adjustment", 
    description: "Parameter optimization", 
    status: "success",
    checkpoint: false,
    code: `function optimize(model, loss) {\n  const optimizer = new SGDOptimizer();\n  optimizer.step(model, loss);\n  return model.getParameters();\n}`,
    changes: []
  },
  { 
    id: 6, 
    timestamp: "09:32:28.834", 
    type: "execution", 
    description: "Second inference pass", 
    status: "error",
    checkpoint: true,
    code: `function secondInference(model, input) {\n  const result = model.predict(input);\n  // Error: Division by zero\n  const normalized = result.value / result.normFactor;\n  return normalized;\n}`,
    changes: [
      { user: "Lucas Wong", timestamp: "09:46:18", note: "Added null check for normFactor" },
      { user: "Olivia Smith", timestamp: "09:47:05", note: "Changed algorithm to prevent division" }
    ]
  },
  { 
    id: 7, 
    timestamp: "09:32:31.523", 
    type: "recovery", 
    description: "Error recovery process", 
    status: "success",
    checkpoint: false,
    code: `function errorRecovery(model) {\n  model.resetState();\n  model.loadCheckpoint("last_stable");\n  return model.isValid();\n}`,
    changes: []
  },
  { 
    id: 8, 
    timestamp: "09:32:35.712", 
    type: "execution", 
    description: "Alternative approach", 
    status: "success",
    checkpoint: true,
    code: `function alternativeApproach(model, input) {\n  // Using a different algorithm\n  const result = model.predictWithEnsemble(input);\n  return result.confidence > 0.8;\n}`,
    changes: [
      { user: "Emma Chen", timestamp: "09:48:44", note: "Suggested ensemble approach" }
    ]
  },
]

export default function TimeTravelDebugger() {
  const [currentTimeIndex, setCurrentTimeIndex] = useState(3)
  const [playing, setPlaying] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(timelineData[3])
  const [editMode, setEditMode] = useState(false)
  const [branchCreated, setBranchCreated] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  
  // Simulation of playback
  useEffect(() => {
    if (!playing) return
    
    const interval = setInterval(() => {
      setCurrentTimeIndex(prev => {
        if (prev < timelineData.length - 1) {
          const newIndex = prev + 1
          setSelectedEvent(timelineData[newIndex])
          return newIndex
        } else {
          setPlaying(false)
          return prev
        }
      })
    }, 2000)
    
    return () => clearInterval(interval)
  }, [playing])
  
  // Scroll the timeline event into view when changing time index
  useEffect(() => {
    if (timelineRef.current) {
      const eventElement = timelineRef.current.querySelector(`[data-index="${currentTimeIndex}"]`)
      if (eventElement) {
        eventElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [currentTimeIndex])
  
  const handleTimeChange = (newIndex: number) => {
    setCurrentTimeIndex(newIndex)
    setSelectedEvent(timelineData[newIndex])
  }
  
  const handleCreateBranch = () => {
    setBranchCreated(true)
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-400" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 p-4 bg-black/90">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400 glow-text">Time-Travelling Debugger & Model Interpretation</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setEditMode(!editMode)}
            className={`text-blue-400 border-blue-400/30 hover:text-blue-300 ${editMode ? 'bg-blue-950/50' : ''}`}
          >
            <Edit2 className="h-4 w-4 mr-1" /> Edit Mode
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={branchCreated}
            onClick={handleCreateBranch} 
            className="text-blue-400 border-blue-400/30 hover:text-blue-300"
          >
            <GitBranch className="h-4 w-4 mr-1" /> Create Branch
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPlaying(!playing)}
            className="text-blue-400 border-blue-400/30 hover:text-blue-300"
          >
            {playing ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {playing ? 'Pause' : 'Play'}
          </Button>
        </div>
      </div>
      
      {/* Main Timeline */}
      <div className="w-full hologram p-4 relative glow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-blue-400 flex items-center">
            <History className="h-4 w-4 mr-1" /> System Execution Timeline
          </h2>
          <div className="text-xs text-blue-300">
            <Clock className="h-3 w-3 inline-block mr-1" /> 
            {timelineData[currentTimeIndex].timestamp}
          </div>
        </div>
        
        {/* Main Timeline Scrubber */}
        <div className="mb-4">
          <Slider 
            value={[currentTimeIndex]} 
            max={timelineData.length - 1} 
            step={1}
            onValueChange={([value]) => handleTimeChange(value)}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-blue-400/70">
            <span>Start</span>
            <span>Current Time</span>
          </div>
        </div>
        
        {/* Timeline Events */}
        <div 
          className="flex gap-1 overflow-x-auto pb-4 snap-x"
          ref={timelineRef}
        >
          {timelineData.map((event, index) => (
            <div 
              key={event.id}
              data-index={index}
              className={`shrink-0 snap-center w-32 cursor-pointer transition-all duration-200
                ${index === currentTimeIndex ? 'transform scale-110' : 'opacity-70 scale-95'}
                ${event.checkpoint ? 'pb-8' : 'pb-2'}`}
              onClick={() => handleTimeChange(index)}
            >
              <div 
                className={`hologram p-3 rounded-lg h-20 flex flex-col items-center justify-center text-center
                  ${index === currentTimeIndex ? 'border-blue-400' : 'border-blue-400/30'}
                  ${event.status === 'warning' ? 'border-amber-400/50' : ''}
                  ${event.status === 'error' ? 'border-red-400/50' : ''}`}
              >
                <div className="flex justify-center mb-1">
                  {getStatusIcon(event.status)}
                </div>
                <div className="text-xs font-semibold text-blue-300 truncate w-full">
                  {event.description}
                </div>
                <div className="text-[10px] text-blue-400/70 mt-1">
                  {event.timestamp}
                </div>
              </div>
              
              {event.checkpoint && (
                <div className="flex justify-center mt-1">
                  <Flag className={`h-4 w-4 ${
                    event.status === 'success' ? 'text-emerald-400' : 
                    event.status === 'warning' ? 'text-amber-400' : 
                    'text-red-400'
                  }`} />
                </div>
              )}
              
              {/* Time Branch indicator */}
              {branchCreated && index >= 4 && (
                <div className="absolute top-1 right-1">
                  <div className="text-xs text-purple-400 bg-purple-950/50 rounded-sm px-1">Branch</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Details Panel */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: Status & Changes */}
        <div className="w-2/5 flex flex-col gap-4">
          {/* Event Details Card */}
          <Card className="hologram p-4 flex-1">
            <h2 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
              <Flag className="h-4 w-4 mr-1" /> Event Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`rounded-full w-3 h-3 mr-2 ${
                  selectedEvent.status === 'success' ? 'bg-emerald-400' : 
                  selectedEvent.status === 'warning' ? 'bg-amber-400' : 
                  'bg-red-400'
                }`}></div>
                <div className="text-sm font-semibold text-blue-300">
                  {selectedEvent.description}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-blue-400 mb-1">Type</div>
                <div className="text-sm text-blue-100">
                  {selectedEvent.type.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-blue-400 mb-1">Status</div>
                <div className="flex items-center">
                  {getStatusIcon(selectedEvent.status)}
                  <span className="ml-1 text-sm capitalize text-blue-100">
                    {selectedEvent.status}
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentTimeIndex === 0}
                  onClick={() => handleTimeChange(currentTimeIndex - 1)}
                  className="text-blue-400 border-blue-400/30 hover:text-blue-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentTimeIndex === timelineData.length - 1}
                  onClick={() => handleTimeChange(currentTimeIndex + 1)}
                  className="text-blue-400 border-blue-400/30 hover:text-blue-300"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                
                {editMode && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-400 border-blue-400/30 hover:text-blue-300"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" /> Reset Step
                  </Button>
                )}
                
                {editMode && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-400 border-blue-400/30 hover:text-blue-300"
                  >
                    <SkipForward className="h-4 w-4 mr-1" /> Recalculate Future
                  </Button>
                )}
                
                {selectedEvent.checkpoint && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-400 border-blue-400/30 hover:text-blue-300"
                  >
                    <Bookmark className="h-4 w-4 mr-1" /> Set Checkpoint
                  </Button>
                )}
              </div>
            </div>
          </Card>
          
          {/* Audit Trail Card */}
          <Card className="hologram p-4 h-52">
            <h2 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
              <User className="h-4 w-4 mr-1" /> Audit Trail
            </h2>
            
            {selectedEvent.changes.length > 0 ? (
              <div className="space-y-2 max-h-[10rem] overflow-y-auto pr-2">
                {selectedEvent.changes.map((change, index) => (
                  <div key={index} className="bg-blue-950/30 p-2 rounded text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-semibold text-blue-300 flex items-center">
                        <User className="h-3 w-3 mr-1" /> {change.user}
                      </div>
                      <div className="text-blue-400/70">{change.timestamp}</div>
                    </div>
                    <div className="text-blue-100">{change.note}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-blue-300/50 text-xs">
                No modifications recorded for this step
              </div>
            )}
            
            {editMode && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-400 border-blue-400/30 hover:text-blue-300 w-full mt-2"
              >
                <Lock className="h-3 w-3 mr-1" /> Add Audit Note
              </Button>
            )}
          </Card>
        </div>
        
        {/* Right: Code Display */}
        <div className="w-3/5">
          <Card className="hologram p-4 h-full flex flex-col">
            <h2 className="text-sm font-semibold text-blue-400 mb-3 flex items-center">
              <Code className="h-4 w-4 mr-1" /> Code Execution & Diff
            </h2>
            
            <Tabs defaultValue="code" className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start h-8 bg-blue-900/20">
                <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
                <TabsTrigger value="diff" className="text-xs">
                  {branchCreated ? 'Branch Diff' : 'Historical Diff'}
                </TabsTrigger>
                <TabsTrigger value="state" className="text-xs">System State</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="flex-1 p-0 m-0 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="bg-blue-950/50 text-xs p-1.5 text-blue-300 font-mono">
                    {editMode ? "// EDIT MODE - Click to modify code" : "// Generated code for this execution step"}
                  </div>
                  
                  <div className={`font-mono text-xs p-4 overflow-auto h-full bg-blue-950/20 ${editMode ? 'border border-dashed border-blue-400/50' : ''}`}>
                    <pre className="text-blue-100">
                      {selectedEvent.code}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="diff" className="flex-1 p-0 m-0 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="bg-blue-950/50 text-xs p-1.5 text-blue-300 font-mono">
                    {branchCreated ? "// Diff between main branch and alternative branch" : "// Diff from previous state"}
                  </div>
                  
                  <div className="font-mono text-xs p-4 overflow-auto h-full bg-blue-950/20">
                    <pre>
                      <span className="text-blue-300">function inference(model, input) {'{'}</span>
                      <br />
                      <span className="text-blue-300">  const result = model.predict(input);</span>
                      <br />
                      {currentTimeIndex >= 4 ? (
                        <>
                          <span className="text-red-400">-  if (result.confidence &lt; 0.6) {'{'}</span>
                          <br />
                          <span className="text-green-400">+  if (result.confidence &lt; 0.5) {'{'}</span>
                          <br />
                        </>
                      ) : (
                        <span className="text-blue-300">  if (result.confidence &lt; 0.6) {'{'}</span>
                      )}
                      <span className="text-blue-300">    console.warn("Low confidence prediction");</span>
                      <br />
                      <span className="text-blue-300">  {'}'}</span>
                      <br />
                      {branchCreated && currentTimeIndex >= 6 ? (
                        <>
                          <span className="text-red-400">-  return result;</span>
                          <br />
                          <span className="text-green-400">+  {/* Added safety check */}</span>
                          <br />
                          <span className="text-green-400">+  return result.confidence &gt; 0 ? result : fallbackResult;</span>
                          <br />
                        </>
                      ) : (
                        <span className="text-blue-300">  return result;</span>
                      )}
                      <span className="text-blue-300">{'}'}</span>
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="state" className="flex-1 p-0 m-0 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="bg-blue-950/50 text-xs p-1.5 text-blue-300 font-mono">
                    // System state at current point in time
                  </div>
                  
                  <div className="text-xs font-mono bg-blue-950/30 p-3 rounded overflow-auto">
                    {`// System state at ${selectedEvent.timestamp}
{
  processingMode: "inference",
  models: ["primary", "fallback"],
  threshold: 0.82,
  confidence: ${selectedEvent.status === 'error' ? '0.44' : '0.89'},
  inputSize: ${editMode ? '128' : '256'}
  /* More properties available */
}`}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
      
      <style jsx global>{`
        /* Custom scrollbar for code sections */
        pre::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        pre::-webkit-scrollbar-thumb {
          background-color: rgba(96, 165, 250, 0.3);
          border-radius: 3px;
        }
        
        pre::-webkit-scrollbar-track {
          background-color: rgba(30, 58, 138, 0.1);
        }
      `}</style>
    </div>
  )
} 