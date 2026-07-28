from supabase import create_client, Client

from config import settings

# Service-role client: backend already verified the user via JWT,
# so it's safe to bypass RLS here. Never expose this key to the frontend.
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key,
)
