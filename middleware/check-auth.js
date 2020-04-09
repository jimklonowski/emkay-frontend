/**
 * This middleware acts as a navigation guard and redirects to login if $auth.loggedIn is false
 */
export default ({ app, $auth, redirect }) => {
  if (!$auth.loggedIn) {
    // console.log('[check-auth] Not logged in, redirecting to login.')
    redirect(app.localePath({ path: '/login' }))
  }
}
