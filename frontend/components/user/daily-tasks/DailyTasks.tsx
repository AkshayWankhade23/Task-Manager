"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Calendar, CheckSquare } from "lucide-react"
import Modal from "@/components/common/modal"
import { useRouter } from "next/navigation"

interface Project {
  id: string
  name: string
  createdDate: string
  taskCount: number
}

const DailyTasks: React.FC = () => {
    const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      createdDate: "2024-01-15",
      taskCount: 12,
    },
    {
      id: "2",
      name: "Mobile App Development",
      createdDate: "2024-01-10",
      taskCount: 8,
    },
    {
      id: "3",
      name: "Marketing Campaign",
      createdDate: "2024-01-08",
      taskCount: 15,
    },
  ])

  const handleCreateProject = () => {
    if (projectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectName.trim(),
        createdDate: new Date().toISOString().split("T")[0],
        taskCount: 0,
      }
      setProjects([newProject, ...projects])
      setProjectName("")
      setIsModalOpen(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Create Project Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task</h1>
          <p className="text-gray-600 mt-1">Manage your projects and track progress</p>
        </div>
        <button
          onClick={() => router.push('/user/create-task')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Project Name */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4 truncate">{project.name}</h3>

            {/* Project Details */}
            <div className="space-y-3">
              {/* Created Date */}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Created {formatDate(project.createdDate)}</span>
              </div>

              {/* Task Count */}
              <div className="flex items-center gap-2 text-gray-600">
                <CheckSquare className="w-4 h-4" />
                <span className="text-sm">
                  {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
                </span>
              </div>
            </div>

            {/* Progress Bar (placeholder) */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setProjectName("")
        }}
        title="Create New Project"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsModalOpen(false)
                setProjectName("")
              }}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              disabled={!projectName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Create Task
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DailyTasks
