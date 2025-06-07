"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Shield, ArrowLeft } from "lucide-react"

type Exercise = {
  id: number
  day: string
  name: string
  bpm: number
  page: string
  book: string
  song?: string
  phase: number
  completed: boolean
  completedAt?: string
}

interface BackupExportProps {
  exercises: Exercise[]
  dayHeaders: Record<string, string>
  categories: string[]
  availablePhases: number[]
  currentPhase: number
  lastBackupDate: string | null
  onExport: () => void
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBack: () => void
}

export function BackupExport({
  exercises,
  dayHeaders,
  categories,
  availablePhases,
  currentPhase,
  lastBackupDate,
  onExport,
  onImport,
  onBack,
}: BackupExportProps) {
  const totalExercises = exercises.length
  const completedExercises = exercises.filter((ex) => ex.completed).length
  const phases = [...new Set(exercises.map((ex) => ex.phase))].sort()

  const daysSinceBackup = lastBackupDate
    ? Math.floor((Date.now() - new Date(lastBackupDate).getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Data Backup & Export
          </h1>
          <p className="text-muted-foreground">Keep your practice data safe across devices</p>
        </div>
      </div>

      {/* Backup Status */}
      <Card
        className={`border-2 ${lastBackupDate ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}
      >
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center gap-2 ${lastBackupDate ? "text-green-800" : "text-yellow-800"}`}>
            <Shield className="w-5 h-5" />
            Backup Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lastBackupDate ? (
              <div>
                <p className="text-green-700 font-medium">
                  Last backup: {new Date(lastBackupDate).toLocaleDateString()}(
                  {daysSinceBackup === 0 ? "Today" : `${daysSinceBackup} days ago`})
                </p>
                {daysSinceBackup && daysSinceBackup >= 7 && (
                  <Badge variant="outline" className="border-yellow-400 text-yellow-700 bg-yellow-100">
                    Consider backing up again
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-yellow-700 font-medium">No backup created yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-blue-800">Your Data Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Exercises:</span>
                <Badge variant="secondary">{totalExercises}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <Badge className="bg-green-100 text-green-800">{completedExercises}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Categories:</span>
                <Badge variant="outline">{categories.length}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Available Phases:</span>
                <Badge variant="outline">{availablePhases.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Current Phase:</span>
                <Badge className="bg-blue-100 text-blue-800">{currentPhase}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Day Headers:</span>
                <Badge variant="outline">{Object.keys(dayHeaders).filter((day) => dayHeaders[day]).length}/7</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Download className="w-5 h-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Download all your exercises, day headers, and settings as a JSON file. This file can be imported on any
            device to restore your data.
          </p>
          <Button onClick={onExport} className="w-full bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Upload className="w-5 h-5" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Restore your data from a previously exported JSON file. This will replace your current data.
          </p>
          <label className="block">
            <Button
              variant="outline"
              className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 cursor-pointer"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Choose File to Import
              </span>
            </Button>
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
          </label>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Backup Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Export your data regularly, especially after adding new exercises</li>
            <li>• Store backup files in cloud storage (Google Drive, iCloud, etc.)</li>
            <li>• The exported file contains all exercises, day headers, and phase settings</li>
            <li>• Import will replace all current data - make sure to export first if needed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
