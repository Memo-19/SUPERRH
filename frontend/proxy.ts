import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 1. الحارس يبحث عن "سوار الدخول" (Token) في ملفات الارتباط (Cookies)
  const token = request.cookies.get('hr_token')?.value
  
  // 2. إذا حاول شخص الدخول لأي صفحة داخل لوحة التحكم (ما عدا صفحة تسجيل الدخول)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!token) {
      // 🚫 طرد فوري إلى صفحة تسجيل الدخول لأنه لا يملك السوار!
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  // 3. إذا كان يملك السوار وحاول فتح صفحة تسجيل الدخول، نوجهه للـ Dashboard مباشرة
  if (request.nextUrl.pathname.startsWith('/admin/login') && token) {
     return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

// هنا نخبر الحارس أن يراقب مسار /admin/ فقط
export const config = {
  matcher: ['/admin/:path*'],
}