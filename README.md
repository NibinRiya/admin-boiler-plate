
# Admin Boiler Plate

Professional, production-ready Node.js + Express boilerplate with MongoDB integration.

## Requirements

- Node.js >= 18
- npm >= 9 (or use yarn)
- MongoDB (connection URL configured via environment variables)

## Installation

1. Clone the repository:

	 git clone <repository-url>
	 cd admin-boiler-plate

2. Install dependencies:

```bash
npm install
```

3. Create environment file from the example and update values:

```bash
cp .env.example .env
# then edit .env to set MONGO_URI, JWT_SECRET, PORT, etc.
```

## Build & Run

- Development (auto-restarts the server on file changes):

```bash
npm run dev
```

- Local build (lint + tests + validation):

```bash
npm run build
```

- Production build (prepares `dist/` with source and pruned package.json):

```bash
npm run build:prod
```

After running `npm run build:prod`, deploy or copy the `dist/` folder to your server and install production dependencies there:

```bash
cd dist
npm install --production
node server.js
```

## Folder Structure

Top-level layout:

```
dist/                # Production-ready copy (created by build:prod)
src/                 # Application source code
	config/            # Configuration (db, env, swagger)
	middlewares/       # Express middlewares (auth, errors, rate limiting)
	modules/           # Feature modules (auth, product, user, ...)
	routes/            # Route index and routers
	utils/             # Helpers and utilities
tests/               # Unit and integration tests
.env.example         # Example environment variables
package.json
README.md
```

Key files:
- `src/server.js` — app entrypoint
- `src/app.js` — express app setup
- `src/config/db.js` — MongoDB connection

## Deployment

1. Build for production locally or in CI:

```bash
npm run build:prod
```

2. Copy `dist/` to your production host (rsync, scp, CI/CD artifact).

3. On the host:

```bash
cd /path/to/app
npm ci --production
node server.js
```

Notes:
- Use process manager such as `pm2` or systemd to keep the process running and enable restarts on failure.
- Ensure environment variables are provided securely (e.g., vault, environment, or CI secrets).
- In CI pipelines prefer `npm ci` for reproducible installs.

---

If you want, I can also add quick start scripts for Docker or a `pm2` ecosystem file — would you like that?

## Docker (optional)

Quick Dockerfile (place at repo root):

```dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY dist/ ./
EXPOSE 3000
CMD ["node", "server.js"]
```

Example `docker-compose.yml` to run app + MongoDB locally:

```yaml
version: '3.8'
services:
	mongo:
		image: mongo:6
		restart: unless-stopped
		volumes:
			- mongo-data:/data/db
		environment:
			MONGO_INITDB_ROOT_USERNAME: admin
			MONGO_INITDB_ROOT_PASSWORD: secret
		ports:
			- 27017:27017

	app:
		build: .
		depends_on:
			- mongo
		environment:
			- MONGO_URI=mongodb://admin:secret@mongo:27017/appdb?authSource=admin
		ports:
			- 3000:3000

volumes:
	mongo-data:
```

Build and run with:

```bash
docker compose up --build -d
```

## Process manager (`pm2`)

Install globally and use an ecosystem file for production process management:

```bash
npm install -g pm2
```

Sample `ecosystem.config.js`:

```js
module.exports = {
	apps: [
		{
			name: 'admin-boiler-plate',
			script: './server.js',
			cwd: './dist',
			instances: 'max',
			exec_mode: 'cluster',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
```

Start with:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## MongoDB: installation and authentication

Installation (quick):

- macOS: `brew tap mongodb/brew && brew install mongodb-community`
- Ubuntu/Debian: use the official MongoDB repository and `apt install mongodb-org`
- Windows: download the MongoDB Community Server installer or use Chocolatey: `choco install mongodb`.

After installation, start `mongod` (or use the bundled service). By default, MongoDB may start without authentication — enabling auth is recommended for production.

Enable authentication (general steps):

1. If running a fresh DB, create an admin user first (auth disabled while creating the user):

```bash
# connect with mongosh
mongosh
use admin
db.createUser({ user: 'admin', pwd: 'strongPassword', roles: [ { role: 'root', db: 'admin' } ] })
```

2. Enable auth in `mongod.conf` by setting:

```yaml
security:
	authorization: enabled
```

3. Restart `mongod` and connect using credentials:

```bash
mongosh -u admin -p strongPassword --authenticationDatabase admin
```

4. Create an application user bound to the application database with least privilege:

```js
use appdb
db.createUser({ user: 'appuser', pwd: 'appSecret', roles: [{ role: 'readWrite', db: 'appdb' }] })
```

Connection string example with auth:

```
MONGO_URI=mongodb://appuser:appSecret@host:27017/appdb?authSource=admin
```

Security notes:
- Use strong, unique passwords and store secrets in environment variables or a secrets manager.
- Restrict MongoDB network access (bind to internal IPs, use firewalls, or run inside VPC).
- Consider enabling TLS for connections in production.

## API documentation (Swagger)

The project exposes API documentation using `swagger-ui-express` and `swagger-jsdoc`.

- **Swagger UI URL (default):** http://localhost:5000/api/docs
	- Replace `5000` with the value of your `PORT` environment variable if set.
- **Swagger config file:** `src/config/swagger.js` (generates the OpenAPI spec from JSDoc comments)
- **Where docs come from:** JSDoc-style `@swagger` comments in route files under `src/modules/**/*.routes.js` are picked up by `swagger-jsdoc`.

Quick notes:
- To change the docs route, edit `src/app.js` and modify the `app.use('/api/docs', ...)` mount point.
- To add or update an endpoint's documentation, edit the JSDoc `@swagger` comments in the corresponding `*.routes.js` file and restart the server.

Security & production tips:
- Swagger UI is enabled by default. To avoid exposing API docs in production, wrap the `app.use('/api/docs', ...)` line in `src/app.js` with a check such as `if (process.env.SHOW_API_DOCS === 'true')`.
- Alternatively, protect the docs route with basic auth middleware. Example using `express-basic-auth`:

```js
const basicAuth = require('express-basic-auth');
if (process.env.SHOW_API_DOCS === 'true') {
	app.use('/api/docs', basicAuth({ users: { 'admin': process.env.SWAGGER_PASSWORD } }), swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}
```

- If you prefer to serve a static OpenAPI JSON file, generate it with `swagger-jsdoc` and serve from `dist/` during your `build:prod` pipeline.

### Environment variables for Swagger

To enable and protect the Swagger UI, set the following environment variables (recommended for development or protected staging only):

- `SHOW_API_DOCS` — set to `true` to enable the `/api/docs` route (default: disabled)
- `SWAGGER_PASSWORD` — password used for basic auth when `SHOW_API_DOCS` is `true` (default username: `admin`)

Example (PowerShell):

```powershell
$env:SHOW_API_DOCS='true' $env:SWAGGER_PASSWORD='strong-docs-pass' npm run dev
```

Example (macOS / Linux):

```bash
SHOW_API_DOCS=true SWAGGER_PASSWORD=strong-docs-pass npm run dev
```

