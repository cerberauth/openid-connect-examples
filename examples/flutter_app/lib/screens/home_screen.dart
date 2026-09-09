import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../auth/auth_service.dart';
import '../auth/auth_state.dart';
import '../widgets/app_button.dart';

/// Mirrors home.tsx from react-spa.
/// Shows login button when unauthenticated, user profile + logout when authenticated.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Mirrors AuthProvider useEffect for session restore on mount
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AuthService>().initialize();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthState>();
    final authService = context.read<AuthService>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter OIDC Example'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: authState.isLoading
            ? const CircularProgressIndicator()
            : Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Flutter App Example using OpenID Connect',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    if (authState.isAuthenticated) ...[
                      if (authState.user?['picture'] != null)
                        ClipOval(
                          child: Image.network(
                            authState.user!['picture'] as String,
                            width: 80,
                            height: 80,
                            fit: BoxFit.cover,
                          ),
                        ),
                      const SizedBox(height: 16),
                      if (authState.user?['name'] != null)
                        Text(
                          authState.user!['name'] as String,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      if (authState.user?['email'] != null)
                        Text(
                          authState.user!['email'] as String,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      const SizedBox(height: 24),
                      AppButton(
                        onPressed: authService.logout,
                        child: const Text('Logout'),
                      ),
                    ] else ...[
                      AppButton(
                        onPressed: authService.login,
                        child: const Text('Login with OpenID Connect'),
                      ),
                    ],
                    if (authState.error != null) ...[
                      const SizedBox(height: 16),
                      Text(
                        authState.error!,
                        style: const TextStyle(color: Colors.red),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ],
                ),
              ),
      ),
    );
  }
}
