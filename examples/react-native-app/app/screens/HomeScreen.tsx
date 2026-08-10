import { FC } from 'react'
import { StyleSheet, TouchableOpacity, View, type ViewStyle } from 'react-native'

import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import type { AppStackScreenProps } from '@/navigators/AppNavigator'
import { colors } from '@/theme/colors'
import { useAuth } from '@/utils/useAuth'

interface HomeScreenProps extends AppStackScreenProps<'Home'> {}

export const HomeScreen: FC<HomeScreenProps> = () => {
  const { login, logout, isAuthenticated } = useAuth()

  return (
    <Screen style={$root} preset="scroll">
      <View style={styles.main}>
        <Text style={styles.title}>React Native Example using OpenID Connect</Text>
        <Text style={styles.description}>
          This example demonstrates how to authenticate users in a React Native application using
          OpenID Connect Protocol.
        </Text>
        {isAuthenticated ? (
          <TouchableOpacity onPress={() => logout()}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => login()}>
            <Text style={styles.buttonText}>Login with TestID</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.footerText}>
          If you want to checkout out how to implement OpenID Connect in your React Native
          application, take a look at the{' '}
          <Text style={styles.link} onPress={() => console.log('Open source code')}>
            source code
          </Text>
          .
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Proudly part of{' '}
          <Text style={styles.link} onPress={() => console.log('CerberAuth website')}>
            CerberAuth
          </Text>
          community.
        </Text>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    color: colors.tint,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  footer: {
    backgroundColor: colors.background,
    padding: 10,
  },
  footerText: {
    color: colors.textDim,
    fontSize: 14,
  },
  link: {
    color: colors.tint,
  },
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
