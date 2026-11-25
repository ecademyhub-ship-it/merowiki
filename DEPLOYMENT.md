# Production deployment

Production deploys automatically when a commit is pushed to `main` and both
frontend and backend CI jobs pass. The workflow connects to a Linux server over
SSH, updates the existing checkout, and runs `docker compose up -d --build`.
Pull requests and other branches run CI only.

## Prepare the server

1. Use a Linux server with Docker Engine and the Docker Compose plugin installed.
   Configure DNS and HTTPS termination for `merowiki.com` and
   `www.merowiki.com`; the Compose frontend listens on port 80.
2. Create a deployment user with permission to run Docker, then clone this
   repository's `main` branch into the absolute deployment directory. For a
   private repository, configure a read-only GitHub deploy key for this clone.
   Keep the checkout on `main` and do not make manual changes to tracked files.
3. Create `backend/.env` in that checkout and restrict access to it:

   ```sh
   chmod 600 backend/.env
   ```

   Required values (use your production database's real connection details):

   ```dotenv
   SECRET_KEY=replace-with-a-long-random-django-secret
   DBNAME=your_database
   DBUSER=your_database_user
   DBPASS=your_database_password
   DBHOST=your_database_host
   DBPORT=5432
   ```

   `DBHOST` must be reachable from the backend container. Compose does not
   create a database service, so provide a managed PostgreSQL database or run
   one separately. Do not commit this file; it is Git-ignored and excluded from
   the backend Docker build context.

   If the app uses email, also set `EmailBackend`, `EMAIL_HOST`, `EMAIL_PORT`,
   `EMAIL_NAME`, and `EMAIL_PASSWORD`. Google sign-in uses
   `GOOGLE_CLIENT_ID` in the backend. These are only needed when those features
   are enabled.

## Configure GitHub Actions

In the repository, open **Settings → Secrets and variables → Actions**. Add
these **repository variables**:

| Variable | Value |
| --- | --- |
| `DEPLOY_HOST` | Server IP address or SSH hostname |
| `DEPLOY_USER` | SSH deployment username |
| `DEPLOY_PATH` | Absolute path to the server checkout, e.g. `/srv/merowiki` |
| `DEPLOY_KNOWN_HOSTS` | Verified SSH host-key line(s) for the server |

Add this **repository secret**:

| Secret | Value |
| --- | --- |
| `DEPLOY_SSH_KEY` | Private key for a dedicated deployment keypair; install its public key in the deployment user's `~/.ssh/authorized_keys` |

Obtain the server host key with `ssh-keyscan -H <server-host>` and verify its
fingerprint against a trusted source before saving the output as
`DEPLOY_KNOWN_HOSTS`. Do not replace host-key verification with
`StrictHostKeyChecking=no`.

The workflow's SSH key is only for connecting from GitHub Actions to the
server. If the repository is private, the server separately needs read access
to fetch the repository.

## Frontend build configuration

The optional `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` values are public
frontend build configuration, not secrets. Set them in a root `.env` file next
to `docker-compose.yml` on the server if needed. The API URL can stay unset
when the frontend uses the same domain; Nginx then proxies `/api/` to Django.
The Google client ID should match the backend `GOOGLE_CLIENT_ID`. Values
starting with `VITE_` are embedded in public browser assets, so never put
passwords, tokens, or private keys in them.
