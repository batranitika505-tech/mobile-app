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
  CheckCircle2,
  Droplets,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/layout';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, isConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState<boolean>(false);

  const validate = (): string | null => {
    if (!fullName.trim()) {
      return 'Please enter your full name.';
    }
    if (fullName.trim().length < 2) {
      return 'Name must be at least 2 characters long.';
    }
    if (!email.trim()) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!password) {
      return 'Please enter a password.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleRegister = async () => {
    setErrorMessage(null);
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await signUp(email, password, fullName);

      if (res.error) {
        setErrorMessage(res.error);
        return;
      }

      if (res.requiresEmailConfirmation) {
        setConfirmationNotice(true);
        return;
      }

      // If registered and logged in immediately
      router.replace('/(tabs)/profile');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (confirmationNotice) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card variant="highlight" style={styles.confirmCard}>
            <View style={styles.iconCircleSuccess}>
              <CheckCircle2 size={40} color={Colors.sustainableGreen} />
            </View>
            <Text style={styles.confirmTitle}>Verification Email Sent</Text>
            <Text style={styles.confirmDesc}>
              We sent a verification link to <Text style={styles.boldText}>{email.trim()}</Text>.
            </Text>
            <Text style={styles.confirmSub}>
              Please check your inbox and verify your email address to activate your JalRakshak
              guardian account. Once verified, you can sign in to sync your progress.
            </Text>

            <Button
              title="Go to Sign In"
              variant="primary"
              size="lg"
              onPress={() => router.replace('/auth/login' as any)}
              style={styles.confirmBtn}
            />
          </Card>
        </ScrollView>
      </View>
    );
  }

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
            <UserPlus size={32} color={Colors.turquoise} />
          </View>
          <Text style={styles.title}>Create Guardian Account</Text>
          <Text style={styles.subtitle}>
            Register to safeguard your water conservation milestones, earn verified certificates, and
            sync achievements.
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
          {/* Full Name field */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <User size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errorMessage) setErrorMessage(null);
              }}
              editable={!loading}
            />
          </View>

          {/* Email field */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. guardian@example.com"
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
          <Text style={styles.inputLabel}>Password (min 6 characters)</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Create a secure password"
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

          {/* Confirm Password field */}
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={18} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeBtn}>
              {showConfirmPassword ? (
                <EyeOff size={18} color={Colors.textMuted} />
              ) : (
                <Eye size={18} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          </View>

          <Button
            title={loading ? 'Registering...' : 'Create Account'}
            variant="primary"
            size="lg"
            onPress={handleRegister}
            disabled={loading}
            icon={
              loading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <ShieldCheck size={20} color={Colors.white} />
              )
            }
            style={styles.submitBtn}
          />
        </Card>

        {/* Existing account prompt */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => router.push('/auth/login' as any)}
            disabled={loading}>
            <Text style={styles.linkText}>Sign In</Text>
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
    paddingTop: Spacing.lg,
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
  iconCircleSuccess: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.navyDark,
    borderWidth: 2,
    borderColor: Colors.sustainableGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    alignSelf: 'center',
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
  confirmCard: {
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  confirmDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  boldText: {
    color: Colors.turquoise,
    fontWeight: '700',
  },
  confirmSub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  confirmBtn: {
    width: '100%',
  },
});
