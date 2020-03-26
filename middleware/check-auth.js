export default function ({ app, $auth, redirect }) {
  if (!$auth.loggedIn) {
    console.log('[check-auth] Not logged in, redirecting to login.')
    return redirect('/login')
  }
}
