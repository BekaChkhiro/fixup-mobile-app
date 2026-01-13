import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { QueryProvider } from '@/providers/QueryProvider';
import { LayoutProvider } from '@/providers/LayoutProvider';
import { colors } from '@/constants/colors';

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
