"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Save } from "lucide-react"

interface DayHeadersViewProps {
  dayHeaders: Record<string, string>
  onUpdateHeader: (day: string, header: string) => void
  availableCategories: string[]
  onBack: () => void
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function DayHeadersView({ dayHeaders, onUpdateHeader, availableCategories, onBack }: DayHeadersViewProps) {
  const [tempHeaders, setTempHeaders] = useState<Record<string, string>>(dayHeaders)
  const [hasChanges, setHasChanges] = useState(false)

  const handleHeaderChange = (day: string, value: string) => {
    setTempHeaders((prev) => ({ ...prev, [day]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    Object.entries(tempHeaders).forEach(([day, header]) => {
      onUpdateHeader(day, header)
    })
    setHasChanges(false)
  }

  const clearHeader = (day: string) => {
    handleHeaderChange(day, "")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Day Headers
          </h1>
          <p className="text-sm text-muted-foreground">Assign categories to each day of the week</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {DAYS.map((day) => (
          <Card key={day} className="border-2 border-blue-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Calendar className="w-5 h-5" />
                {day}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor={`header-${day}`} className="text-gray-700 font-medium">
                  Practice Category
                </Label>
                <div className="flex gap-2">
                  {availableCategories.length > 0 ? (
                    <Select
                      value={tempHeaders[day] || "No category"}
                      onValueChange={(value) => handleHeaderChange(day, value)}
                    >
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No category">No category</SelectItem>
                        {availableCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex-1">
                      <p className="text-sm text-orange-600 p-2 bg-orange-50 rounded border border-orange-200">
                        No categories available. Create categories first in the Categories section.
                      </p>
                    </div>
                  )}
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
              </div>

              {tempHeaders[day] && tempHeaders[day] !== "No category" && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Preview:</strong> {day} - {tempHeaders[day]}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {hasChanges && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-green-700 font-medium">You have unsaved changes</p>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">💡 How It Works</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• First create categories in the "Categories" section</li>
            <li>• Then assign those categories to weekdays here</li>
            <li>• When adding exercises, select from your categories</li>
            <li>• Exercises will appear on the days assigned to their category</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
