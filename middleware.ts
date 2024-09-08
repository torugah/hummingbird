import { NextAuthMiddlewareOptions, NextRequestWithAuth, withAuth } from "next-auth/middleware"

const middleware = (request: NextRequestWithAuth) => {
    console.log('[MIDDLEWARE_NEXTAUTH_TOKEN]: ', request.nextauth.token);
    if (!request.nextauth.token) {
        console.log('Token não encontrado, redirecionando para login.');
    } else {
        console.log('Token encontrado:', request.nextauth.token);
    }
}

const callbackOptions: NextAuthMiddlewareOptions = {}

export default withAuth(middleware, callbackOptions)

export const config = {
    matcher: ['/dashboard','/timeVision'] //'dashboard'
}