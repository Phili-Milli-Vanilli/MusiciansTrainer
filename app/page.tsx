"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Music, BookOpen, Clock, TrendingUp, Plus } from "lucide-react"
import { WeeklyOverview } from "@/components/weekly-overview"
import { ExerciseForm } from "@/components/exercise-form"
import { ProgressView } from "@/components/progress-view"
import { CategoriesView } from "@/components/categories-view"
import { PhasesView } from "@/components/phases-view"
import { PracticeSession } from "@/components/practice-session"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OfflineIndicator } from "@/components/offline-indicator"

type Exercise = {
  id: number
  category: string
  name: string
  phase: number
  created_at: string
}

type PracticeLog = {
  id: number
  exercise_id: number
  date: string // YYYY-MM-DD format
  song?: string
  bpm?: number
  page?: string
  book?: string
  notes?: string
  global_notes?: string // Add this for weekly notes
  completed: boolean
  completed_at?: string
  scale_keys?: string[] // Change to array
  scale_modes?: string[] // Change to array
  has_scale_selector?: boolean // Add this
}

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

export default function MusicianTrainingApp() {
  const [currentView, setCurrentView] = useState<
    | "dashboard"
    | "weekly"
    | "add-exercise"
    | "progress"
    | "edit-exercise"
    | "categories"
    | "phases"
    | "backup"
    | "practice-session"
  >("dashboard")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([])
  const [currentDay, setCurrentDay] = useState("")
  const [currentPhase, setCurrentPhase] = useState(1)
  const [availablePhases, setAvailablePhases] = useState<number[]>([1, 2, 3, 4, 5])
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [dayHeaders, setDayHeaders] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [showBackupReminder, setShowBackupReminder] = useState(false)
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0] // Today's date in YYYY-MM-DD format
  })

  // Load data from localStorage
  useEffect(() => {
    const savedHeaders = localStorage.getItem("dayHeaders")
    if (savedHeaders) {
      setDayHeaders(JSON.parse(savedHeaders))
    }

    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      // Initialize with default categories
      const defaultCategories = ["Akkorde", "Tonleitern", "Technik", "Jazz", "Vom-Blatt-Spiel", "Lieder", "Theorie"]
      setCategories(defaultCategories)
      localStorage.setItem("categories", JSON.stringify(defaultCategories))
    }

    const savedPhases = localStorage.getItem("availablePhases")
    if (savedPhases) {
      setAvailablePhases(JSON.parse(savedPhases))
    } else {
      localStorage.setItem("availablePhases", JSON.stringify([1, 2, 3, 4, 5]))
    }

    const savedPracticeLogs = localStorage.getItem("practiceLogs")
    if (savedPracticeLogs) {
      setPracticeLogs(JSON.parse(savedPracticeLogs))
    }
  }, [])

  const updateDayHeader = (day: string, header: string) => {
    const updatedHeaders = { ...dayHeaders, [day]: header }
    setDayHeaders(updatedHeaders)
    localStorage.setItem("dayHeaders", JSON.stringify(updatedHeaders))
  }

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      const updatedCategories = [...categories, category].sort()
      setCategories(updatedCategories)
      localStorage.setItem("categories", JSON.stringify(updatedCategories))
    }
  }

  const removeCategory = (category: string) => {
    const updatedCategories = categories.filter((cat) => cat !== category)
    setCategories(updatedCategories)
    localStorage.setItem("categories", JSON.stringify(updatedCategories))
  }

  const addPhase = (phase: number) => {
    if (!availablePhases.includes(phase)) {
      const updatedPhases = [...availablePhases, phase].sort((a, b) => a - b)
      setAvailablePhases(updatedPhases)
      localStorage.setItem("availablePhases", JSON.stringify(updatedPhases))
    }
  }

  const removePhase = (phase: number) => {
    // Don't allow removing phase if exercises exist in it
    const exercisesInPhase = exercises.filter((ex) => ex.phase === phase)
    if (exercisesInPhase.length > 0) {
      alert(`Phase ${phase} kann nicht entfernt werden, da sie ${exercisesInPhase.length} Übungen enthält.`)
      return
    }

    const updatedPhases = availablePhases.filter((p) => p !== phase)
    setAvailablePhases(updatedPhases)
    localStorage.setItem("availablePhases", JSON.stringify(updatedPhases))

    // If current phase was removed, switch to phase 1
    if (currentPhase === phase) {
      setCurrentPhase(1)
      localStorage.setItem("currentPhase", "1")
    }
  }

  useEffect(() => {
    // Get current day
    const today = new Date()
    const dayName = DAYS[today.getDay() === 0 ? 6 : today.getDay() - 1]
    setCurrentDay(dayName)

    // Load exercises and current phase from localStorage
    const savedExercises = localStorage.getItem("musicExercises")
    const savedPhase = localStorage.getItem("currentPhase")

    if (savedPhase) {
      setCurrentPhase(Number.parseInt(savedPhase))
    }

    if (savedExercises) {
      setExercises(JSON.parse(savedExercises))
    } else {
      // Initialize with sample exercises (templates)
      const sampleExercises: Exercise[] = [
        {
          id: 1,
          category: "Akkorde",
          name: "Akkordfolgen",
          phase: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          category: "Tonleitern",
          name: "Tonleiterübung",
          phase: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          category: "Technik",
          name: "Fingerunabhängigkeit",
          phase: 1,
          created_at: new Date().toISOString(),
        },
      ]
      setExercises(sampleExercises)
      localStorage.setItem("musicExercises", JSON.stringify(sampleExercises))
    }
  }, [])

  useEffect(() => {
    const lastBackup = localStorage.getItem("lastBackupDate")
    setLastBackupDate(lastBackup)

    // Show reminder if no backup in last 7 days or never backed up
    if (!lastBackup) {
      setShowBackupReminder(true)
    } else {
      const daysSinceBackup = Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceBackup >= 7) {
        setShowBackupReminder(true)
      }
    }
  }, [exercises.length, practiceLogs.length])

  // Filter exercises by current phase
  const currentPhaseExercises = exercises.filter((ex) => ex.phase === currentPhase)

  // Get the day of week for selected date
  const selectedDateObj = new Date(selectedDate + "T12:00:00") // Use noon to avoid timezone issues
  const selectedDayOfWeek = DAYS[selectedDateObj.getDay() === 0 ? 6 : selectedDateObj.getDay() - 1]
  const selectedDayCategory = dayHeaders[selectedDayOfWeek]

  // Show exercises for ANY day, not just days with categories
  const selectedDayExercises = selectedDayCategory
    ? currentPhaseExercises.filter((ex) => ex.category === selectedDayCategory)
    : [] // Empty array if no category is assigned

  // Get practice logs for selected date
  const getLogsForDate = (date: string) => {
    return practiceLogs.filter((log) => log.date === date)
  }

  // Get last practice data for an exercise (for pre-filling)
  const getLastPracticeData = (exerciseId: number) => {
    const exerciseLogs = practiceLogs
      .filter((log) => log.exercise_id === exerciseId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return exerciseLogs[0] || null
  }

  // Get global notes for an exercise (latest global notes from any practice log)
  const getGlobalNotes = (exerciseId: number) => {
    const exerciseLogs = practiceLogs
      .filter((log) => log.exercise_id === exerciseId && log.global_notes)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return exerciseLogs[0]?.global_notes || ""
  }

  const addExercise = (exercise: Omit<Exercise, "id" | "created_at">) => {
    const newExercise = {
      ...exercise,
      id: Date.now(),
      created_at: new Date().toISOString(),
    }
    const updatedExercises = [...exercises, newExercise]
    setExercises(updatedExercises)
    localStorage.setItem("musicExercises", JSON.stringify(updatedExercises))
    setCurrentView("dashboard")
    setShowBackupReminder(true)
  }

  const updateExercise = (updatedExercise: Exercise) => {
    const updatedExercises = exercises.map((ex) => (ex.id === updatedExercise.id ? updatedExercise : ex))
    setExercises(updatedExercises)
    localStorage.setItem("musicExercises", JSON.stringify(updatedExercises))
    setEditingExercise(null)
    setCurrentView("dashboard")
    setShowBackupReminder(true)
  }

  const savePracticeLog = (log: Omit<PracticeLog, "id">) => {
    // Remove existing log for same exercise and date
    const filteredLogs = practiceLogs.filter(
      (existingLog) => !(existingLog.exercise_id === log.exercise_id && existingLog.date === log.date),
    )

    const newLog = {
      ...log,
      id: Date.now(),
    }

    const updatedLogs = [...filteredLogs, newLog]
    setPracticeLogs(updatedLogs)
    localStorage.setItem("practiceLogs", JSON.stringify(updatedLogs))
    setShowBackupReminder(true)
  }

  const changePhase = (newPhase: number) => {
    setCurrentPhase(newPhase)
    localStorage.setItem("currentPhase", newPhase.toString())
  }

  const startEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setCurrentView("edit-exercise")
  }

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate + "T12:00:00") // Use noon to avoid timezone issues
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  const isToday = selectedDate === new Date().toISOString().split("T")[0]

  const exportData = () => {
    const data = {
      exercises,
      practiceLogs,
      dayHeaders,
      categories,
      availablePhases,
      currentPhase,
      exportDate: new Date().toISOString(),
      version: "2.0",
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `musik-uebung-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Update last backup date
    const now = new Date().toISOString()
    localStorage.setItem("lastBackupDate", now)
    setLastBackupDate(now)
    setShowBackupReminder(false)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.exercises && Array.isArray(data.exercises)) {
          setExercises(data.exercises)
          localStorage.setItem("musicExercises", JSON.stringify(data.exercises))
        }

        if (data.practiceLogs && Array.isArray(data.practiceLogs)) {
          setPracticeLogs(data.practiceLogs)
          localStorage.setItem("practiceLogs", JSON.stringify(data.practiceLogs))
        }

        if (data.dayHeaders) {
          setDayHeaders(data.dayHeaders)
          localStorage.setItem("dayHeaders", JSON.stringify(data.dayHeaders))
        }

        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories)
          localStorage.setItem("categories", JSON.stringify(data.categories))
        }

        if (data.availablePhases && Array.isArray(data.availablePhases)) {
          setAvailablePhases(data.availablePhases)
          localStorage.setItem("availablePhases", JSON.stringify(data.availablePhases))
        }

        if (data.currentPhase) {
          setCurrentPhase(data.currentPhase)
          localStorage.setItem("currentPhase", data.currentPhase.toString())
        }

        alert("Daten erfolgreich importiert!")
        setShowBackupReminder(false)
      } catch (error) {
        alert("Fehler beim Importieren der Daten. Bitte überprüfen Sie das Dateiformat.")
      }
    }
    reader.readAsText(file)

    // Reset the input
    event.target.value = ""
  }

  const renderDashboard = () => {
    const todaysLogs = getLogsForDate(selectedDate)

    return (
      <div className="space-y-6">
        {/* Phase Selection - Mobile optimized */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-blue-900">Aktuelle Phase</h3>
                <p className="text-sm text-blue-700">Phase {currentPhase}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {availablePhases.length <= 3 ? (
                  // Show buttons for 3 or fewer phases - stack on mobile
                  <div className="grid grid-cols-2 sm:flex gap-2">
                    {availablePhases.map((phase) => (
                      <Button
                        key={phase}
                        variant={phase === currentPhase ? "default" : "outline"}
                        size="sm"
                        onClick={() => changePhase(phase)}
                        className={
                          phase === currentPhase
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "border-blue-300 text-blue-600 hover:bg-blue-50"
                        }
                      >
                        Phase {phase}
                      </Button>
                    ))}
                  </div>
                ) : (
                  // Show dropdown for more than 3 phases
                  <Select
                    value={currentPhase.toString()}
                    onValueChange={(value) => changePhase(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full sm:w-32 border-blue-300 focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePhases.map((phase) => (
                        <SelectItem key={phase} value={phase.toString()}>
                          Phase {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Navigation - Mobile optimized */}
        <Card className="border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="text-purple-600 hover:bg-purple-100 px-2 sm:px-4"
              >
                ←
              </Button>
              <div className="text-center flex-1 px-2">
                <CardTitle className="text-purple-800 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm sm:text-base">
                  <span className="text-center">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("de-DE", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  {isToday && <Badge className="bg-green-100 text-green-800 text-xs">Heute</Badge>}
                </CardTitle>
                {selectedDayCategory && (
                  <p className="text-sm text-purple-600 font-medium mt-1">{selectedDayCategory}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate("next")}
                className="text-purple-600 hover:bg-purple-100 px-2 sm:px-4"
              >
                →
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            {selectedDayExercises.length === 0 ? (
              <div className="text-center py-8">
                {!selectedDayCategory ? (
                  // No category assigned to this day
                  <div>
                    <p className="text-muted-foreground mb-4">Keine Kategorie für {selectedDayOfWeek} zugewiesen.</p>
                    <p className="text-sm text-orange-600 mb-4">
                      💡 Weisen Sie {selectedDayOfWeek} eine Kategorie zu, um hier Übungen zu sehen!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button onClick={() => setCurrentView("categories")} className="bg-blue-600 hover:bg-blue-700">
                        Kategorien einrichten
                      </Button>
                      <Button
                        onClick={() => setCurrentView("add-exercise")}
                        variant="outline"
                        className="border-green-300 text-green-600 hover:bg-green-50"
                      >
                        Übungsvorlage hinzufügen
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Category assigned but no exercises in that category for this phase
                  <div>
                    <p className="text-muted-foreground mb-4">
                      Keine Übungen in der Kategorie "{selectedDayCategory}" für Phase {currentPhase}.
                    </p>
                    <Button onClick={() => setCurrentView("add-exercise")} className="bg-green-600 hover:bg-green-700">
                      Übungsvorlage hinzufügen
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              selectedDayExercises.map((exercise) => {
                const todayLog = todaysLogs.find((log) => log.exercise_id === exercise.id)
                const lastPractice = getLastPracticeData(exercise.id)

                return (
                  <Card
                    key={exercise.id}
                    className={`transition-all border-2 ${
                      todayLog?.completed
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3
                              className={`font-semibold ${
                                todayLog?.completed ? "line-through text-green-600" : "text-gray-900"
                              }`}
                            >
                              {exercise.name}
                            </h3>
                            {todayLog?.completed && (
                              <Badge className="bg-green-100 text-green-800 border-green-300 self-start">
                                Abgeschlossen
                              </Badge>
                            )}
                          </div>

                          {/* Show last practice data or today's data - Mobile optimized */}
                          {(todayLog || lastPractice) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm text-muted-foreground">
                              {/* Scale information for scale exercises */}
                              {(exercise.has_scale_selector ||
                                exercise.category.toLowerCase().includes("tonleiter") ||
                                exercise.name.toLowerCase().includes("tonleiter")) &&
                                ((todayLog?.scale_keys && todayLog.scale_keys.length > 0) ||
                                  (lastPractice?.scale_keys && lastPractice.scale_keys.length > 0)) && (
                                  <div className="flex items-start gap-1 col-span-1 sm:col-span-2">
                                    <Music className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <div className="flex flex-wrap gap-1">
                                      {(todayLog?.scale_keys || lastPractice?.scale_keys || []).map((key, index) => {
                                        const mode = (todayLog?.scale_modes || lastPractice?.scale_modes || [])[index]
                                        if (!mode) return null
                                        return (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs border-purple-300 text-purple-700"
                                          >
                                            {key} {mode.split(" ")[0]}
                                          </Badge>
                                        )
                                      })}
                                      {!todayLog && lastPractice && (
                                        <span className="text-xs text-gray-400">(letztes Mal)</span>
                                      )}
                                    </div>
                                  </div>
                                )}

                              {(todayLog?.song || lastPractice?.song) && (
                                <div className="flex items-center gap-1">
                                  <Music className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                  <span className="truncate">
                                    {todayLog?.song || lastPractice?.song}
                                    {!todayLog && lastPractice && (
                                      <span className="text-xs text-gray-400 ml-1">(letztes Mal)</span>
                                    )}
                                  </span>
                                </div>
                              )}
                              {(todayLog?.bpm || lastPractice?.bpm) && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                  <span>
                                    {todayLog?.bpm || lastPractice?.bpm} BPM
                                    {!todayLog && lastPractice && (
                                      <span className="text-xs text-gray-400 ml-1">(letztes Mal)</span>
                                    )}
                                  </span>
                                </div>
                              )}
                              {(todayLog?.book || lastPractice?.book) && (
                                <div className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                  <span className="truncate">{todayLog?.book || lastPractice?.book}</span>
                                </div>
                              )}
                              {(todayLog?.page || lastPractice?.page) && (
                                <div className="text-xs text-gray-600">
                                  Seite {todayLog?.page || lastPractice?.page}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end sm:justify-start">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Set up practice session for this exercise
                              setCurrentView("practice-session")
                              // You'll need to pass the exercise and date to the practice session
                            }}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                          >
                            Üben
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Action buttons - Mobile optimized: stack vertically on mobile, side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => setCurrentView("weekly")}
            variant="outline"
            className="h-16 border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Wochenübersicht
          </Button>
          <Button
            onClick={() => setCurrentView("progress")}
            variant="outline"
            className="h-16 border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Fortschritt
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <OfflineIndicator />
      <div className="container mx-auto p-3 sm:p-4 max-w-2xl">
        {/* Navigation - Mobile optimized */}
        {showBackupReminder && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-purple-800">📱 Sichern Sie Ihre Daten</h3>
                    <p className="text-sm text-purple-700">
                      {lastBackupDate
                        ? "Es ist eine Weile her seit Ihrem letzten Backup. Exportieren Sie Ihre Daten, um sie zu sichern."
                        : "Vergessen Sie nicht, Ihre Übungsprotokolle zu sichern! Exportieren Sie Ihre Daten, um sie zu sichern."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" onClick={exportData} className="bg-purple-600 hover:bg-purple-700 text-white">
                      📤 Exportieren
                    </Button>
                    <label>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-300 text-purple-600 hover:bg-purple-50 cursor-pointer w-full sm:w-auto"
                        asChild
                      >
                        <span>📥 Importieren</span>
                      </Button>
                      <input type="file" accept=".json" onChange={importData} className="hidden" />
                    </label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowBackupReminder(false)}
                      className="border-purple-300 text-purple-600"
                    >
                      Später
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Bar - Mobile optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6 gap-4">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("dashboard")}
              className={`text-xs sm:text-sm px-2 sm:px-3 ${
                currentView === "dashboard" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView("categories")}
              className={`text-xs sm:text-sm px-2 sm:px-3 ${
                currentView === "categories" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Kategorien
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView("phases")}
              className={`text-xs sm:text-sm px-2 sm:px-3 ${
                currentView === "phases" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Phasen
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView("backup")}
              className={`text-xs sm:text-sm px-2 sm:px-3 ${
                currentView === "backup" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Backup
            </Button>
          </div>

          <Button
            onClick={() => setCurrentView("add-exercise")}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Übung hinzufügen
          </Button>
        </div>

        {/* Main Content */}
        {currentView === "dashboard" && renderDashboard()}
        {currentView === "weekly" && (
          <WeeklyOverview
            exercises={currentPhaseExercises}
            practiceLogs={practiceLogs}
            currentPhase={currentPhase}
            dayHeaders={dayHeaders}
            onBack={() => setCurrentView("dashboard")}
          />
        )}
        {currentView === "add-exercise" && (
          <ExerciseForm
            onSubmit={addExercise}
            onCancel={() => setCurrentView("dashboard")}
            availableCategories={categories}
            availablePhases={availablePhases}
          />
        )}
        {currentView === "edit-exercise" && editingExercise && (
          <ExerciseForm
            exercise={editingExercise}
            onSubmit={updateExercise}
            onCancel={() => setCurrentView("dashboard")}
            availableCategories={categories}
            availablePhases={availablePhases}
            isEditing={true}
          />
        )}
        {currentView === "progress" && (
          <ProgressView exercises={exercises} practiceLogs={practiceLogs} onBack={() => setCurrentView("dashboard")} />
        )}
        {currentView === "categories" && (
          <CategoriesView
            categories={categories}
            dayHeaders={dayHeaders}
            onAddCategory={addCategory}
            onRemoveCategory={removeCategory}
            onUpdateHeader={updateDayHeader}
            availableCategories={categories}
            onBack={() => setCurrentView("dashboard")}
          />
        )}
        {currentView === "phases" && (
          <PhasesView
            availablePhases={availablePhases}
            exercises={exercises}
            currentPhase={currentPhase}
            onAddPhase={addPhase}
            onRemovePhase={removePhase}
            onBack={() => setCurrentView("dashboard")}
          />
        )}
        {currentView === "practice-session" && (
          <PracticeSession
            exercises={selectedDayCategory ? selectedDayExercises : currentPhaseExercises}
            selectedDate={selectedDate}
            practiceLogs={practiceLogs}
            onSavePracticeLog={savePracticeLog}
            getLastPracticeData={getLastPracticeData}
            getGlobalNotes={getGlobalNotes}
            onBack={() => setCurrentView("dashboard")}
          />
        )}
        {currentView === "backup" && (
          <BackupExport
            exercises={exercises}
            practiceLogs={practiceLogs}
            dayHeaders={dayHeaders}
            categories={categories}
            availablePhases={availablePhases}
            currentPhase={currentPhase}
            lastBackupDate={lastBackupDate}
            onExport={exportData}
            onImport={importData}
            onBack={() => setCurrentView("dashboard")}
          />
        )}
      </div>
    </div>
  )
}

const BackupExport: React.FC<{
  exercises: Exercise[]
  practiceLogs: PracticeLog[]
  dayHeaders: Record<string, string>
  categories: string[]
  availablePhases: number[]
  currentPhase: number
  lastBackupDate: string | null
  onExport: () => void
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBack: () => void
}> = ({
  exercises,
  practiceLogs,
  dayHeaders,
  categories,
  availablePhases,
  currentPhase,
  lastBackupDate,
  onExport,
  onImport,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Backup & Wiederherstellung
        </h1>
        <p className="text-muted-foreground">Verwalten Sie Ihre Übungsdaten-Backups.</p>
      </div>

      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-purple-800">Daten exportieren</h3>
              <p className="text-sm text-purple-700">
                Erstellen Sie ein Backup Ihrer Übungen, Übungsprotokolle, Kategorien, Phasen und Einstellungen.
              </p>
              <div className="mt-2 text-xs text-purple-600">
                • {exercises.length} Übungsvorlagen • {practiceLogs.length} Übungsprotokolle • {categories.length}{" "}
                Kategorien • {availablePhases.length} Phasen
              </div>
              <Button onClick={onExport} className="bg-purple-600 hover:bg-purple-700 text-white mt-2 w-full sm:w-auto">
                📤 Daten exportieren
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-purple-800">Daten importieren</h3>
              <p className="text-sm text-purple-700">
                Stellen Sie Ihre Daten aus einer zuvor exportierten JSON-Datei wieder her. Dies überschreibt Ihre
                aktuellen Daten.
              </p>
              <label>
                <Button
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 cursor-pointer mt-2 w-full sm:w-auto"
                  asChild
                >
                  <span>📥 Daten importieren</span>
                </Button>
                <input type="file" accept=".json" onChange={onImport} className="hidden" />
              </label>
            </div>

            {lastBackupDate && (
              <div>
                <h3 className="font-semibold text-purple-800">Letztes Backup</h3>
                <p className="text-sm text-purple-700">
                  Ihr letztes Backup war am {new Date(lastBackupDate).toLocaleDateString("de-DE")} um{" "}
                  {new Date(lastBackupDate).toLocaleTimeString("de-DE")} Uhr.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button onClick={onBack} variant="outline" className="border-gray-300 text-gray-600 w-full sm:w-auto">
        ← Zurück zum Dashboard
      </Button>
    </div>
  )
}
