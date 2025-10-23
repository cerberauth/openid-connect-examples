# Flutter OpenID Connect Example

A Flutter mobile app demonstrating the **Authorization Code Flow with PKCE** using OpenID Connect. This example mirrors the architecture of the [react-spa](../react-spa) example, translated to Flutter idioms.

## Prerequisites

- Flutter SDK >= 3.8.0
- An OpenID Connect provider (defaults to [CerberAuth testid](https://testid.cerberauth.com))

## Setup

### 1. Install dependencies

```bash
flutter pub get
```

### 2. Configure environment

Edit `assets/.env`:

```dotenv
OIDC_ISSUER=https://testid.cerberauth.com
OIDC_CLIENT_ID=c6c0c0ec-09e0-448e-a856-3e596c3bdd9d
OIDC_REDIRECT_URL=com.example.flutterapp://callback
OIDC_POST_LOGOUT_REDIRECT_URL=com.example.flutterapp://
```

### 3. Register the redirect URI

Register `com.example.flutterapp://callback` as a redirect URI in your OIDC provider's client configuration.

### 4. Run the app

```bash
# Android
flutter run

# iOS (requires macOS with Xcode)
flutter run -d ios
```

## Configuration

| Variable | Description |
|---|---|
| `OIDC_ISSUER` | Base URL of your OIDC provider |
| `OIDC_CLIENT_ID` | Client ID registered with the provider |
| `OIDC_REDIRECT_URL` | Custom scheme redirect URI for the app |
| `OIDC_POST_LOGOUT_REDIRECT_URL` | URI to return to after logout |

## Architecture

This example mirrors the react-spa pattern mapping:

| React SPA | Flutter |
|---|---|
| `AuthProvider.tsx` + `context.ts` | `lib/auth/auth_state.dart` (ChangeNotifier) |
| `useAuth.ts` hook | `lib/auth/auth_service.dart` |
| `AuthProvider` wrapping app | `ChangeNotifierProvider` + `ProxyProvider` in `main.dart` |
| `home.tsx` | `lib/screens/home_screen.dart` |
| `Button.tsx` | `lib/widgets/app_button.dart` |
| Vite `.env` | `assets/.env` via `flutter_dotenv` |

### Key files

- **`lib/auth/auth_state.dart`** — Holds all authentication state; notifies the widget tree on changes
- **`lib/auth/auth_service.dart`** — Implements `initialize()`, `login()`, and `logout()` using `flutter_appauth`
- **`lib/screens/home_screen.dart`** — Main screen; shows login button or user profile depending on auth state
- **`lib/widgets/app_button.dart`** — Reusable styled button component

## Running Tests

```bash
flutter test
```
