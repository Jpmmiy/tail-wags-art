import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const createUserTask = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    email: z.string().email(),
    password: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // 1. Create or get user
    const { data: userRecord, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { created_manually: true }
    });

    let userId = userRecord?.user?.id;
    let note = "User created";

    if (authError?.message.includes('already registered')) {
      const { data: existingUser } = await supabaseAdmin.from('profiles').select('id').eq('email', data.email).single();
      userId = existingUser?.id;
      note = "User already existed, updated instead";
      
      // Update password for existing user
      await supabaseAdmin.auth.admin.updateUserById(userId!, {
        password: data.password
      });
    } else if (authError) {
      throw new Error(`Auth Error: ${authError.message}`);
    }

    if (!userId) throw new Error("Could not determine User ID");

    // 2. Set Vitalicio tier
    const { error: profileError } = await supabaseAdmin.from('profiles').update({
      tier: 'vitalicio',
      credits: 9999,
      updated_at: new Date().toISOString()
    }).eq('id', userId);

    if (profileError) throw new Error(`Profile Error: ${profileError.message}`);

    // 3. Ensure role
    await supabaseAdmin.from('user_roles').upsert({
      user_id: userId,
      role: 'user'
    }, { onConflict: 'user_id,role' });

    return { success: true, userId, note };
  });
