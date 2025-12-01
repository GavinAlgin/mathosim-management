"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SecuritySettings() {
  const supabase = createClientComponentClient();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setStatus("");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus("Password updated successfully.");
      setNewPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-3">New Password</Label>
        <Input
          type="password"
          placeholder="**********"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <Button onClick={handleChangePassword} disabled={loading}>
        {loading ? "Updating..." : "Change Password"}
      </Button>
      {status && <p className="text-sm mt-2">{status}</p>}
    </div>
  );
}
