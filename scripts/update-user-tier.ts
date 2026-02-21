import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUserTier(email: string, tier: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ tier })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Error updating user:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Updated user ${email} to tier: ${tier}`);
      console.log('User data:', data[0]);
    } else {
      console.log(`❌ User ${email} not found`);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

const email = process.argv[2] || 'socialfunnels@gmail.com';
const tier = process.argv[3] || 'professional';

console.log(`Updating ${email} to ${tier} tier...`);
updateUserTier(email, tier);
