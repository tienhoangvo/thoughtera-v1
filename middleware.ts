import { NextRequest, userAgent } from 'next/server'
import { NextResponse as res } from 'next/server'
import { verifyAuth } from './lib/server/utils/auth'
import { ACCESS_TOKEN } from './lib/server/utils/constants'

export const middleware = async (req: NextRequest) => {
  const url = req.nextUrl
  // Get accessToken from request
  // If accessToken is undefined redirect it to the sign-in page
  // along with the user url as callbackUrl

  const accessToken = req.cookies.get(ACCESS_TOKEN)
  console.log('🔃 Checking pathname in middleware')
  console.log('pathname', url.pathname)
  console.log('basePath', url.basePath)
  console.log('href', url.href)
  if (!accessToken) {
    const signInUrl = new URL(`${url.origin}/sign-in`)
    signInUrl.searchParams.set('callbackUrl', url.pathname)
    return res.redirect(signInUrl)
  }

  const verified = await verifyAuth(accessToken).catch((err) => {
    console.error(err.message)
  })

  console.log('😉', verified)

  if (!verified) {
    const signInUrl = new URL(`${url.origin}/sign-in`)
    signInUrl.searchParams.set('callbackUrl', url.pathname)
    return res.redirect(signInUrl)
  }
}

export const config = {
  matcher: ['/my-stories/:path*', '/notifications', '/bookmarks', '/new-story'],
}
