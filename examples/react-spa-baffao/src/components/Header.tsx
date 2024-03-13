import React from 'react'
import { useAuth } from '../lib/auth/useAuth'

export const Header: React.FC = () => {
  const { isAuthenticated, login, logout, user } = useAuth()

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div>
        <h1 className="text-2xl font-bold">My App</h1>
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            {user?.picture && (
              <img
                src={user.picture}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            )}
            <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded" onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <>
            <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded" onClick={() => login()}>Login</button>
          </>
        )}
      </div>
    </header>
  );
};
