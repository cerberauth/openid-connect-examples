import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';

import 'auth/auth_service.dart';
import 'auth/auth_state.dart';
import 'screens/home_screen.dart';

/// Mirrors main.tsx + App.tsx from react-spa.
/// Sets up ChangeNotifierProvider (AuthState) and ProxyProvider (AuthService),
/// mirroring React Context + AuthProvider wrapping the app tree.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: 'assets/.env');
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthState()),
        ProxyProvider<AuthState, AuthService>(
          update: (_, authState, __) => AuthService(
            authState,
            clientId: dotenv.get('OIDC_CLIENT_ID'),
            issuer: dotenv.get('OIDC_ISSUER'),
            redirectUrl: dotenv.get('OIDC_REDIRECT_URL'),
            postLogoutRedirectUrl:
                dotenv.get('OIDC_POST_LOGOUT_REDIRECT_URL'),
          ),
        ),
      ],
      child: MaterialApp(
        title: 'Flutter OIDC Example',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        ),
        home: const HomeScreen(),
      ),
    );
  }
}
