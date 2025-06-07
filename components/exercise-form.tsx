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
          Back
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          {isEditing ? "Edit Exercise Template" : "Add New Exercise Template"}
        </h1>
      </div>

      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-blue-800">Exercise Template Details</CardTitle>
          <p className="text-sm text-blue-600">
            Create a template that will appear on days assigned to its category. You'll log specific details when
            practicing.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700 font-medium">
                  Practice Category *
                </Label>
                {availableCategories.length > 0 ? (
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Select category" />
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
                      placeholder="Enter category name"
                      required
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <p className="text-xs text-orange-600">
                      No categories available. Create categories first or enter manually.
                    </p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  This exercise will appear on days assigned to this category
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
                    <SelectValue placeholder="Select phase" />
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
                Exercise Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Scale Practice, Chord Progressions, Song Learning"
                required
                className="border-blue-200 focus:border-blue-400"
              />
              <p className="text-xs text-muted-foreground">
                Give this exercise template a descriptive name. You'll add specific songs, BPM, etc. when practicing.
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
                  Include Scale/Key Selector
                </Label>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Enable this to track scales, keys, and modes for this exercise (useful for scales, chords, arpeggios,
                etc.)
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isEditing ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">💡 How Exercise Templates Work</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Templates define what type of practice you'll do (e.g., "Scale Practice", "Song Learning")</li>
            <li>• They appear on days assigned to their category</li>
            <li>• When practicing, you'll log specific details like which song, BPM, page numbers, etc.</li>
            <li>• Enable scale/key selector for exercises that involve specific keys or scales</li>
            <li>• Global notes persist across weeks for ongoing practice goals</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
