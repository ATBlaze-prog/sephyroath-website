/**
 * Admin Settings Page
 */

'use client';

export default function AdminSettings() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Website Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Discord Server Invite Link
            </label>
            <input
              type="text"
              placeholder="https://discord.gg/..."
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Website Title
            </label>
            <input
              type="text"
              placeholder="SephyrOath Gaming"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Website Description
            </label>
            <textarea
              placeholder="Website description..."
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            />
          </div>

          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
