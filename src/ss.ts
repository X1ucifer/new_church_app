
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const protectedRoutes = ['/', '/profile'];

// export function middleware(req: NextRequest) {
//   const isAuthenticated = req.cookies.get('isAuthenticated') || ''; 

//   if (protectedRoutes.includes(req.nextUrl.pathname)) {
//     if (!isAuthenticated) {
//       // If not authenticated, redirect to login
//       return NextResponse.redirect(new URL('/login', req.url));
//     }
//   }
//   // Continue if authenticated
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/', '/profile', '/any-other-protected-route'], 
// };
