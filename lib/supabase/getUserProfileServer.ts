// This is for server components (App Router)
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getUserProfileServer(userId: string) {
  const supabase = createServerSupabaseClient({ cookies })

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error.message)
    return null
  }

  return profile
}
