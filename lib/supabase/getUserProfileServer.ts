import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'

export async function getUserProfileServer(
  context: GetServerSidePropsContext,
  userId: string
) {
  const supabase = createServerSupabaseClient(context)

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId) // make sure userId is passed as parameter
    .single()

  if (error) {
    console.error('Error fetching profile:', error.message)
    return null
  }

  return profile
}
