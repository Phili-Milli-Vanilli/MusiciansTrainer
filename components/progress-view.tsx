"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Calendar, Target } from "lucide-react"

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
  phase: number
}

interface ProgressViewProps {
  exercises: Exercise[]
  onBack: () => void
}

export function ProgressView({ exercises, onBack }: ProgressViewProps) {
  const completedExercises = exercises.filter((ex) => ex.completed)
  const totalExercises = exercises.length
  const completionRate = totalExercises > 0 ? Math.round((completedExercises.length / totalExercises) * 100) : 0

  // Get exercises completed this week (last 7 days)
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const thisWeekCompleted = completedExercises.filter((ex) => {
    if (!ex.completedAt) return false
    return new Date(ex.completedAt) >= oneWeekAgo
  })

  // Group completed exercises by day
  const exercisesByDay = completedExercises.reduce(
    (acc, exercise) => {
      if (!exercise.completedAt) return acc
      const date = new Date(exercise.completedAt).toLocaleDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(exercise)
      return acc
    },
    {} as Record<string, Exercise[]>,
  )

  const recentDays = Object.keys(exercisesByDay)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 7)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Progress Tracking
        </h1>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-800">{completionRate}%</p>
                <p className="text-sm text-blue-600">Overall Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-800">{thisWeekCompleted.length}</p>
                <p className="text-sm text-green-600">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-800">{completedExercises.length}</p>
                <p className="text-sm text-purple-600">Total Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardTitle className="text-gray-800">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {recentDays.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No completed exercises yet. Start practicing to see your progress!
            </p>
          ) : (
            <div className="space-y-4">
              {recentDays.map((date) => {
                const dayExercises = exercisesByDay[date]
                return (
                  <div
                    key={date}
                    className="border-l-4 border-blue-300 pl-4 bg-gradient-to-r from-blue-50 to-transparent p-3 rounded-r-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{date}</h3>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        {dayExercises.length} completed
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {dayExercises.map((exercise) => (
                        <div key={exercise.id} className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
                          <p className="font-medium text-gray-800">{exercise.name}</p>
                          <p className="text-muted-foreground">
                            {exercise.song ? `${exercise.song} • ` : ""}
                            {exercise.bpm} BPM • Phase {exercise.phase}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">Keep Going! 🎵</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-yellow-700">
            {completionRate < 50 && (
              <p className="text-sm">💪 Try to complete at least 50% of your exercises this week!</p>
            )}
            {thisWeekCompleted.length === 0 && (
              <p className="text-sm">🎵 Start your week strong - complete your first exercise today!</p>
            )}
            {thisWeekCompleted.length > 0 && (
              <p className="text-sm">🎉 Great job! You've completed {thisWeekCompleted.length} exercises this week!</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
