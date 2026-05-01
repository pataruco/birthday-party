# Mint a Google OAuth refresh token for the Calendar API.
# Three-step flow: `just auth-url` → `just refresh-token <CODE>` → `just verify`.
# See README.md for the end-to-end walkthrough.

set dotenv-load

# Show available recipes
default:
    @just --list

# Step 1: print the auth URL — open it, sign in, copy the `code` from the redirect
auth-url:
    #!/usr/bin/env fish
    if test -z "$VITE_CLIENT_ID"
        echo "VITE_CLIENT_ID is not set — copy .env.example to .env and fill it in"
        exit 1
    end
    set url "https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar&redirect_uri=http://localhost&client_id=$VITE_CLIENT_ID&response_type=code&access_type=offline&prompt=consent"
    echo ""
    echo "1. Open this URL in your browser:"
    echo ""
    echo "   $url"
    echo ""
    echo "2. Sign in and authorise. Your browser will redirect to:"
    echo "      http://localhost/?code=<URL-ENCODED-CODE>&scope=..."
    echo "   (the page itself will fail to load — that is expected)"
    echo ""
    echo "3. URL-decode the code (e.g. %2F → /) and run:"
    echo "      just refresh-token '<DECODED-CODE>'"
    echo ""

# Step 2: exchange the auth code for a refresh token (paste `refresh_token` into .env)
refresh-token code:
    #!/usr/bin/env fish
    if test -z "$VITE_CLIENT_ID"; or test -z "$VITE_CLIENT_SECRET"
        echo "VITE_CLIENT_ID and VITE_CLIENT_SECRET must both be set in .env"
        exit 1
    end
    curl -s -X POST https://oauth2.googleapis.com/token \
        --data-urlencode "client_id=$VITE_CLIENT_ID" \
        --data-urlencode "client_secret=$VITE_CLIENT_SECRET" \
        --data-urlencode "redirect_uri=http://localhost" \
        --data-urlencode "grant_type=authorization_code" \
        --data-urlencode "code={{ code }}" | jq .

# Step 3: verify the refresh token by exchanging it for a fresh access token
verify:
    #!/usr/bin/env fish
    if test -z "$VITE_CLIENT_ID"; or test -z "$VITE_CLIENT_SECRET"; or test -z "$VITE_REFRESH_TOKEN"
        echo "VITE_CLIENT_ID, VITE_CLIENT_SECRET, and VITE_REFRESH_TOKEN must all be set in .env"
        exit 1
    end
    curl -s -X POST https://oauth2.googleapis.com/token \
        --data-urlencode "client_id=$VITE_CLIENT_ID" \
        --data-urlencode "client_secret=$VITE_CLIENT_SECRET" \
        --data-urlencode "grant_type=refresh_token" \
        --data-urlencode "refresh_token=$VITE_REFRESH_TOKEN" | jq .
