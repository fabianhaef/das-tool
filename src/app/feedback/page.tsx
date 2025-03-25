"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

import {
  MessageSquare,
  RefreshCcw,
  Plus,
  Check,
  ListFilter,
  AlertCircle,
  Clock,
  Activity,
  Cpu,
  MemoryStick,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  type: 'feature' | 'bug' | 'feedback';
  createdAt: string;
}

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running';
  duration: number;
  error?: string;
  timestamp: string;
}

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  responseTime: number;
  throughput: number;
  timestamp: string;
}

// Sample test data
const testData: TestResult[] = [
  {
    id: '1',
    name: 'Speech Recognition Accuracy',
    status: 'passed',
    duration: 2.5,
    timestamp: '2024-03-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'Microphone Permission Handling',
    status: 'failed',
    duration: 1.8,
    error: 'Permission denied in Chrome browser',
    timestamp: '2024-03-20T10:30:05Z'
  },
  {
    id: '3',
    name: 'UI Feedback Updates',
    status: 'running',
    duration: 0,
    timestamp: '2024-03-20T10:30:10Z'
  }
]

// Sample performance metrics
const performanceData: PerformanceMetrics[] = [
  {
    cpu: 45,
    memory: 60,
    responseTime: 120,
    throughput: 850,
    timestamp: '2024-03-20T10:30:00Z'
  },
  {
    cpu: 52,
    memory: 65,
    responseTime: 135,
    throughput: 820,
    timestamp: '2024-03-20T10:30:05Z'
  },
  {
    cpu: 48,
    memory: 62,
    responseTime: 125,
    throughput: 840,
    timestamp: '2024-03-20T10:30:10Z'
  }
]

export default function FeedbackLoop() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskFilter, setTaskFilter] = useState('all')
  const [showTestMonitor, setShowTestMonitor] = useState(false)
  
  // Handle task data from URL
  useEffect(() => {
    const taskParam = searchParams.get('task')
    if (taskParam) {
      try {
        const task = JSON.parse(decodeURIComponent(taskParam))
        setSelectedTask(task)
      } catch (error) {
        console.error('Failed to parse task data:', error)
      }
    }
  }, [searchParams])

  const handleAccept = () => {
    if (selectedTask) {
      // Here you would typically update the task status in your backend
      // For now, we'll just navigate back to the planning view
      router.push('/planning')
    }
  }

  const handleDeclineAndRefine = () => {
    if (selectedTask) {
      // Navigate to prompting view with the task data
      const taskParam = encodeURIComponent(JSON.stringify(selectedTask))
      router.push(`/prompting?task=${taskParam}`)
    }
  }
  
  // Helper to render badge for task type
  const getTaskTypeBadge = (type: Task['type']) => {
    switch (type) {
      case 'feature':
        return (
          <div className="flex items-center">
            <Plus className="h-3 w-3 mr-1 text-blue-400" />
            <span>Feature</span>
          </div>
        )
      case 'bug':
        return (
          <div className="flex items-center">
            <AlertCircle className="h-3 w-3 mr-1 text-red-400" />
            <span>Bug</span>
          </div>
        )
      case 'feedback':
        return (
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1 text-purple-400" />
            <span>Feedback</span>
          </div>
        )
      default:
        return null
    }
  }
  
  // Helper to render badge for task priority
  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-sm text-[10px]">High</span>
      case 'medium':
        return <span className="bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-sm text-[10px]">Medium</span>
      case 'low':
        return <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-sm text-[10px]">Low</span>
      default:
        return null
    }
  }
  
  // Helper to render test status badge
  const getTestStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-sm text-[10px]">Passed</span>
      case 'failed':
        return <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-sm text-[10px]">Failed</span>
      case 'running':
        return <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-sm text-[10px]">Running</span>
      default:
        return null
    }
  }
  
  // Helper to format dates safely
  const formatDateSafely = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid before calling toISOString
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toISOString().replace('T', ' ').slice(0, 19);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  }

  // Helper to format times safely
  const formatTimeSafely = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        return "Invalid time";
      }
      return date.toISOString().slice(11, 19);
    } catch (error) {
      console.error("Time formatting error:", error);
      return "Invalid time";
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 p-4 bg-black/90">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary glow-text">Test Status Monitor</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-foreground border-primary/30 hover:text-primary"
          >
            <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: Task List */}
        <div className="w-1/3 flex flex-col gap-4">
          <Card className="hologram p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-primary flex items-center">
                <ListFilter className="h-4 w-4 mr-1" /> Tasks to Verify
              </h2>
              <div className="flex items-center gap-2">
                <div className="bg-muted/30 rounded-full px-2 py-0.5 text-xs text-foreground">
                  {testData.length} items
                </div>
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                  className="bg-muted/50 border-none text-xs p-1 rounded text-foreground"
                >
                  <option value="all">All Types</option>
                  <option value="feature">Features</option>
                  <option value="bug">Bugs</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2 max-h-[calc(100vh-15rem)] overflow-y-auto pr-2">
              {testData.map((test) => (
                <div 
                  key={test.id} 
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTask?.id === test.id 
                      ? 'bg-muted/30 border border-primary/50' 
                      : 'bg-muted/20 hover:bg-muted/20 border border-transparent'
                  }`}
                  onClick={() => {
                    // Create a task object from the test result
                    const timestamp = new Date().toISOString(); // Fallback timestamp
                    const task: Task = {
                      id: test.id,
                      title: test.name,
                      description: test.error || 'No description available',
                      priority: test.status === 'failed' ? 'high' : 'medium',
                      type: 'bug',
                      createdAt: test.timestamp || timestamp // Use test timestamp or fallback
                    }
                    setSelectedTask(task)
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-foreground text-sm">{test.name}</div>
                    {getTestStatusBadge(test.status)}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-muted-foreground">
                      Duration: {test.duration}s
                    </div>
                    <div className="text-muted-foreground">
                      {formatTimeSafely(test.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Right: Test Details */}
        <div className="w-2/3 flex flex-col gap-4 min-h-0">
          <Card className="hologram p-4 flex-1">
            <Tabs defaultValue="details" className="flex-1 h-full">
              <TabsList className="w-full justify-start h-8 bg-blue-900/20">
                <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                <TabsTrigger value="status" className="text-xs">Test Status</TabsTrigger>
                <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
              </TabsList>
              
              {/* Details Tab */}
              <TabsContent value="details" className="flex-1 mt-4">
                {selectedTask && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-blue-400">Type</div>
                        <div className="text-sm text-blue-300 bg-blue-950/50 rounded px-2 py-1 inline-flex items-center">
                          {getTaskTypeBadge(selectedTask.type)}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-blue-400">Priority</div>
                        <div className="text-sm">
                          {getPriorityBadge(selectedTask.priority)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-blue-400">Description</div>
                      <div className="text-sm text-blue-100 bg-blue-950/30 p-3 rounded">
                        {selectedTask.description}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-blue-400">Created At</div>
                      <div className="text-sm text-blue-100 bg-blue-950/30 p-3 rounded">
                        {selectedTask ? formatDateSafely(selectedTask.createdAt) : "No date available"}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeclineAndRefine}
                        className="text-red-400 border-red-400/30 hover:text-red-300"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" /> Decline and Refine
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleAccept}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
                      >
                        <Check className="h-4 w-4 mr-1" /> Accept
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              {/* Test Status Tab */}
              <TabsContent value="status" className="flex-1 space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-950/30 p-4 rounded-lg">
                    <div className="text-xs text-blue-400 mb-1">Total Tests</div>
                    <div className="text-2xl font-mono text-blue-300">{testData.length}</div>
                  </div>
                  
                  <div className="bg-emerald-950/30 p-4 rounded-lg">
                    <div className="text-xs text-emerald-400 mb-1">Passed</div>
                    <div className="text-2xl font-mono text-emerald-300">
                      {testData.filter(t => t.status === 'passed').length}
                    </div>
                  </div>
                  
                  <div className="bg-red-950/30 p-4 rounded-lg">
                    <div className="text-xs text-red-400 mb-1">Failed</div>
                    <div className="text-2xl font-mono text-red-300">
                      {testData.filter(t => t.status === 'failed').length}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-sm text-blue-300">Failed Tests</div>
                  {testData.filter(t => t.status === 'failed').map(test => (
                    <div key={test.id} className="bg-red-950/30 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-red-300">{test.name}</div>
                        <div className="text-xs text-red-400">{test.duration}s</div>
                      </div>
                      <div className="text-sm text-red-200 font-mono mt-2">
                        {test.error}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Performance Tab */}
              <TabsContent value="performance" className="flex-1 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-950/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Cpu className="h-4 w-4 text-blue-400 mr-2" />
                      <div className="text-sm text-blue-300">CPU Usage</div>
                    </div>
                    <div className="text-2xl font-mono text-blue-300">
                      {performanceData[performanceData.length - 1].cpu}%
                    </div>
                    <div className="text-xs text-blue-400 mt-1">
                      Average: {performanceData.reduce((acc, curr) => acc + curr.cpu, 0) / performanceData.length}%
                    </div>
                  </div>
                  
                  <div className="bg-blue-950/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <MemoryStick className="h-4 w-4 text-blue-400 mr-2" />
                      <div className="text-sm text-blue-300">Memory Usage</div>
                    </div>
                    <div className="text-2xl font-mono text-blue-300">
                      {performanceData[performanceData.length - 1].memory}%
                    </div>
                    <div className="text-xs text-blue-400 mt-1">
                      Average: {performanceData.reduce((acc, curr) => acc + curr.memory, 0) / performanceData.length}%
                    </div>
                  </div>
                  
                  <div className="bg-blue-950/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-blue-400 mr-2" />
                      <div className="text-sm text-blue-300">Response Time</div>
                    </div>
                    <div className="text-2xl font-mono text-blue-300">
                      {performanceData[performanceData.length - 1].responseTime}ms
                    </div>
                    <div className="text-xs text-blue-400 mt-1">
                      Average: {performanceData.reduce((acc, curr) => acc + curr.responseTime, 0) / performanceData.length}ms
                    </div>
                  </div>
                  
                  <div className="bg-blue-950/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Activity className="h-4 w-4 text-blue-400 mr-2" />
                      <div className="text-sm text-blue-300">Throughput</div>
                    </div>
                    <div className="text-2xl font-mono text-blue-300">
                      {performanceData[performanceData.length - 1].throughput} req/s
                    </div>
                    <div className="text-xs text-blue-400 mt-1">
                      Average: {performanceData.reduce((acc, curr) => acc + curr.throughput, 0) / performanceData.length} req/s
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Details Tab */}
              <TabsContent value="details" className="flex-1 mt-4">
                {selectedTask && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-blue-400">Type</div>
                        <div className="text-sm text-blue-300 bg-blue-950/50 rounded px-2 py-1 inline-flex items-center">
                          {getTaskTypeBadge(selectedTask.type)}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-blue-400">Priority</div>
                        <div className="text-sm">
                          {getPriorityBadge(selectedTask.priority)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-blue-400">Description</div>
                      <div className="text-sm text-blue-100 bg-blue-950/30 p-3 rounded">
                        {selectedTask.description}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-blue-400">Created At</div>
                      <div className="text-sm text-blue-100 bg-blue-950/30 p-3 rounded">
                        {selectedTask ? formatDateSafely(selectedTask.createdAt) : "No date available"}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
} 