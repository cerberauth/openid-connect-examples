import { useAuth } from '../lib/auth/useAuth'

export function Home() {
  const { isAuthenticated, login, logout, user } = useAuth()

  return (
    <div className="relative mb-4 flex items-center justify-center py-[26vh] pt-[18vh] text-gray-900 sm:pt-[26vh]">
      <div className="relative flex w-full flex-col items-center gap-6 px-6 text-center">
        <div className="flex w-full flex-col items-center gap-1.5">
          <h2 className="text-4xl font-semibold tracking-tighter sm:text-5xl [@media(max-width:480px)]:text-[2rem]">
            Federated Credential Management (FedCM) Example
          </h2>
          <p>This example demonstrates how to use Federated Credential Management (FedCM) for OpenID Connect to manage third-party cookies.</p>

          {isAuthenticated ? (
            <>
              <p>Welcome {user?.name}!</p>

              <button
                onClick={() => logout()}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2">
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => login()}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-white hover:bg-slate-900/90 h-10 px-4 py-2"
            >
              Button
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
