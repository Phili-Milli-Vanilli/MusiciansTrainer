"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Music } from "lucide-react"

type Exercise = {
  id?: number
  category: string
  name: string
  phase: number
  created_at?: string
  has_scale_selector?: boolean
}

interface ExerciseFormProps {
  onSubmit: (exercise: any) => void
  onCancel: () => void
  exercise?: Exercise
  isEditing?: boolean
  availableCategories: string[]
  availablePhases: number[]
}

export function ExerciseForm({
  onSubmit,
  onCancel,
  exercise,
  isEditing = false,
  availableCategories,
  availablePhases,
}: ExerciseFormProps) {
  const [formData, setFormData] = useState<Exercise>({
    category: exercise?.category || "",
    name: exercise?.name || "",
    phase: exercise?.phase || 1,
    has_scale_selector: exercise?.has_scale_selector || false,
    ...(isEditing && exercise ? { id: exercise.id, created_at: exercise.created_at } : {}),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.category && formData.name) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof Exercise, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          {isEditing ? "Übungsvorlage bearbeiten" : "Neue Übungsvorlage hinzufügen"}
        </h1>
      </div>

      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-blue-800">Details der Übungsvorlage</CardTitle>
          <p className="text-sm text-blue-600">
            Erstellen Sie eine Vorlage, die an den ihrer Kategorie zugewiesenen Tagen erscheint. Beim Üben
            protokollieren Sie spezifische Details.
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700 font-medium">
                  Übungskategorie *
                </Label>
                {availableCategories.length > 0 ? (
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-2">
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      placeholder="Kategoriename eingeben"
                      required
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <p className="text-xs text-orange-600">
                      Keine Kategorien verfügbar. Erstellen Sie zuerst Kategorien oder geben Sie manuell ein.
                    </p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Diese Übung erscheint an Tagen, die dieser Kategorie zugewiesen sind
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phase" className="text-gray-700 font-medium">
                  Phase
                </Label>
                <Select
                  value={formData.phase.toString()}
                  onValueChange={(value) => handleInputChange("phase", Number.parseInt(value))}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Phase auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePhases.map((phase) => (
                      <SelectItem key={phase} value={phase.toString()}>
                        Phase {phase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Übungsname *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="z.B. Tonleiterübung, Akkordfolgen, Lied lernen"
                required
                className="border-blue-200 focus:border-blue-400"
              />
              <p className="text-xs text-muted-foreground">
                Geben Sie dieser Übungsvorlage einen beschreibenden Namen. Spezifische Lieder, BPM usw. fügen Sie beim
                Üben hinzu.
              </p>
            </div>

            {/* Scale/Key Selector Option */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="has_scale_selector"
                  checked={formData.has_scale_selector}
                  onChange={(e) => handleInputChange("has_scale_selector", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="has_scale_selector" className="text-gray-700 font-medium flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-500" />
                  Tonleiter-/Tonart-Auswahl einschließen
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Aktivieren Sie dies, um Tonleitern, Tonarten und Modi für diese Übung zu verfolgen (nützlich für
                Tonleitern, Akkorde, Arpeggien usw.)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isEditing ? "Vorlage aktualisieren" : "Vorlage erstellen"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Wie Übungsvorlagen funktionieren</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • Vorlagen definieren, welche Art von Übung Sie machen werden (z.B. "Tonleiterübung", "Lied lernen")
            </li>
            <li>• Sie erscheinen an Tagen, die ihrer Kategorie zugewiesen sind</li>
            <li>• Beim Üben protokollieren Sie spezifische Details wie welches Lied, BPM, Seitenzahlen usw.</li>
            <li>
              • Aktivieren Sie die Tonleiter-/Tonart-Auswahl für Übungen mit spezifischen Tonarten oder Tonleitern
            </li>
            <li>• Globale Notizen bleiben wochenübergreifend für fortlaufende Übungsziele bestehen</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
