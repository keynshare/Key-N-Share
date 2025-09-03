"use client"
import React from 'react'
import ProfilePage from '@/components/ProfilePage/ProfilePage'
import { useParams } from 'next/navigation'

export default function page() {
  const { userId } = useParams();
  return (
    <ProfilePage userId={userId} />
  )
}