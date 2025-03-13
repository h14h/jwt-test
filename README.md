# Supabase bad_jwt issue

After running the edge function in this repo, the following logs are produced:

```
LOG: Hello from Functions!
LOG: Auth Header: Bearer <supabase_anon_key>
LOG: Token: <supabase_anon_key>
LOG: User Data: { user: null }
LOG: User Error: AuthApiError: invalid claim: missing sub claim
    at handleError (file:///var/tmp/sb-compile-edge-runtime/node_modules/localhost/@supabase/auth-js/2.68.0/dist/main/lib/fetch.js:69:11)
    at eventLoopTick (ext:core/01_core.js:168:7)
    at async _handleRequest (file:///var/tmp/sb-compile-edge-runtime/node_modules/localhost/@supabase/auth-js/2.68.0/dist/main/lib/fetch.js:114:9)
    at async _request (file:///var/tmp/sb-compile-edge-runtime/node_modules/localhost/@supabase/auth-js/2.68.0/dist/main/lib/fetch.js:95:18)
    at async SupabaseAuthClient._getUser (file:///var/tmp/sb-compile-edge-runtime/node_modules/localhost/@supabase/auth-js/2.68.0/dist/main/GoTrueClient.js:881:24)
    at async SupabaseAuthClient.getUser (file:///var/tmp/sb-compile-edge-runtime/node_modules/localhost/@supabase/auth-js/2.68.0/dist/main/GoTrueClient.js:870:20)
    at async Object.handler (file:///Users/h14h/code/pro/jwt-test/supabase/functions/hello-jwt/index.ts:15:27)
    at async respond (ext:sb_core_main_js/js/http.js:197:14) {
  __isAuthError: true,
  name: "AuthApiError",
  status: 403,
  code: "bad_jwt"
}
```
