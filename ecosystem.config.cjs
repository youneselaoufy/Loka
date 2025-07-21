/**  /home/ec2-user/Loka/ecosystem.config.cjs
 *   PM2 : deux applis — Next.js (front) et Express (back)
 */
module.exports = {
  apps: [
    /* ───────── FRONTEND ───────── */
    {
      name: 'loka',
      cwd: '/home/ec2-user/Loka',
      /* on lance directement `next start` → pas de sous-processus npm */
      script: 'node_modules/.bin/next',
      args: 'start -p 3100 -H 0.0.0.0',
      /* DEV par défaut ─────────────────────────────────────────── */
      env: {
        NODE_ENV: 'development',
        PORT: '3100',
        HOST: '0.0.0.0'
      },
      /* PROD quand on passe --env production ───────────────────── */
      env_production: {
        NODE_ENV: 'production',
        PORT: '3100',
        HOST: '0.0.0.0'
      }
    },

    /* ───────── BACKEND ───────── */
    {
      name: 'loka-backend',
      cwd: '/home/ec2-user/Loka/backend',
      script: 'server.js',
      /* même clé utilisée partout */
      env: {
        NODE_ENV: 'development',
        PORT: '4000',
        JWT_SECRET: 'monSuperSecret123456'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '4000',
        JWT_SECRET: 'monSuperSecret123456'
      }
    }
  ]
};

