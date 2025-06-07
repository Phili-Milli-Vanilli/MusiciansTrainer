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
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Categories & Day Headers
          </h1>
          <p className="text-sm text-muted-foreground">Create categories and assign them to weekdays</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Add New Category */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Plus className="w-5 h-5" />
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="newCategory" className="text-gray-700 font-medium">
                  Category Name
                </Label>
                <Input
                  id="newCategory"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., Jazz, Classical, Technique"
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Quick Add Suggestions */}
            {availableSuggestions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Quick add suggestions:</Label>
                <div className="flex flex-wrap gap-2">
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
            Your Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No categories yet. Add some categories to organize your exercises!
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
            Assign Categories to Days
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-20 font-medium text-purple-800">{day}</div>
                <div className="flex-1">
                  {categories.length > 0 ? (
                    <Select
                      value={tempHeaders[day] || "No category"}
                      onValueChange={(value) => handleHeaderChange(day, value)}
                    >
                      <SelectTrigger className="border-purple-200 focus:border-purple-400">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No category">No category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-orange-600 p-2 bg-orange-50 rounded border border-orange-200">
                      Create categories first
                    </p>
                  )}
                </div>
                {tempHeaders[day] && tempHeaders[day] !== "No category" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => clearHeader(day)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Clear
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">💡 How It Works</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Create categories for different types of practice (Chords, Scales, Jazz, etc.)</li>
            <li>• Assign categories to weekdays - exercises in that category will appear on those days</li>
            <li>• When adding exercises, select from your categories</li>
            <li>• Each day you can log what you actually practiced with specific details</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
