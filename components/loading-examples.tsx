"use client"

import { useState } from "react"
import { Loading, LoadingButton, LoadingOverlay } from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoadingExamples() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const simulateOverlay = () => {
    setIsOverlayVisible(true)
    setTimeout(() => setIsOverlayVisible(false), 3000)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Loading Indicators</CardTitle>
          <CardDescription>Different loading indicator styles for Pamoja Events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="spinner">
            <TabsList className="mb-4">
              <TabsTrigger value="spinner">Spinner</TabsTrigger>
              <TabsTrigger value="dots">Dots</TabsTrigger>
              <TabsTrigger value="pulse">Pulse</TabsTrigger>
              <TabsTrigger value="bar">Progress Bar</TabsTrigger>
            </TabsList>

            <TabsContent value="spinner" className="space-y-6">
              <div className="flex flex-wrap items-end gap-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Extra Small</span>
                  <Loading variant="spinner" size="xs" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Small</span>
                  <Loading variant="spinner" size="sm" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Medium</span>
                  <Loading variant="spinner" size="md" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Large</span>
                  <Loading variant="spinner" size="lg" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Extra Large</span>
                  <Loading variant="spinner" size="xl" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Loading variant="spinner" size="md" color="primary" />
                <Loading variant="spinner" size="md" color="secondary" />
                <Loading variant="spinner" size="md" color="muted" />
                <Loading variant="spinner" size="md" color="primary" showLabel label="Loading data..." />
              </div>
            </TabsContent>

            <TabsContent value="dots" className="space-y-6">
              <div className="flex flex-wrap items-end gap-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Extra Small</span>
                  <Loading variant="dots" size="xs" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Small</span>
                  <Loading variant="dots" size="sm" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Medium</span>
                  <Loading variant="dots" size="md" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Large</span>
                  <Loading variant="dots" size="lg" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Loading variant="dots" size="md" color="primary" />
                <Loading variant="dots" size="md" color="secondary" />
                <Loading variant="dots" size="md" color="muted" />
                <Loading variant="dots" size="md" color="primary" showLabel label="Loading data..." />
              </div>
            </TabsContent>

            <TabsContent value="pulse" className="space-y-6">
              <div className="flex flex-wrap items-end gap-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Extra Small</span>
                  <Loading variant="pulse" size="xs" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Small</span>
                  <Loading variant="pulse" size="sm" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Medium</span>
                  <Loading variant="pulse" size="md" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">Large</span>
                  <Loading variant="pulse" size="lg" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Loading variant="pulse" size="md" color="primary" />
                <Loading variant="pulse" size="md" color="secondary" />
                <Loading variant="pulse" size="md" color="muted" />
                <Loading variant="pulse" size="md" color="primary" showLabel label="Loading data..." />
              </div>
            </TabsContent>

            <TabsContent value="bar" className="space-y-6">
              <div className="space-y-4 w-full">
                <Loading variant="bar" color="primary" />
                <Loading variant="bar" color="secondary" />
                <Loading variant="bar" color="muted" />
                <Loading variant="bar" color="primary" showLabel label="Loading data..." />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loading Button</CardTitle>
          <CardDescription>Button with loading state</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <LoadingButton loading={isLoading} onClick={simulateLoading}>
            Click to Load
          </LoadingButton>
          <LoadingButton
            loading={isLoading}
            loadingText="Processing..."
            onClick={simulateLoading}
            className="bg-unity-500 hover:bg-unity-600"
          >
            Submit Form
          </LoadingButton>
          <Button variant="outline" disabled={isLoading} onClick={simulateLoading}>
            {isLoading ? (
              <>
                <Loading variant="spinner" size="xs" className="mr-2" />
                Please wait...
              </>
            ) : (
              "Custom Loading Button"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loading Overlay</CardTitle>
          <CardDescription>Full-screen loading overlay for major operations</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={simulateOverlay}>Show Loading Overlay</Button>
          <LoadingOverlay visible={isOverlayVisible} message="Loading your data, please wait..." />
        </CardContent>
      </Card>
    </div>
  )
}
