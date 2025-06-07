"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X, Tag, Calendar, Save } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface CategoriesViewProps {
  categories: string[]
  dayHeaders: Record<string, string>
  onAddCategory: (category: string) => void
  onRemoveCategory: (category: string) => void
  onUpdateHeader: (day: string, header: string) => void
  availableCategories: string[]
  onBack: () => void
}

export function CategoriesView({
  categories,
  dayHeaders,
  onAddCategory,
  onRemoveCategory,
  onUpdateHeader,
  availableCategories,
  onBack,
}: CategoriesViewProps) {
  const [newCategory, setNewCategory] = useState("")
  const [tempHeaders, setTempHeaders] = useState<Record<string, string>>(dayHeaders)
  const [hasChanges, setHasChanges] = useState(false)

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim())
      setNewCategory("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCategory()
    }
  }

  const handleHeaderChange = (day: string, value: string) => {
    const actualValue = value === "No category" ? "" : value
    setTempHeaders((prev) => ({ ...prev, [day]: actualValue }))
    setHasChanges(true)
  }

  const handleSave = () => {
    Object.entries(tempHeaders).forEach(([day, header]) => {
      onUpdateHeader(day, header === "No category" ? "" : header)
    })
    setHasChanges(false)
  }

  const clearHeader = (day: string) => {
    handleHeaderChange(day, "")
  }

  const suggestedCategories = [
    "Chords",
    "Scales",
    "Technique",
    "Jazz",
    "Classical",
    "Sight Reading",
    "Songs",
    "Theory",
    "Arpeggios",
    "Improvisation",
    "Rhythm",
    "Ear Training",
    "Repertoire",
    "Warm-up",
    "Blues",
    "Rock",
    "Pop",
    "Fingering",
    "Dynamics",
    "Pedaling",
  ]

  const availableSuggestions = suggestedCategories.filter((cat) => !categories.includes(cat))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Kategorien & Tageszuordnungen
          </h1>
          <p className="text-sm text-muted-foreground">Kategorien erstellen und Wochentagen zuweisen</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Änderungen speichern
          </Button>
        )}
      </div>

      {/* Add New Category */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Plus className="w-5 h-5" />
            Neue Kategorie hinzufügen
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label htmlFor="newCategory" className="text-gray-700 font-medium">
                  Kategoriename
                </Label>
                <Input
                  id="newCategory"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="z.B. Jazz, Klassik, Technik"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                  Hinzufügen
                </Button>
              </div>
            </div>

            {/* Quick Add Suggestions */}
            {availableSuggestions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Schnell hinzufügen:</Label>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {availableSuggestions.slice(0, 8).map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => onAddCategory(suggestion)}
                      className="text-xs border-green-300 text-green-600 hover:bg-green-50"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Categories */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Tag className="w-5 h-5" />
            Ihre Kategorien ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Noch keine Kategorien. Fügen Sie Kategorien hinzu, um Ihre Übungen zu organisieren!
            </p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">{category}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveCategory(category)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Day Headers */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Calendar className="w-5 h-5" />
            Kategorien zu Tagen zuweisen
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {DAYS.map((day) => (
              <div
                key={day}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <div className="w-full sm:w-20 font-medium text-purple-800">{day}</div>
                <div className="flex-1">
                  {categories.length > 0 ? (
                    <Select
                      value={tempHeaders[day] || "No category"}
                      onValueChange={(value) => handleHeaderChange(day, value)}
                    >
                      <SelectTrigger className="border-purple-200 focus:border-purple-400">
                        <SelectValue placeholder="Kategorie auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No category">Keine Kategorie</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-orange-600 p-2 bg-orange-50 rounded border border-orange-200">
                      Erstellen Sie zuerst Kategorien
                    </p>
                  )}
                </div>
                {tempHeaders[day] && tempHeaders[day] !== "No category" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearHeader(day)}
                    className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                  >
                    Löschen
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Changes reminder for mobile */}
      {hasChanges && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-green-700 font-medium">Sie haben ungespeicherte Änderungen</p>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Alle Änderungen speichern
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">💡 So funktioniert es</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Erstellen Sie Kategorien für verschiedene Übungsarten (Akkorde, Tonleitern, Jazz usw.)</li>
            <li>• Weisen Sie Kategorien zu Wochentagen zu - Übungen in dieser Kategorie erscheinen an diesen Tagen</li>
            <li>• Beim Hinzufügen von Übungen wählen Sie aus Ihren Kategorien</li>
            <li>• Jeden Tag können Sie protokollieren, was Sie tatsächlich mit spezifischen Details geübt haben</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
