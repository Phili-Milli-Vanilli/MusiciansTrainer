"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Target, AlertTriangle } from "lucide-react"

type Exercise = {
  id: number
  category: string
  name: string
  bpm: number
  page: string
  book: string
  song?: string
  phase: number
  completed: boolean
  completedAt?: string
}

interface PhasesViewProps {
  availablePhases: number[]
  exercises: Exercise[]
  currentPhase: number
  onAddPhase: (phase: number) => void
  onRemovePhase: (phase: number) => void
  onBack: () => void
}

export function PhasesView({
  availablePhases,
  exercises,
  currentPhase,
  onAddPhase,
  onRemovePhase,
  onBack,
}: PhasesViewProps) {
  const [newPhase, setNewPhase] = useState("")

  const handleAddPhase = () => {
    const phaseNumber = Number.parseInt(newPhase)
    if (phaseNumber && phaseNumber > 0 && !availablePhases.includes(phaseNumber)) {
      onAddPhase(phaseNumber)
      setNewPhase("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddPhase()
    }
  }

  const getExerciseCountForPhase = (phase: number) => {
    return exercises.filter((ex) => ex.phase === phase).length
  }

  const getCompletedCountForPhase = (phase: number) => {
    return exercises.filter((ex) => ex.phase === phase && ex.completed).length
  }

  const getNextAvailablePhase = () => {
    const maxPhase = Math.max(...availablePhases, 0)
    return maxPhase + 1
  }

  const canRemovePhase = (phase: number) => {
    return getExerciseCountForPhase(phase) === 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Manage Phases
          </h1>
          <p className="text-sm text-muted-foreground">Create and organize your practice phases</p>
        </div>
      </div>

      {/* Add New Phase */}
      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Plus className="w-5 h-5" />
            Add New Phase
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="newPhase" className="text-gray-700 font-medium">
                  Phase Number
                </Label>
                <Input
                  id="newPhase"
                  type="number"
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`e.g., ${getNextAvailablePhase()}`}
                  min="1"
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddPhase}
                  disabled={
                    !newPhase || Number.parseInt(newPhase) <= 0 || availablePhases.includes(Number.parseInt(newPhase))
                  }
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Add Phase
                </Button>
              </div>
            </div>

            {/* Quick Add Suggestions */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Quick add:</Label>
              <div className="flex flex-wrap gap-2">
                {[getNextAvailablePhase(), getNextAvailablePhase() + 1, getNextAvailablePhase() + 2].map(
                  (suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => onAddPhase(suggestion)}
                      disabled={availablePhases.includes(suggestion)}
                      className="text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Phase {suggestion}
                    </Button>
                  ),
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Phases */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="w-5 h-5" />
            Your Phases ({availablePhases.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {availablePhases.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No phases available. Add at least one phase to organize your exercises!
            </p>
          ) : (
            <div className="space-y-3">
              {availablePhases.map((phase) => {
                const exerciseCount = getExerciseCountForPhase(phase)
                const completedCount = getCompletedCountForPhase(phase)
                const completionRate = exerciseCount > 0 ? Math.round((completedCount / exerciseCount) * 100) : 0
                const isCurrentPhase = phase === currentPhase
                const canRemove = canRemovePhase(phase)

                return (
                  <div
                    key={phase}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                      isCurrentPhase
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Badge
                        className={
                          isCurrentPhase
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }
                      >
                        Phase {phase}
                      </Badge>
                      {isCurrentPhase && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">Current</Badge>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {exerciseCount} exercises
                        {exerciseCount > 0 && (
                          <span className="ml-2">
                            • {completionRate}% complete ({completedCount}/{exerciseCount})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!canRemove && (
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                          <AlertTriangle className="w-3 h-3" />
                          Has exercises
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemovePhase(phase)}
                        disabled={!canRemove}
                        className={
                          canRemove
                            ? "border-red-300 text-red-600 hover:bg-red-50"
                            : "border-gray-300 text-gray-400 cursor-not-allowed"
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">💡 How Phases Work</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • Create phases to organize exercises by difficulty level (Phase 1 = Beginner, Phase 2 = Intermediate,
              etc.)
            </li>
            <li>• Switch between phases to see different sets of exercises</li>
            <li>• You can only remove phases that have no exercises</li>
            <li>• Add new phases as you progress in your musical journey</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
