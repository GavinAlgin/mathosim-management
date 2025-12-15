"use client";

import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

export default function UpdateAccountForm() {
  const user = useUser();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Populate fields
  useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
      setName(user.user_metadata?.username ?? "");
    }
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    setStatus("");

    // 1️⃣ Update auth email / password
    const authUpdates: any = { email };

    if (password.length > 0) {
      authUpdates.password = password;
    }

    const { error: authError } =
      await supabase.auth.updateUser(authUpdates);

    // 2️⃣ Update username in public table
    const { error: nameError } = await supabase
      .from("users")
      .update({ username: name })
      .eq("id", user.id);

    setLoading(false);

    if (authError || nameError) {
      console.error(authError, nameError);
      setStatus("❌ Failed to update profile");
    } else {
      setStatus("✅ Profile updated successfully");
      setPassword(""); // clear password field
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          placeholder={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <Label>Username</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label>New Password</Label>
        <Input
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
