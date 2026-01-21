import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, LogBox } from 'react-native';
import { QueryProvider } from '@/providers/QueryProvider';
import { LayoutProvider } from '@/providers/LayoutProvider';
import { ErrorBoundary } from '@/components/common';
import { colors } from '@/constants/colors';

// Suppress non-critical warnings in production
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
]);

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    background: colors.background,
    surface: colors.surface,
    error: colors.error[500],
  },
};

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <QueryProvider>
          <LayoutProvider>
            <PaperProvider theme={theme}>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="service/[id]"
                  options={{
                    headerShown: true,
                    title: '',
                    headerBackTitle: 'უკან',
                  }}
                />
                <Stack.Screen
                  name="category/[id]"
                  options={{
                    headerShown: true,
                    title: '',
                    headerBackTitle: 'უკან',
                  }}
                />
                <Stack.Screen
                  name="mechanic/[id]"
                  options={{
                    headerShown: true,
                    title: 'მექანიკი',
                    headerBackTitle: 'უკან',
                  }}
                />
                <Stack.Screen
                  name="laundry/[id]"
                  options={{
                    headerShown: true,
                    title: 'სამრეცხაო',
                    headerBackTitle: 'უკან',
                  }}
                />
                <Stack.Screen
                  name="drive/[id]"
                  options={{
                    headerShown: true,
                    title: 'დრაივი',
                    headerBackTitle: 'უკან',
                  }}
                />
              </Stack>
              <StatusBar style="auto" />
            </PaperProvider>
          </LayoutProvider>
        </QueryProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
