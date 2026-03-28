module.exports = {
  apps: [
    {
      name: "naveencodes-ai-backend",
      script: "./apps/backend/dist/index.js",
      cwd: __dirname,
      interpreter: process.env.PM2_NODE_PATH || "/opt/alt/alt-nodejs22/root/usr/bin/node",
      env: {
        NODE_ENV: "production"
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "700M",
      time: true,
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-error.log",
      merge_logs: true
    }
  ]
};
