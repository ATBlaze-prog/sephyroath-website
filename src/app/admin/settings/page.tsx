'use client';

import { useEffect, useState } from 'react';

const DEFAULT_SETTINGS = {
  discord_invite: '',
  site_title: '',
  site_description: '',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Unable to load settings');

        const values = json.data.reduce((acc: Record<string, string>, item: any) => {
          acc[item.key] = item.valueUrl || '';
          return acc;
        }, {});

        setSettings({
          discord_invite: values.discord_invite || '',
          site_title: values.site_title || '',
          site_description: values.site_description || '',
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const saveSetting = async (key: string, value: string) => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, valueUrl: value }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unable to save setting');
      setMessage('Settings saved successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    await Promise.all([
      saveSetting('discord_invite', settings.discord_invite),
      saveSetting('site_title', settings.site_title),
      saveSetting('site_description', settings.site_description),
    ]);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Website Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="discordInvite">
              Discord Server Invite Link
            </label>
            <input
              id="discordInvite"
              type="text"
              placeholder="https://discord.gg/..."
              value={settings.discord_invite}
              onChange={(event) => setSettings({ ...settings, discord_invite: event.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="siteTitle">
              Website Title
            </label>
            <input
              id="siteTitle"
              type="text"
              placeholder="SephyrOath Gaming"
              value={settings.site_title}
              onChange={(event) => setSettings({ ...settings, site_title: event.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="siteDescription">
              Website Description
            </label>
            <textarea
              id="siteDescription"
              placeholder="Website description..."
              value={settings.site_description}
              onChange={(event) => setSettings({ ...settings, site_description: event.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              rows={5}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>

          {message && <p className="text-sm text-so-gray-300">{message}</p>}
          {loading && <p className="text-sm text-so-gray-400">Loading current settings…</p>}
        </form>
      </div>
    </div>
  );
}
