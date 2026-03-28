module.exports = {
  apps: [
    {
      name: "naveencodes-ai-frontend",
      script: "npm",
      args: "run start --workspace @naveencodes/frontend",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "700M",
      time: true,
      out_file: "./logs/frontend-out.log",
      error_file: "./logs/frontend-error.log",
      merge_logs: true
    },
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
    },
    {
      name: "naveencodes-ai-chrome",
      script: "./scripts/run-headless-chrome.sh",
      cwd: __dirname,
      interpreter: "bash",
      env: {
        NODE_ENV: "production"
      },
      instances: 1,
      autorestart: true,
      time: true,
      out_file: "./logs/chrome-out.log",
      error_file: "./logs/chrome-error.log",
      merge_logs: true
    },
    {
      name: "naveencodes-ai-mcp",
      script: "./scripts/start-mcp-service.mjs",
      cwd: __dirname,
      interpreter: process.env.PM2_NODE_PATH || "/usr/bin/node",
      env: {
        NODE_ENV: "production"
      },
      instances: 1,
      autorestart: true,
      time: true,
      out_file: "./logs/mcp-out.log",
      error_file: "./logs/mcp-error.log",
      merge_logs: true
    }
  ]
};
