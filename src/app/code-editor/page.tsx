"use client"

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Code,
  AlertTriangle,
  X,
  Play,
  Save,
  FileCode,
  Layers,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldAlert
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CodeEditorPage() {
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(true)
  const [code, setCode] = useState(`// Write your code here
function helloWorld() {
  console.log("Hello, world!");
}

helloWorld();`)
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState('dark')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [inputValues, setInputValues] = useState({
    firstInput: '',
    secondInput: ''
  })
  const [error, setError] = useState('')

  // Confirm dialog
  const handleConfirm = () => {
    if (inputValues.firstInput.trim().toLowerCase() !== 'i want to code') {
      setError('Please type the exact verification phrases')
      return
    }
    
    if (inputValues.secondInput.trim().toLowerCase() !== 'i can code') {
      setError('Please type the exact verification phrases')
      return
    }
    
    setError('')
    setShowConfirmation(false)
  }

  const handleCancel = () => {
    router.back()
  }

  const handleInputChange = (field: 'firstInput' | 'secondInput', value: string) => {
    setInputValues({
      ...inputValues,
      [field]: value
    })
    
    // Clear error when user starts typing
    if (error) setError('')
  }

  // Mock function to run code
  const runCode = () => {
    setIsRunning(true)
    setOutput('')
    
    // Simulate code execution with delay
    setTimeout(() => {
      setOutput(`Running ${language} code...\n\nOutput:\nHello, world!\n\nExecution completed in 0.12s`)
      setIsRunning(false)
    }, 1200)
  }

  // Create a very basic editor with textarea (in a real app, you'd use a proper code editor like Monaco)
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 bg-black/90">
      {showConfirmation ? (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="hologram w-[500px] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="h-6 w-6" />
              <h2 className="text-lg font-semibold">Code Editing Confirmation</h2>
            </div>
            
            <div className="text-muted-foreground mb-2">
              <p className="mb-4">
                Editing code directly can affect the applicationapplication's functionality. Please confirm you understand the risks.
              </p>
              <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-md text-amber-200 flex items-start gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  You are about to edit the applications source code. This requires careful attention as 
                  incorrect changes can cause errors or unexpected behavior.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-blue-300 mb-1 block">
                  Type: I want to code to continue:
                </label>
                <Input
                  value={inputValues.firstInput}
                  onChange={(e) => handleInputChange('firstInput', e.target.value)}
                  className="bg-black/50 border-primary/30 text-foreground"
                  placeholder="Type the exact phrase"
                />
              </div>
              
              <div>
                <label className="text-sm text-blue-300 mb-1 block">
                  Type &quot;I can code&quot; to continue:
                </label>
                <Input
                  value={inputValues.secondInput}
                  onChange={(e) => handleInputChange('secondInput', e.target.value)}
                  className="bg-black/50 border-primary/30 text-foreground"
                  placeholder="Type the exact phrase"
                />
              </div>
              
              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="text-foreground border-primary/30"
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleConfirm}
                className="bg-amber-600/80 hover:bg-amber-500/80"
              >
                <Code className="h-4 w-4 mr-2" /> Proceed to Editor
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-primary glow-text flex items-center">
              <FileCode className="h-5 w-5 mr-2" /> Code Editor
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-foreground border-primary/30 hover:text-primary"
                onClick={runCode}
                disabled={isRunning}
              >
                {isRunning ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-foreground border-primary/30 hover:text-primary"
              >
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 flex-1 gap-4 overflow-hidden">
            <Card className="hologram p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-muted/50 border-none text-xs p-1 rounded text-foreground"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                  </select>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="bg-muted/50 border-none text-xs p-1 rounded text-foreground"
                  >
                    <option value="dark">Dark Theme</option>
                    <option value="light">Light Theme</option>
                    <option value="dracula">Dracula</option>
                  </select>
                </div>
                <div className="text-xs text-muted-foreground">
                  <Layers className="h-3 w-3 inline mr-1" /> Editor
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-muted/30 p-4 rounded text-sm font-mono text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                spellCheck="false"
              />
            </Card>

            <Card className="hologram p-4 flex flex-col h-full">
              <Tabs defaultValue="output" className="flex-1 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="h-7 bg-muted/30">
                    <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
                  </TabsList>
                  <div className="text-xs text-muted-foreground">
                    <Eye className="h-3 w-3 inline mr-1" /> Console
                  </div>
                </div>

                <TabsContent value="output" className="flex-1 flex flex-col">
                  <div className="flex-1 bg-muted/30 p-4 rounded font-mono text-sm text-foreground overflow-auto whitespace-pre-wrap">
                    {output || 'Run code to see output here...'}
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="flex-1 flex flex-col">
                  <div className="flex-1 bg-muted/30 p-4 rounded overflow-auto">
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      {language === 'html' ? (
                        <iframe
                          srcDoc={code}
                          title="preview"
                          className="w-full h-full bg-white rounded"
                          sandbox="allow-scripts"
                        />
                      ) : (
                        <div className="text-center">
                          <EyeOff className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>Preview not available for {language}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </>
      )}
    </div>
  )
} 