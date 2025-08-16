"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Globe,
  Palette,
} from "lucide-react";
import ConnectWallet from "@/components/Web3/ConnectWallet";

interface UserSettings {
  notifications: {
    priceAlerts: boolean;
    yieldUpdates: boolean;
    securityAlerts: boolean;
    weeklyReports: boolean;
  };
  display: {
    theme: "light" | "dark" | "auto";
    currency: "USD" | "EUR" | "GBP";
    language: "en" | "es" | "fr";
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    autoLogout: boolean;
  };
}

export default function SettingsPage() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      priceAlerts: true,
      yieldUpdates: true,
      securityAlerts: true,
      weeklyReports: false,
    },
    display: {
      theme: "auto",
      currency: "USD",
      language: "en",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      autoLogout: true,
    },
  });

  useEffect(() => {
    if (isConnected && address) {
      setUser({
        address,
        balance: 2500,
        isNewUser: false,
        riskProfile: "moderate",
      });
    }
  }, [isConnected, address]);

  const handleRiskProfileChange = (
    profile: "conservative" | "moderate" | "aggressive"
  ) => {
    if (user) {
      setUser({ ...user, riskProfile: profile });
    }
  };

  const handleSettingChange = (
    category: keyof UserSettings,
    key: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your profile, preferences, and app settings
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user.address.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              <p className="text-gray-600">{user.address}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Profile
              </label>
              <div className="flex space-x-3">
                {(["conservative", "moderate", "aggressive"] as const).map(
                  (profile) => (
                    <button
                      key={profile}
                      onClick={() => handleRiskProfileChange(profile)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        user.riskProfile === profile
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {profile.charAt(0).toUpperCase() + profile.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <p className="text-xs text-gray-500">
                    {key === "priceAlerts" &&
                      "Get notified of significant price changes"}
                    {key === "yieldUpdates" &&
                      "Receive updates when yields change"}
                    {key === "securityAlerts" &&
                      "Important security notifications"}
                    {key === "weeklyReports" &&
                      "Weekly portfolio performance summary"}
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange("notifications", key, !value)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Display</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={settings.display.theme}
                onChange={(e) =>
                  handleSettingChange("display", "theme", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={settings.display.currency}
                onChange={(e) =>
                  handleSettingChange("display", "currency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.display.language}
                onChange={(e) =>
                  handleSettingChange("display", "language", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Two-Factor Authentication
                </label>
                <p className="text-xs text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    "security",
                    "twoFactorAuth",
                    !settings.security.twoFactorAuth
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.security.twoFactorAuth
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.twoFactorAuth
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  handleSettingChange(
                    "security",
                    "sessionTimeout",
                    parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Auto Logout
                </label>
                <p className="text-xs text-gray-500">
                  Automatically log out after session timeout
                </p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    "security",
                    "autoLogout",
                    !settings.security.autoLogout
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.security.autoLogout ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.autoLogout
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
