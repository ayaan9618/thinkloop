import jwt
from fastapi import Header, HTTPException
from jwt import PyJWKClient

from config import settings

# Newer Supabase projects sign JWTs asymmetrically (ES256) and publish the
# public key at this JWKS endpoint. Older projects sign with a shared
# HS256 secret instead. We support both so this works regardless of when
# your Supabase project was created.
_jwks_url = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
_jwk_client = PyJWKClient(_jwks_url)


def get_current_user(authorization: str = Header(...)) -> str:
    """
    Verifies the Supabase-issued JWT sent from the frontend and
    returns the authenticated user's id (sub claim).
    Expects header: Authorization: Bearer <token>
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.removeprefix("Bearer ").strip()

    payload = None
    errors = []

    # Try new-style asymmetric (ES256) verification via JWKS first
    try:
        signing_key = _jwk_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
        )
    except Exception as e:  # noqa: BLE001
        errors.append(str(e))

    # Fall back to legacy shared-secret (HS256) verification
    if payload is None:
        try:
            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except Exception as e:  # noqa: BLE001
            errors.append(str(e))

    if payload is None:
        raise HTTPException(status_code=401, detail=f"Invalid token: {errors}")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    return user_id
