import 'package:flutter/material.dart';

/// Mirrors Button.tsx from react-spa.
/// A reusable ElevatedButton with consistent dark styling.
class AppButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final Widget child;

  const AppButton({
    super.key,
    required this.onPressed,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: child,
    );
  }
}
