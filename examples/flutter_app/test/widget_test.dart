import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/auth/auth_service.dart';
import 'package:flutter_app/auth/auth_state.dart';
import 'package:flutter_app/screens/home_screen.dart';

/// Manual mock — no build_runner dependency.
/// Avoids native plugin issues (flutter_appauth, flutter_secure_storage) in tests.
class MockAuthService extends AuthService {
  MockAuthService(super.authState)
      : super(
          clientId: 'test-client',
          issuer: 'https://example.com',
          redirectUrl: 'com.example.flutterapp://callback',
          postLogoutRedirectUrl: 'com.example.flutterapp://',
        );

  @override
  Future<void> initialize() async {}

  @override
  Future<void> login() async {}

  @override
  Future<void> logout() async {}
}

Widget _buildTestApp(AuthState authState) {
  final authService = MockAuthService(authState);
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<AuthState>.value(value: authState),
      Provider<AuthService>.value(value: authService),
    ],
    child: const MaterialApp(home: HomeScreen()),
  );
}

void main() {
  testWidgets('shows Login button when not authenticated',
      (WidgetTester tester) async {
    final authState = AuthState();

    await tester.pumpWidget(_buildTestApp(authState));
    await tester.pump();

    expect(find.text('Login with OpenID Connect'), findsOneWidget);
    expect(find.text('Logout'), findsNothing);
  });

  testWidgets('shows user info and Logout button when authenticated',
      (WidgetTester tester) async {
    final authState = AuthState();
    authState.setSession(
      accessToken: 'test-access-token',
      idToken: 'test-id-token',
      user: {
        'name': 'Test User',
        'email': 'test@example.com',
      },
    );

    await tester.pumpWidget(_buildTestApp(authState));
    await tester.pump();

    expect(find.text('Test User'), findsOneWidget);
    expect(find.text('test@example.com'), findsOneWidget);
    expect(find.text('Logout'), findsOneWidget);
    expect(find.text('Login with OpenID Connect'), findsNothing);
  });
}
