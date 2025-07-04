"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Phone, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"

export default function SMSTestPage() {
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isSendingSMS, setIsSendingSMS] = useState(false)
  const [connectionResult, setConnectionResult] = useState<any>(null)
  const [smsResult, setSmsResult] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("Hello from CivicHero! This is a test message.")

  const testConnection = async () => {
    setIsTestingConnection(true)
    setConnectionResult(null)

    try {
      const response = await fetch("/api/test/twilio")
      const data = await response.json()
      setConnectionResult(data)
    } catch (error) {
      setConnectionResult({
        success: false,
        error: "Network error",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const sendTestSMS = async () => {
    if (!phoneNumber || !message) return

    setIsSendingSMS(true)
    setSmsResult(null)

    try {
      const response = await fetch("/api/test/twilio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
        }),
      })

      const data = await response.json()
      setSmsResult(data)
    } catch (error) {
      setSmsResult({
        success: false,
        error: "Network error",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsSendingSMS(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SMS Integration Test</h1>
          <p className="text-gray-600">Test your Twilio SMS integration for CivicHero</p>
        </div>

        {/* Connection Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Test Twilio Connection
            </CardTitle>
            <CardDescription>Verify that your Twilio credentials are configured correctly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={isTestingConnection} className="w-full">
              {isTestingConnection ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                "Test Twilio Connection"
              )}
            </Button>

            {connectionResult && (
              <Alert variant={connectionResult.success ? "default" : "destructive"}>
                {connectionResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Status:</strong> {connectionResult.success ? "Success" : "Failed"}
                    </p>
                    <p>
                      <strong>Message:</strong> {connectionResult.message || connectionResult.error}
                    </p>
                    {connectionResult.account && (
                      <div className="mt-2">
                        <p>
                          <strong>Account SID:</strong> {connectionResult.account.sid}
                        </p>
                        <p>
                          <strong>Account Name:</strong> {connectionResult.account.friendlyName}
                        </p>
                        <p>
                          <strong>Status:</strong> {connectionResult.account.status}
                        </p>
                      </div>
                    )}
                    {connectionResult.details && (
                      <p>
                        <strong>Details:</strong> {connectionResult.details}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* SMS Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Test SMS
            </CardTitle>
            <CardDescription>Send a test SMS to verify message delivery</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254712345678 or 0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500">Enter a Kenyan phone number to receive the test SMS</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your test message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-500">Maximum 160 characters for a single SMS</p>
            </div>

            <Button onClick={sendTestSMS} disabled={isSendingSMS || !phoneNumber || !message} className="w-full">
              {isSendingSMS ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending SMS...
                </>
              ) : (
                "Send Test SMS"
              )}
            </Button>

            {smsResult && (
              <Alert variant={smsResult.success ? "default" : "destructive"}>
                {smsResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>
                  <div className="space-y-2">
                    <p>
                      <strong>Status:</strong> {smsResult.success ? "Success" : "Failed"}
                    </p>
                    <p>
                      <strong>Message:</strong> {smsResult.message || smsResult.error}
                    </p>
                    {smsResult.messageSid && (
                      <p>
                        <strong>Message SID:</strong> {smsResult.messageSid}
                      </p>
                    )}
                    {smsResult.details && (
                      <p>
                        <strong>Details:</strong> {smsResult.details}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Environment Variables Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Make sure these environment variables are set in your deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">TWILIO_ACCOUNT_SID</Badge>
                <span className="text-gray-600">Your Twilio Account SID</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">TWILIO_AUTH_TOKEN</Badge>
                <span className="text-gray-600">Your Twilio Auth Token</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">TWILIO_PHONE_NUMBER</Badge>
                <span className="text-gray-600">Your Twilio Phone Number</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
