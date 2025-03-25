"use client"

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Mic,
  Type,
  PenTool,
  HandMetal,
  AlertCircle,
  History,
  Users,
  GitBranch,
} from 'lucide-react'

// Add type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface TaskData {
  title: string;
  description: string;
  type: 'feature' | 'bug' | 'feedback';
  priority: 'low' | 'medium' | 'high';
}

function PromptEditorContent() {
  const searchParams = useSearchParams()
  const [activePersona, setActivePersona] = useState('default')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [activeTextarea, setActiveTextarea] = useState<string | null>(null)
  const [taskData, setTaskData] = useState<TaskData | null>(null)

  // Handle task data from URL
  useEffect(() => {
    const taskParam = searchParams.get('task')
    if (taskParam) {
      try {
        const task = JSON.parse(decodeURIComponent(taskParam))
        setTaskData(task)
      } catch (error) {
        console.error('Failed to parse task data:', error)
      }
    }
  }, [searchParams])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      setRecognition(recognition)
    }
  }, [])

  // Function to handle speech recognition
  const handleSpeechRecognition = (textareaId: string) => {
    if (!recognition) {
      console.error('Speech recognition not supported')
      return
    }

    setActiveTextarea(textareaId)
    
    if (isRecording) {
      recognition.stop()
    } else {
      recognition.start()
      setIsRecording(true)
    }
  }

  // Function to insert transcript into textarea
  const insertTranscript = (textareaId: string) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement
    if (textarea && transcript) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      const newText = text.substring(0, start) + transcript + text.substring(end)
      textarea.value = newText
      textarea.selectionStart = textarea.selectionEnd = start + transcript.length
      setTranscript('')
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4 bg-black/90">
      {/* Left Sidebar - Input Methods */}
      <div className="w-16 flex flex-col items-center gap-2 p-2 hologram glow">
        <Button variant="ghost" size="icon" title="Text Input" className="text-foreground hover:text-primary">
          <Type className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          title="Voice Input" 
          className={`${isRecording ? 'text-red-400 animate-pulse' : 'text-foreground hover:text-primary'}`}
          onClick={() => handleSpeechRecognition('primaryGoal')}
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Handwriting" className="text-foreground hover:text-primary">
          <PenTool className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Gesture Input" className="text-foreground hover:text-primary">
          <HandMetal className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4">
        <Tabs defaultValue="goals" className="flex-1">
          <TabsList className="hologram w-full justify-start h-12 p-1">
            <TabsTrigger value="goals" className="text-foreground">Goals</TabsTrigger>
            <TabsTrigger value="constraints" className="text-foreground">Constraints</TabsTrigger>
            <TabsTrigger value="examples" className="text-foreground">Examples</TabsTrigger>
            <TabsTrigger value="validation" className="text-foreground">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="flex-1 mt-4">
            <div className="grid gap-4">
              <Card className="hologram p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-primary glow-text">Primary Goal</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                      <History className="h-4 w-4 mr-1" />
                      History
                    </Button>
                    <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                      <GitBranch className="h-4 w-4 mr-1" />
                      Version
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Textarea 
                    id="primaryGoal"
                    placeholder="Define the primary goal of your system..."
                    className="min-h-[100px] bg-black/50 border-primary/30 text-foreground placeholder:text-muted-foreground"
                    defaultValue={taskData ? `Task: ${taskData.title}\n\n${taskData.description}` : ''}
                  />
                  {isRecording && activeTextarea === 'primaryGoal' && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-400">Recording...</span>
                    </div>
                  )}
                </div>
                {transcript && activeTextarea === 'primaryGoal' && (
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs text-primary"
                      onClick={() => insertTranscript('primaryGoal')}
                    >
                      Insert Transcript
                    </Button>
                  </div>
                )}
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="hologram p-4 float">
                  <h3 className="font-semibold mb-2 text-primary glow-text">Sub-Goals</h3>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input 
                        id="subGoal"
                        placeholder="Add a sub-goal..." 
                        className="bg-black/50 border-primary/30 text-foreground placeholder:text-muted-foreground"
                        defaultValue={taskData ? `Priority: ${taskData.priority}\nType: ${taskData.type}` : ''}
                      />
                      {isRecording && activeTextarea === 'subGoal' && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-primary border-primary/50"
                        onClick={() => insertTranscript('subGoal')}
                      >
                        Add
                      </Button>
                      <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                        Reorder
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="hologram p-4 float" style={{ animationDelay: '0.5s' }}>
                  <h3 className="font-semibold mb-2 text-primary glow-text">Validation Rules</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Potential conflict detected</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="constraints">
            <Card className="hologram p-4">
              <h3 className="font-semibold mb-4 text-primary glow-text">System Constraints</h3>
              {/* Add constraint graph visualization here */}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Sidebar - Personas & Settings */}
      <div className="w-64 hologram p-4 glow">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-primary glow-text">Personas</h3>
        </div>
        <div className="space-y-2">
          <Button 
            variant={activePersona === 'default' ? 'default' : 'ghost'}
            className="w-full justify-start text-foreground hover:text-primary"
            onClick={() => setActivePersona('default')}
          >
            Default User
          </Button>
          <Button
            variant={activePersona === 'expert' ? 'default' : 'ghost'}
            className="w-full justify-start text-foreground hover:text-primary"
            onClick={() => setActivePersona('expert')}
          >
            Expert User
          </Button>
          <Button
            variant={activePersona === 'beginner' ? 'default' : 'ghost'}
            className="w-full justify-start text-foreground hover:text-primary"
            onClick={() => setActivePersona('beginner')}
          >
            Beginner
          </Button>
          <Button 
            variant="outline" 
            className="w-full mt-4 text-primary border-primary/50 hover:text-primary"
          >
            Add Persona
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PromptEditor() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <PromptEditorContent />
    </Suspense>
  )
} 