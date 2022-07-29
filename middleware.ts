import { NextRequest, userAgent } from 'next/server'
import { NextResponse as res } from 'next/server'
import { verifyAuth } from './lib/server/utils/auth'
import { ACCESS_TOKEN } from './lib/server/utils/constants'

export const middleware = async (req: NextRequest) => {
  const { nextUrl } = req
  // Get accessToken from request
  // If accessToken is undefined redirect it to the sign-in page
  // along with the user url as callbackUrl

  const accessToken = req.cookies.get(ACCESS_TOKEN)
  console.log('🔃 Checking pathname in middleware')
  console.log('pathname', nextUrl.pathname)
  console.log('basePath', nextUrl.basePath)
  console.log('href', nextUrl.href)

  if (!accessToken) {
    if (!nextUrl.pathname.startsWith('/sign-in')) {
      const signInUrl = new URL(`/sign-in`, req.url)
      signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
      return res.redirect(signInUrl)
    }
  }

  if (accessToken) {
    if (nextUrl.pathname.startsWith('/sign-in')) {
      const callbackPathname = nextUrl.searchParams.get('callbackUrl') || '/'
      const callbackUrl = new URL(callbackPathname, req.url)
      console.log('callbackUrl', callbackUrl)
      return res.redirect(callbackUrl)
    }
    const verified = await verifyAuth(accessToken).catch((err) => {
      console.error(err.message)
    })
  
    console.log('😉 verified', verified)
  
    if (!verified) {
      const signInUrl = new URL(`/sign-in`, req.url)
      signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
      return res.redirect(signInUrl)
    }
  }
  
}

export const config = {
  matcher: ['/my-stories/:path*', '/notifications', '/bookmarks', '/new-story', '/sign-in'],
}
