import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Droplets,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  UserPlus,
} from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/layout';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!email.trim()) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!password) {
      return 'Please enter your password.';
    }
    return null;
  };

  const handleSignIn = async () => {
    setErrorMessage(null);
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMessage(res.error);
        return;
      }
      // On success, go back to profile or main tabs
      router.replace('/(tabs)/profile');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Header Icon and Title */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Droplets size={32} color={Colors.turquoise} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to sync your JalRakshak conservation progress and certificates across devices.
          </Text>
        </View>

        {!isConfigured && (
          <Card variant="outlined" style={[styles.banner, styles.warningBanner]}>
            <View style={styles.bannerRow}>
              <AlertCircle size={18} color={Colors.warningOrange} />
              <Text style={styles.bannerText}>
                Supabase credentials not fully configured. You can continue playing in offline Guest
                mode.
              </Text>
            </View>
          </Card>
        )}

        {errorMessage && (
          <Card variant="outlined" style={[styles.banner, styles.dangerBanner]}>
            <View style={styles.bannerRow}>
              <AlertCircle size={18} color={Colors.dangerRed} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          </Card>
        )}

        {/* Input Form */}
        <Card variant="default" style={styles.formCard}>
          {/* Email field */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. guardian@jalrakshak.org"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage(null);
              }}
              editable={!loading}
            />
          </View>

          {/* Password field */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}>
              {showPassword ? (
                <EyeOff size={18} color={Colors.textMuted} />
              ) : (
                <Eye size={18} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          </View>

          <Button
            title={loading ? 'Signing in...' : 'Sign In'}
            variant="primary"
            size="lg"
            onPress={handleSignIn}
            disabled={loading}
            icon={loading ? <ActivityIndicator size="small" color={Colors.white} /> : <LogIn size={20} color={Colors.white} />}
            style={styles.submitBtn}
          />
        </Card>

        {/* Alternate Navigation */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>New to JalRakshak?</Text>
          <TouchableOpacity
            onPress={() => router.push('/auth/register' as any)}
            disabled={loading}>
            <Text style={styles.linkText}>Create an Account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/profile')}
          style={styles.guestLink}>
          <Text style={styles.guestLinkText}>← Continue as Guest (Offline Mode)</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.navyDark,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.navyDark,
  },
  content: {
    padding: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.navy,
    borderWidth: 2,
    borderColor: Colors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.turquoiseLight,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: Spacing.sm,
  },
  banner: {
    marginBottom: Spacing.md,
    padding: Spacing.sm,
  },
  warningBanner: {
    borderColor: Colors.warningOrange,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  dangerBanner: {
    borderColor: Colors.dangerRed,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.warningOrange,
    lineHeight: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: Colors.dangerRed,
    fontWeight: '600',
  },
  formCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
    marginTop: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
    height: 48,
  },
  inputIcon: {
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    marginTop: Spacing.sm,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.turquoise,
  },
  guestLink: {
    alignSelf: 'center',
    paddingVertical: Spacing.xs,
  },
  guestLinkText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
