'use client'

import { Button, Card, Text, Spacer, Grid } from '@geist-ui/react'

export default function GeistExample() {
  return (
    <div className="p-6">
      <Text h1>Deutsch123 with Geist UI</Text>
      <Spacer h={2} />
      
      <Grid.Container gap={2}>
        <Grid xs={12} sm={6}>
          <Card>
            <Text h4>Virtual Immersion</Text>
            <Text p>Experience German language learning through interactive scenarios.</Text>
            {/* @ts-expect-error Geist UI Button type issue */}
            <Button type="success">
              Start Learning
            </Button>
          </Card>
        </Grid>
        
        <Grid xs={12} sm={6}>
          <Card>
            <Text h4>AI Conversations</Text>
            <Text p>Practice with AI-powered conversation partners.</Text>
            {/* @ts-expect-error Geist UI Button type issue */}
            <Button type="secondary">
              Chat Now
            </Button>
          </Card>
        </Grid>
      </Grid.Container>
    </div>
  )
} 