// lib/getUserProfileClient.ts
'use client'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export async function getUserProfileClient() {
  const supabase = createBrowserSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, email') // only fetch what you need
    .eq('id', user.id)
    .single()

  if (error) console.error(error)

  return profile
}
