"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Music, Clock } from "lucide-react"

type Exercise = {
  id: number
  day: string
  name: string
  bpm: number
  page: string
  book: string
  song: string
  completed: boolean
  completedAt?: string
  category: string
}

interface WeeklyOverviewProps {
  exercises: Exercise[]
  currentPhase: number
  dayHeaders: Record<string, string>
  onBack: () => void
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function WeeklyOverview({ exercises, currentPhase, dayHeaders, onBack }: WeeklyOverviewProps) {
  const getExercisesForDay = (day: string) => {
    const dayCategory = dayHeaders[day]
    return dayCategory ? exercises.filter((ex) => ex.category === dayCategory) : []
  }

  const getCompletionRate = (dayExercises: Exercise[]) => {
    if (dayExercises.length === 0) return 0
    const completed = dayExercises.filter((ex) => ex.completed).length
    return Math.round((completed / dayExercises.length) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Weekly Overview
          </h1>
          <p className="text-sm text-muted-foreground">Phase {currentPhase}</p>
        </div>
      </div>

      <div className="space-y-4">
        {DAYS.map((day) => {
          const dayExercises = getExercisesForDay(day)
          const completionRate = getCompletionRate(dayExercises)

          return (
            <Card key={day} className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-800">{day}</CardTitle>
                    {dayHeaders[day] && <p className="text-sm text-blue-600 font-medium">{dayHeaders[day]}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={completionRate === 100 ? "default" : completionRate > 0 ? "secondary" : "outline"}
                      className={
                        completionRate === 100
                          ? "bg-green-100 text-green-800 border-green-300"
                          : completionRate > 0
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                      }
                    >
                      {completionRate}% Complete
                    </Badge>
                    <span className="text-sm text-muted-foreground">{dayExercises.length} exercises</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {dayExercises.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No exercises in "{dayHeaders[day] || "No Category"}" for Phase {currentPhase}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {dayExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                          exercise.completed
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                            : "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
                        }`}
                      >
                        <div className="flex-1">
                          <p
                            className={`font-medium text-sm ${
                              exercise.completed ? "line-through text-green-600" : "text-gray-800"
                            }`}
                          >
                            {exercise.name}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span className="text-purple-600 font-medium">Category: {exercise.category}</span>
                            {exercise.song && (
                              <span className="flex items-center gap-1">
                                <Music className="w-3 h-3 text-purple-500" />
                                {exercise.song}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-500" />
                              {exercise.bpm} BPM
                            </span>
                          </div>
                        </div>
                        {exercise.completed && (
                          <Badge className="text-xs bg-green-100 text-green-800 border-green-300">✓</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
