"use client"
import React from 'react'
import ProfilePage from '@/components/ProfilePage/ProfilePage'
import { useParams } from 'next/navigation'

export default function Page() {
  const { userId } = useParams<{ userId: string }>();
  return (
    <ProfilePage userId={userId} />
  )
}