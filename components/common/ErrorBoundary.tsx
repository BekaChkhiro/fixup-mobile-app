import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.icon}>!</Text>
            <Text style={styles.title}>შეცდომა</Text>
            <Text style={styles.description}>
              აპლიკაციაში მოხდა შეცდომა. გთხოვთ სცადოთ თავიდან.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.errorDetails}>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.errorStack}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
              <Text style={styles.buttonText}>თავიდან ცდა</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  icon: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.error[500],
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.error[100],
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 80,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorDetails: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: colors.error[600],
    fontFamily: 'monospace',
  },
  errorStack: {
    ...typography.caption,
    color: colors.gray[600],
    fontFamily: 'monospace',
    marginTop: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});
