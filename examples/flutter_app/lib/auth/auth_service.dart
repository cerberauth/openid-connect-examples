import 'dart:convert';

import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import 'auth_state.dart';

/// Mirrors useAuth.ts from react-spa.
/// Handles OIDC Authorization Code Flow with PKCE via flutter_appauth.
class AuthService {
  final AuthState _authState;
  final String _clientId;
  final String _issuer;
  final String _redirectUrl;
  final String _postLogoutRedirectUrl;

  final FlutterAppAuth _appAuth;
  final FlutterSecureStorage _secureStorage;

  static const _scopes = ['openid', 'profile', 'email'];

  String? _userInfoEndpoint;

  AuthService(
    this._authState, {
    required String clientId,
    required String issuer,
    required String redirectUrl,
    required String postLogoutRedirectUrl,
    FlutterAppAuth? appAuth,
    FlutterSecureStorage? secureStorage,
  })  : _clientId = clientId,
        _issuer = issuer,
        _redirectUrl = redirectUrl,
        _postLogoutRedirectUrl = postLogoutRedirectUrl,
        _appAuth = appAuth ?? const FlutterAppAuth(),
        _secureStorage = secureStorage ?? const FlutterSecureStorage();

  String get _discoveryUrl => '$_issuer/.well-known/openid-configuration';

  /// Mirrors session restore logic from AuthProvider.tsx useEffect.
  /// Reads stored refresh token and exchanges it for new tokens on startup.
  Future<void> initialize() async {
    _authState.setLoading(true);
    _authState.setError(null);
    try {
      final storedRefreshToken =
          await _secureStorage.read(key: 'refresh_token');
      if (storedRefreshToken == null) return;

      final result = await _appAuth.token(
        TokenRequest(
          _clientId,
          _redirectUrl,
          refreshToken: storedRefreshToken,
          discoveryUrl: _discoveryUrl,
          scopes: _scopes,
        ),
      );

      await _persistTokens(result);
      final accessToken = result.accessToken;
      if (accessToken != null) {
        final user = await _fetchUserInfo(accessToken);
        _authState.setSession(
          accessToken: accessToken,
          idToken: result.idToken,
          user: user,
        );
      }
    } catch (_) {
      // Silently clear stale tokens if refresh fails
      await _clearTokens();
    } finally {
      _authState.setLoading(false);
    }
  }

  /// Mirrors the login() function from useAuth.ts.
  /// Opens browser for Authorization Code Flow with PKCE via AppAuth SDK.
  Future<void> login() async {
    _authState.setLoading(true);
    _authState.setError(null);
    try {
      final result = await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          _clientId,
          _redirectUrl,
          discoveryUrl: _discoveryUrl,
          scopes: _scopes,
        ),
      );

      await _persistTokens(result);
      final accessToken = result.accessToken;
      if (accessToken != null) {
        final user = await _fetchUserInfo(accessToken);
        _authState.setSession(
          accessToken: accessToken,
          idToken: result.idToken,
          user: user,
        );
      }
    } catch (e) {
      _authState.setError(e.toString());
    } finally {
      _authState.setLoading(false);
    }
  }

  /// Mirrors the logout() function from useAuth.ts.
  /// Calls end_session endpoint then clears local state.
  Future<void> logout() async {
    _authState.setLoading(true);
    _authState.setError(null);
    try {
      final idToken = await _secureStorage.read(key: 'id_token');
      await _appAuth.endSession(
        EndSessionRequest(
          idTokenHint: idToken,
          postLogoutRedirectUrl: _postLogoutRedirectUrl,
          discoveryUrl: _discoveryUrl,
        ),
      );
    } catch (e) {
      _authState.setError(e.toString());
    } finally {
      await _clearTokens();
      _authState.clearSession();
      _authState.setLoading(false);
    }
  }

  /// Fetches user profile from the OIDC userinfo endpoint.
  /// Mirrors the userInfo fetch in useAuth.ts after token exchange.
  Future<Map<String, dynamic>> _fetchUserInfo(String accessToken) async {
    _userInfoEndpoint ??= await _discoverUserInfoEndpoint();

    final response = await http.get(
      Uri.parse(_userInfoEndpoint!),
      headers: {'Authorization': 'Bearer $accessToken'},
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to fetch user info: ${response.statusCode}');
    }

    return json.decode(response.body) as Map<String, dynamic>;
  }

  Future<String> _discoverUserInfoEndpoint() async {
    final response =
        await http.get(Uri.parse(_discoveryUrl));
    if (response.statusCode != 200) {
      throw Exception(
          'Failed to fetch OIDC discovery document: ${response.statusCode}');
    }
    final doc = json.decode(response.body) as Map<String, dynamic>;
    return doc['userinfo_endpoint'] as String;
  }

  Future<void> _persistTokens(TokenResponse response) async {
    await Future.wait([
      _secureStorage.write(key: 'access_token', value: response.accessToken),
      _secureStorage.write(key: 'refresh_token', value: response.refreshToken),
      _secureStorage.write(key: 'id_token', value: response.idToken),
    ]);
  }

  Future<void> _clearTokens() async {
    await Future.wait([
      _secureStorage.delete(key: 'access_token'),
      _secureStorage.delete(key: 'refresh_token'),
      _secureStorage.delete(key: 'id_token'),
    ]);
  }
}
