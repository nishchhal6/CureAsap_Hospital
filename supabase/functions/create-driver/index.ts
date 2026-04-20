import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    const { name, email, password, phone, hospital_id, address, vehicle, license, aadhaar } = body;

    // 1. Create Auth User
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { role: 'driver', hospital_id }
    });
    if (authError) throw authError;
    const driverId = authUser.user.id;

    // 2. Insert into Profiles
    await supabaseClient.from('profiles').insert({
      id: driverId, full_name: name, email, phone, role: 'driver', hospital_id
    });

    // 3. Insert into Drivers (FIXED: Explicitly mapping all fields)
    const { error: driverError } = await supabaseClient.from('drivers').insert({
      id: driverId,
      profile_id: driverId,
      hospital_id: hospital_id,
      name: name,
      email: email,
      phone: phone,
      vehicle: vehicle,
      license: license,
      aadhaar: aadhaar,
      address: address,
      status: 'available'
    });
    if (driverError) throw driverError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});