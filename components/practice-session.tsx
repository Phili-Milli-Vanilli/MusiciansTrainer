"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Music, Clock, BookOpen, FileText, Globe } from "lucide-react"
import { ScaleSelector } from "./scale-selector"

type Exercise = {
  id: number
  category: string
  name: string
  phase: number
  created_at: string
  has_scale_selector?: boolean
}

type PracticeLog = {
  id: number
  exercise_id: number
  date: string
  song?: string
  bpm?: number
  page?: string
  book?: string
  notes?: string
  global_notes?: string
  completed: boolean
  completed_at?: string
  scale_keys?: string[]
  scale_modes?: string[]
  has_scale_selector?: boolean
}

interface PracticeSessionProps {
  exercises: Exercise[]
  selectedDate: string
  practiceLogs: PracticeLog[]
  onSavePracticeLog: (log: Omit<PracticeLog, "id">) => void
  getLastPracticeData: (exerciseId: number) => PracticeLog | null
  getGlobalNotes: (exerciseId: number) => string
  onBack: () => void
}

export function PracticeSession({
  exercises,
  selectedDate,
  practiceLogs,
  onSavePracticeLog,
  getLastPracticeData,
  getGlobalNotes,
  onBack,
}: PracticeSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [practiceData, setPracticeData] = useState<Record<number, Partial<PracticeLog>>>({})

  const currentExercise = exercises[currentExerciseIndex]
  const todayLog = practiceLogs.find((log) => log.exercise_id === currentExercise?.id && log.date === selectedDate)
  const lastPractice = currentExercise ? getLastPracticeData(currentExercise.id) : null

  const getCurrentData = () => {
    if (!currentExercise) return {}

    // Priority: today's saved data > current session data > last practice data
    const baseData = {
      song: todayLog?.song || practiceData[currentExercise.id]?.song || lastPractice?.song || "",
      bpm: todayLog?.bpm || practiceData[currentExercise.id]?.bpm || lastPractice?.bpm || 120,
      page: todayLog?.page || practiceData[currentExercise.id]?.page || lastPractice?.page || "",
      book: todayLog?.book || practiceData[currentExercise.id]?.book || lastPractice?.book || "",
      notes: todayLog?.notes || practiceData[currentExercise.id]?.notes || "",
      global_notes: getGlobalNotes(currentExercise.id),
      completed: todayLog?.completed || practiceData[currentExercise.id]?.completed || false,
    }

    // For scale selections: if exercise is completed, show saved data, otherwise preserve current selections
    if (baseData.completed) {
      // Exercise is completed - show the saved scale data
      return {
        ...baseData,
        scale_keys: todayLog?.scale_keys || [],
        scale_modes: todayLog?.scale_modes || [],
      }
    } else {
      // Exercise not completed - preserve current session selections or show saved incomplete data
      return {
        ...baseData,
        scale_keys: practiceData[currentExercise.id]?.scale_keys || todayLog?.scale_keys || [],
        scale_modes: practiceData[currentExercise.id]?.scale_modes || todayLog?.scale_modes || [],
      }
    }
  }

  const updatePracticeData = (field: string, value: any) => {
    if (!currentExercise) return

    setPracticeData((prev) => ({
      ...prev,
      [currentExercise.id]: {
        ...prev[currentExercise.id],
        [field]: value,
      },
    }))
  }

  const saveCurrent = () => {
    if (!currentExercise) return

    const data = getCurrentData()
    onSavePracticeLog({
      exercise_id: currentExercise.id,
      date: selectedDate,
      song: data.song || undefined,
      bpm: data.bpm || undefined,
      page: data.page || undefined,
      book: data.book || undefined,
      notes: data.notes || undefined,
      global_notes: data.global_notes || undefined,
      completed: data.completed,
      completed_at: data.completed ? new Date().toISOString() : undefined,
      scale_keys: data.scale_keys?.length ? data.scale_keys : undefined,
      scale_modes: data.scale_modes?.length ? data.scale_modes : undefined,
      has_scale_selector: currentExercise.has_scale_selector,
    })
  }

  const nextExercise = () => {
    saveCurrent()
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    }
  }

  const prevExercise = () => {
    saveCurrent()
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  const finishSession = () => {
    saveCurrent()
    onBack()
  }

  if (!currentExercise) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Keine Übungen für heute</h1>
          <Button onClick={onBack}>← Zurück zum Dashboard</Button>
        </div>
      </div>
    )
  }

  const data = getCurrentData()
  const hasScaleSelector =
    currentExercise.has_scale_selector ||
    currentExercise.category.toLowerCase().includes("tonleiter") ||
    currentExercise.name.toLowerCase().includes("tonleiter")

  const currentScaleSelections =
    data.scale_keys && data.scale_modes
      ? data.scale_keys.map((key, index) => ({ key, mode: data.scale_modes![index] })).filter((s) => s.mode)
      : []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Übungssitzung
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("de-DE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {currentExerciseIndex + 1} von {exercises.length}
        </Badge>
      </div>

      {/* Exercise Navigation - Mobile optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          variant="outline"
          onClick={prevExercise}
          disabled={currentExerciseIndex === 0}
          className="border-blue-300 text-blue-600 order-2 sm:order-1"
        >
          ← Vorherige
        </Button>
        <div className="text-center order-1 sm:order-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{currentExercise.name}</h2>
          <p className="text-sm text-muted-foreground">
            {currentExercise.category} • Phase {currentExercise.phase}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={nextExercise}
          disabled={currentExerciseIndex === exercises.length - 1}
          className="border-blue-300 text-blue-600 order-3"
        >
          Nächste →
        </Button>
      </div>

      {/* Scale Selection for scale-related exercises */}
      {hasScaleSelector && (
        <ScaleSelector
          exerciseId={currentExercise.id}
          selectedDate={selectedDate}
          practiceLogs={practiceLogs}
          currentSelections={currentScaleSelections}
          onSelectionsChange={(selections) => {
            const keys = selections.map((s) => s.key)
            const modes = selections.map((s) => s.mode)
            updatePracticeData("scale_keys", keys)
            updatePracticeData("scale_modes", modes)
          }}
        />
      )}

      {/* Practice Form - Mobile optimized */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-green-800">Übungsdetails</CardTitle>
          {lastPractice && !todayLog && (
            <p className="text-sm text-green-600">
              Zuletzt geübt: {new Date(lastPractice.date).toLocaleDateString("de-DE")}
            </p>
          )}
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="song" className="text-gray-700 font-medium flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-500" />
                Lied/Stück
              </Label>
              <Input
                id="song"
                value={data.song}
                onChange={(e) => updatePracticeData("song", e.target.value)}
                placeholder="Was hast du geübt?"
                className="border-green-200 focus:border-green-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bpm" className="text-gray-700 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                BPM
              </Label>
              <Input
                id="bpm"
                type="number"
                value={data.bpm}
                onChange={(e) => updatePracticeData("bpm", Number.parseInt(e.target.value) || 120)}
                min="40"
                max="200"
                className="border-green-200 focus:border-green-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="book" className="text-gray-700 font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" />
                Buch/Methode
              </Label>
              <Input
                id="book"
                value={data.book}
                onChange={(e) => updatePracticeData("book", e.target.value)}
                placeholder="z.B. Hanon, Real Book"
                className="border-green-200 focus:border-green-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page" className="text-gray-700 font-medium">
                Seite
              </Label>
              <Input
                id="page"
                value={data.page}
                onChange={(e) => updatePracticeData("page", e.target.value)}
                placeholder="z.B. 15, 23-25"
                className="border-green-200 focus:border-green-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Sitzungsnotizen
            </Label>
            <Textarea
              id="notes"
              value={data.notes}
              onChange={(e) => updatePracticeData("notes", e.target.value)}
              placeholder="Wie lief diese Übung? Beobachtungen?"
              className="border-green-200 focus:border-green-400"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="global_notes" className="text-gray-700 font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              Globale Notizen (für nächste Woche)
            </Label>
            <Textarea
              id="global_notes"
              value={data.global_notes}
              onChange={(e) => updatePracticeData("global_notes", e.target.value)}
              placeholder="Notizen für das nächste Üben dieser Übung..."
              className="border-blue-200 focus:border-blue-400"
              rows={2}
            />
            <p className="text-xs text-blue-600">Diese Notizen werden jede Woche für diese Übung angezeigt</p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.completed}
                onChange={(e) => updatePracticeData("completed", e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-gray-700 font-medium">Als abgeschlossen markieren</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Mobile optimized */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={saveCurrent}
          variant="outline"
          className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Save className="w-4 h-4 mr-2" />
          Speichern & Fortfahren
        </Button>
        <Button
          onClick={finishSession}
          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          Beenden & Verlassen
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>
          <strong>Speichern & Fortfahren:</strong> Speichert deinen Fortschritt und geht zur nächsten Übung
        </p>
        <p>
          <strong>Beenden & Verlassen:</strong> Speichert alles und kehrt zum Dashboard zurück
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-1">
        {exercises.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded ${
              index === currentExerciseIndex
                ? "bg-blue-500"
                : index < currentExerciseIndex
                  ? "bg-green-500"
                  : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
