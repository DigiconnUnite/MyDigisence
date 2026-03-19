"use client";

import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Send,
  CheckCircle,
} from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormState('idle')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
          setFormState('success');
        // Reset form
        (e.target as HTMLFormElement).reset()
      } else {
        setFormState('error')
        setErrorMsg(result.error || 'Failed to send message')
      }
    } catch {
      setFormState('error')
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-0 p-0 shadow-lg bg-white">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Send us a Message
          </h2>
          <p className="text-gray-600">
            Fill out the form below and we'll get back to you as soon
            as possible.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-slate-700"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Shivam"
                className="mt-1 border-gray-200 focus:border-slate-800 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-slate-700"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Thakur"
                className="mt-1 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@mail.com"
              className="mt-1 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <div>
            <Label
              htmlFor="subject"
              className="text-sm font-medium text-slate-700"
            >
              Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="How can we help you?"
              className="mt-1 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <div>
            <Label
              htmlFor="message"
              className="text-sm font-medium text-slate-700"
            >
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us more about your inquiry..."
              rows={5}
              className="mt-1 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>

          {formState === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Your message has been sent successfully!
            </div>
          )}

          {formState === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMsg}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
