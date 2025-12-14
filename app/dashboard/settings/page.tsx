"use client";

import { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"; 
import { Separator } from "@/components/ui/separator";
import UpdateAccountForm from "./components/UpdateAccountForm";
import SecuritySettings from "./components/SecuritySettings";
import NotificationSettings from "./components/NotificationsSettings";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [tab, setTab] = useState<"account" | "security" | "notifications">("account");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  /** Check logged in user sessions */
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/");
        return;
      }

      setCheckingAuth(false);
    };

    checkSession();
  }, [router]);

  if (checkingAuth) {
    return (     
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
    )
  }

  return (
    <div className="w-full mx-auto py-8 space-y-6">
      {/* 🚧 Notifications header */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-yellow-700 font-medium">
          ⚠️ Our organization is still working on the settings page. Some features may not be available yet.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v)} className="max-w-xl">
        <TabsList className="w-full">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-8 pt-4">
          <section>
            <h2 className="text-xl font-semibold">Profile Info</h2>
            <p className="text-[12px] text-gray-400 mb-4">Manage your profile account</p>
            <Separator className="mb-6"/>
            <UpdateAccountForm />
          </section>
          <Separator />
          <section>
            <h2 className="text-xl font-semibold">Preferences</h2>
            <p className="text-gray-600">(coming soon)</p>
          </section>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-8 pt-4">
          <section>
            <h2 className="text-xl font-semibold">Security Settings</h2>
            <p className="text-[12px] text-gray-400 mb-4">Manage your profile security and devices</p>
            <Separator className="mb-6"/>
            <SecuritySettings />
          </section>
          <Separator />
          <section>
            <h2 className="text-xl font-semibold">Two‑Factor Authentication</h2>
            <p className="text-gray-600">(coming soon)</p>
          </section>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-8 pt-4">
            <h2 className="text-xl font-semibold">Notifications Settings</h2>
            <p className="text-[12px] text-gray-400 mb-4">Enable and disable notifications settings</p>
            <Separator className="mb-6"/>
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
