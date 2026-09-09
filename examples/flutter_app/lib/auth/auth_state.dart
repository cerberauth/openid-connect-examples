import 'package:flutter/foundation.dart';

/// Mirrors AuthProvider.tsx + context.ts from react-spa.
/// Holds all authentication state and notifies listeners on change.
class AuthState extends ChangeNotifier {
  String? _accessToken;
  String? _idToken;
  Map<String, dynamic>? _user;
  bool _isLoading = false;
  String? _error;

  String? get accessToken => _accessToken;
  String? get idToken => _idToken;
  Map<String, dynamic>? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void setError(String? value) {
    _error = value;
    notifyListeners();
  }

  void setSession({
    String? accessToken,
    String? idToken,
    Map<String, dynamic>? user,
  }) {
    _accessToken = accessToken;
    _idToken = idToken;
    _user = user;
    notifyListeners();
  }

  void clearSession() => setSession();
}
