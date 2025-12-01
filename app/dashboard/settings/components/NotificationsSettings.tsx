"use client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label>Email Notifications</Label>
        <Switch  />
      </div>
      <div className="flex items-center justify-between">
        <Label>Push Notifications</Label>
        <Switch  />
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
      </button>
    </div>
  );
}
