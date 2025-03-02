'use client'
import { auth } from '@/lib/firebase/config'
// import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect } from 'react'
import { onIdTokenChanged } from 'firebase/auth'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, loading] = useAuthState(auth)

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken()
        // Sync token with cookies for middleware
        document.cookie = `session=${token}; path=/; max-age=${3600}`
      } else {
        // Clear cookie on logout
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    })

    return () => unsubscribe()
  }, [])

  // Optional: Refresh token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser
      if (user) await user.getIdToken(true)
    }, 10 * 60 * 1000)

    return () => clearInterval(handle)
  }, [])

  return <>{children}</>
}
