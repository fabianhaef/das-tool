"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import {
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Add type definitions for tasks
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  type: 'feature' | 'bug' | 'feedback';
  createdAt: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

// Add date formatting helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export default function PlanningPage() {
  const router = useRouter()
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'backlog',
      title: 'Backlog',
      tasks: [
        {
          id: '1',
          title: 'Implement voice recognition',
          description: 'Add speech-to-text functionality for prompt input',
          priority: 'high',
          type: 'feature',
          createdAt: '2024-03-20'
        },
        {
          id: '2',
          title: 'Fix microphone permissions',
          description: 'Handle browser permission requests for microphone access',
          priority: 'medium',
          type: 'bug',
          createdAt: '2024-03-19'
        }
      ]
    },
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        {
          id: '3',
          title: 'Add gesture controls',
          description: 'Implement hand gesture recognition for navigation',
          priority: 'medium',
          type: 'feature',
          createdAt: '2024-03-18'
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        {
          id: '4',
          title: 'Improve UI feedback',
          description: 'Add visual feedback for speech recognition status',
          priority: 'high',
          type: 'feature',
          createdAt: '2024-03-17'
        }
      ]
    },
    {
      id: 'verify',
      title: 'Verify',
      tasks: [
        {
          id: '5',
          title: 'Test speech recognition',
          description: 'Verify accuracy and performance of speech-to-text',
          priority: 'high',
          type: 'feedback',
          createdAt: '2024-03-16'
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        {
          id: '6',
          title: 'Setup project structure',
          description: 'Initialize Next.js project with TypeScript',
          priority: 'high',
          type: 'feature',
          createdAt: '2024-03-15'
        }
      ]
    }
  ])
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    type: 'feature' as const,
  })

  // Function to handle drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceColumn = columns.find(col => col.id === source.droppableId)
    const destColumn = columns.find(col => col.id === destination.droppableId)
    const sourceTasks = [...sourceColumn!.tasks]
    const destTasks = source.droppableId === destination.droppableId 
      ? sourceTasks 
      : [...destColumn!.tasks]
    
    const [removed] = sourceTasks.splice(source.index, 1)
    destTasks.splice(destination.index, 0, removed)

    setColumns(columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: sourceTasks }
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: destTasks }
      }
      return col
    }))
  }

  // Function to get priority color
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
    }
  }

  // Function to get type icon
  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'feature':
        return <Plus className="h-4 w-4" />
      case 'bug':
        return <AlertCircle className="h-4 w-4" />
      case 'feedback':
        return <CheckCircle2 className="h-4 w-4" />
    }
  }

  const handleTaskClick = (task: Task, columnId: string) => {
    // Don't handle clicks for in-progress tasks
    if (columnId === 'in-progress') return

    // Navigate based on column
    if (columnId === 'verify') {
      router.push(`/feedback?task=${encodeURIComponent(JSON.stringify({
        title: task.title,
        description: task.description,
        type: task.type,
        priority: task.priority
      }))}`)
    } else {
      router.push(`/prompting?task=${encodeURIComponent(JSON.stringify({
        title: task.title,
        description: task.description,
        type: task.type,
        priority: task.priority
      }))}`)
    }
  }

  const handleAddTask = (columnId: string) => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      type: newTask.type,
      createdAt: new Date().toISOString(),
    }

    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return { ...col, tasks: [...col.tasks, task] }
      }
      return col
    }))

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      type: 'feature',
    })
    setHoveredColumn(null)
  }

  const isInProgress = (columnId: string) => columnId === 'in-progress'

  // Function to move task between columns
  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    setColumns(prevColumns => {
      const sourceColumn = prevColumns.find(col => col.id === fromColumnId)
      const task = sourceColumn?.tasks.find(t => t.id === taskId)
      
      if (!task) return prevColumns

      return prevColumns.map(col => {
        if (col.id === fromColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId)
          }
        }
        if (col.id === toColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, task]
          }
        }
        return col
      })
    })
  }

  // Effect for automatic task progression
  useEffect(() => {
    let todoTimeout: NodeJS.Timeout
    let inProgressTimeout: NodeJS.Timeout

    const moveFromTodoToInProgress = () => {
      setColumns(prevColumns => {
        const todoColumn = prevColumns.find(col => col.id === 'todo')
        if (!todoColumn?.tasks.length) return prevColumns
        
        const task = todoColumn.tasks[0]
        return prevColumns.map(col => {
          if (col.id === 'todo') {
            return {
              ...col,
              tasks: col.tasks.slice(1)
            }
          }
          if (col.id === 'in-progress') {
            return {
              ...col,
              tasks: [...col.tasks, task]
            }
          }
          return col
        })
      })
    }

    const moveFromInProgressToVerify = () => {
      setColumns(prevColumns => {
        const inProgressColumn = prevColumns.find(col => col.id === 'in-progress')
        if (!inProgressColumn?.tasks.length) return prevColumns
        
        const task = inProgressColumn.tasks[0]
        return prevColumns.map(col => {
          if (col.id === 'in-progress') {
            return {
              ...col,
              tasks: col.tasks.slice(1)
            }
          }
          if (col.id === 'verify') {
            return {
              ...col,
              tasks: [...col.tasks, task]
            }
          }
          return col
        })
      })
    }

    const startMovementCycle = () => {
      // Move from TODO to IN PROGRESS after 5 seconds
      todoTimeout = setTimeout(() => {
        moveFromTodoToInProgress()
        
        // Then move from IN PROGRESS to VERIFY after 8 more seconds
        inProgressTimeout = setTimeout(() => {
          moveFromInProgressToVerify()
        }, 8000)
      }, 5000)
    }

    startMovementCycle()

    return () => {
      clearTimeout(todoTimeout)
      clearTimeout(inProgressTimeout)
    }
  }, []) // Empty dependency array since we want this to run once on mount

  return (
    <div className="h-[calc(100vh-4rem)] p-4 bg-black/90 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-primary glow-text">Project Planning</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full overflow-x-auto pb-4">
            {columns.map(column => (
              <div 
                key={column.id} 
                className="flex-1 min-w-[300px]"
                onMouseEnter={() => !isInProgress(column.id) && setHoveredColumn(column.id)}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                <Card className="hologram p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-primary glow-text">{column.title}</h3>
                    <span className="text-xs text-muted-foreground">{column.tasks.length}</span>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 overflow-y-auto"
                      >
                        <div className="space-y-2">
                          {column.tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`hologram p-3 rounded-lg transition-colors ${
                                    isInProgress(column.id) 
                                      ? 'opacity-75 cursor-not-allowed' 
                                      : 'cursor-pointer hover:bg-primary/10'
                                  }`}
                                  onClick={() => handleTaskClick(task, column.id)}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className={`mt-1 ${getPriorityColor(task.priority)}`}>
                                      {isInProgress(column.id) ? (
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                      ) : (
                                        getTypeIcon(task.type)
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-foreground">
                                        {task.title}
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {task.description}
                                      </div>
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] text-muted-foreground">
                                          {formatDate(task.createdAt)}
                                        </span>
                                        <span className={`text-[10px] ${getPriorityColor(task.priority)}`}>
                                          {task.priority}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {hoveredColumn === column.id && !isInProgress(column.id) && (
                            <div className="hologram p-3 rounded-lg mt-2 space-y-2">
                              <Input
                                placeholder="Task title..."
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="bg-black/50 border-primary/30 text-foreground placeholder:text-muted-foreground"
                              />
                              <Textarea
                                placeholder="Task description..."
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="min-h-[60px] bg-black/50 border-primary/30 text-foreground placeholder:text-muted-foreground"
                              />
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-primary border-primary/50"
                                  onClick={() => handleAddTask(column.id)}
                                >
                                  Add Task
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-foreground hover:text-primary"
                                  onClick={() => setHoveredColumn(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </Card>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
} 