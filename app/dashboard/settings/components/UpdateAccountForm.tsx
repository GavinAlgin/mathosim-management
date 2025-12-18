"use client";

import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { UserAttributes } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

export default function UpdateAccountForm() {
  const user = useUser();

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  // Populate fields from user
  useEffect(() => {
    if (!user) return;

    setEmail(user.email ?? "");
    setName((user.user_metadata?.username as string) ?? "");
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    setStatus("");

    try {
      /** 1️⃣ Update auth email / password */
      const authUpdates: UserAttributes = {};

      if (email && email !== user.email) {
        authUpdates.email = email;
      }

      if (password.trim().length > 0) {
        authUpdates.password = password;
      }

      if (Object.keys(authUpdates).length > 0) {
        const { error } = await supabase.auth.updateUser(authUpdates);
        if (error) throw error;
      }

      /** 2️⃣ Update username in public users table */
      if (name.trim().length > 0) {
        const { error } = await supabase
          .from("users")
          .update({ username: name })
          .eq("id", user.id);

        if (error) throw error;
      }

      setStatus("✅ Profile updated successfully");
      setPassword("");
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Leave empty to keep current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button onClick={updateProfile} disabled={loading || !user}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      {status && <p className="text-sm mt-2">{status}</p>}
    </div>
  );
}



// "use client";

// import { useState, useEffect } from "react";
// import { useUser } from "@supabase/auth-helpers-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { supabase } from "@/lib/supabaseClient";

// export default function UpdateAccountForm() {
//   const user = useUser();

//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");

//   // Populate form fields once user is loaded
//   useEffect(() => {
//     if (user) {
//       setEmail(user.email || "");
//       setName(user.user_metadata?.username || "");
//     }
//   }, [user]);

//   const updateProfile = async () => {
//     if (!user) return;

//     setLoading(true);
//     setStatus("");

//     // Update email via auth
//     const { error: emailError } = await supabase.auth.updateUser({
//       email,
//     });

//     // Update username in public users table
//     const { error: nameError } = await supabase
//       .from("users")
//       .update({ username: name })
//       .eq("id", user.id);

//     setLoading(false);

//     if (emailError || nameError) {
//       setStatus("❌ Failed to update profile.");
//       console.error("Email error:", emailError);
//       console.error("Username error:", nameError);
//     } else {
//       setStatus("✅ Profile updated successfully!");
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <Label className="mb-3">Email</Label>
//         <Input
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           type="email"
//         />
//       </div>
//       <div>
//         <Label className="mb-3">Username</Label>
//         <Input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           type="text"
//         />
//       </div>
//       <Button onClick={updateProfile} disabled={loading || !user}>
//         {loading ? "Saving..." : "Save Changes"}
//       </Button>
//       {status && <p className="text-sm mt-2">{status}</p>}
//     </div>
//   );
// }
