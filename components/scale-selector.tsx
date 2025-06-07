"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckCircle, Music, Plus, X } from "lucide-react"

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

interface ScaleSelectorProps {
  exerciseId: number
  selectedDate: string
  practiceLogs: PracticeLog[]
  currentSelections?: Array<{ key: string; mode: string }>
  onSelectionsChange: (selections: Array<{ key: string; mode: string }>) => void
}

const KEYS = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]

const MODES = [
  "Dur (Ionisch)",
  "Dorisch",
  "Phrygisch",
  "Lydisch",
  "Mixolydisch",
  "Moll (Äolisch)",
  "Lokrisch",
  "Harmonisch Moll",
  "Melodisch Moll",
  "Blues",
  "Pentatonisch Dur",
  "Pentatonisch Moll",
  "Chromatisch",
]

export function ScaleSelector({
  exerciseId,
  selectedDate,
  practiceLogs,
  currentSelections = [],
  onSelectionsChange,
}: ScaleSelectorProps) {
  const [selectedKey, setSelectedKey] = useState("")
  const [selectedMode, setSelectedMode] = useState("")

  // Get all practiced scales for this exercise (not just today)
  const getPracticedScales = () => {
    const scales: Array<{ key: string; mode: string; date: string }> = []

    practiceLogs
      .filter((log) => log.exercise_id === exerciseId && log.scale_keys && log.scale_modes)
      .forEach((log) => {
        if (log.scale_keys && log.scale_modes) {
          log.scale_keys.forEach((key, index) => {
            if (log.scale_modes![index]) {
              scales.push({ key, mode: log.scale_modes![index], date: log.date })
            }
          })
        }
      })

    return scales
  }

  // Get scales practiced today
  const getTodayScales = () => {
    const todayLog = practiceLogs.find((log) => log.exercise_id === exerciseId && log.date === selectedDate)

    if (!todayLog?.scale_keys || !todayLog?.scale_modes) return []

    return todayLog.scale_keys
      .map((key, index) => ({
        key,
        mode: todayLog.scale_modes![index],
      }))
      .filter((scale) => scale.mode) // Filter out undefined modes
  }

  // Check if a scale combination has been practiced
  const isScalePracticed = (key: string, mode: string) => {
    const practiced = getPracticedScales()
    return practiced.some((scale) => scale.key === key && scale.mode === mode)
  }

  // Check if a scale was practiced today
  const isScalePracticedToday = (key: string, mode: string) => {
    const todayScales = getTodayScales()
    return todayScales.some((scale) => scale.key === key && scale.mode === mode)
  }

  const addScale = () => {
    if (selectedKey && selectedMode) {
      // Check if this combination already exists
      const exists = currentSelections.some((scale) => scale.key === selectedKey && scale.mode === selectedMode)

      if (!exists) {
        const newSelections = [...currentSelections, { key: selectedKey, mode: selectedMode }]
        onSelectionsChange(newSelections)
        setSelectedKey("")
        setSelectedMode("")
      }
    }
  }

  const removeScale = (index: number) => {
    const newSelections = currentSelections.filter((_, i) => i !== index)
    onSelectionsChange(newSelections)
  }

  const getScaleStats = () => {
    const practiced = getPracticedScales()
    const totalPossible = KEYS.length * MODES.length
    const uniquePracticed = new Set(practiced.map((s) => `${s.key}-${s.mode}`)).size

    return {
      total: totalPossible,
      practiced: uniquePracticed,
      percentage: Math.round((uniquePracticed / totalPossible) * 100),
    }
  }

  const stats = getScaleStats()
  const todayScales = getTodayScales()

  return (
    <div className="space-y-4">
      {/* Scale Selection */}
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Music className="w-5 h-5" />
            Tonleiterauswahl
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Tonart</Label>
              <Select value={selectedKey} onValueChange={setSelectedKey}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Tonart wählen" />
                </SelectTrigger>
                <SelectContent>
                  {KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {key}
                        {selectedMode && isScalePracticed(key, selectedMode) && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Modus/Tonleitertyp</Label>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Modus wählen" />
                </SelectTrigger>
                <SelectContent>
                  {MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      <div className="flex items-center gap-2">
                        {mode}
                        {selectedKey && isScalePracticed(selectedKey, mode) && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">&nbsp;</Label>
              <Button
                onClick={addScale}
                disabled={!selectedKey || !selectedMode}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tonleiter hinzufügen
              </Button>
            </div>
          </div>

          {/* Current Session Scales */}
          {currentSelections.length > 0 && (
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Ausgewählt zum Üben:</Label>
              <div className="space-y-2">
                {currentSelections.map((scale, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-purple-800">
                        {scale.key} {scale.mode}
                      </span>
                      {isScalePracticedToday(scale.key, scale.mode) ? (
                        <Badge className="bg-green-100 text-green-800 border-green-300">✓ Heute geübt</Badge>
                      ) : isScalePracticed(scale.key, scale.mode) ? (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">Früher geübt</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-300">🆕 Neue Tonleiter</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeScale(index)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Scales Summary */}
      {todayScales.length > 0 && (
        <Card className="border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-3">
            <CardTitle className="text-green-800">✅ Heute abgeschlossen ({todayScales.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {todayScales.map((scale, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 border-green-300">
                  {scale.key} {scale.mode}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
          <CardTitle className="text-blue-800">📊 Tonleiter-Fortschritt</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gesamtfortschritt</span>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                {stats.practiced}/{stats.total} ({stats.percentage}%)
              </Badge>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>

            {/* Quick suggestions for unpracticed scales */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">🎯 Vorgeschlagene Tonleitern zum Üben:</Label>
              <div className="flex flex-wrap gap-1">
                {KEYS.slice(0, 4)
                  .flatMap((key) =>
                    MODES.slice(0, 3).map((mode) => {
                      if (!isScalePracticed(key, mode)) {
                        return (
                          <Button
                            key={`${key}-${mode}`}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedKey(key)
                              setSelectedMode(mode)
                            }}
                            className="text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                          >
                            {key} {mode.split(" ")[0]}
                          </Button>
                        )
                      }
                      return null
                    }),
                  )
                  .filter(Boolean)
                  .slice(0, 6)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
