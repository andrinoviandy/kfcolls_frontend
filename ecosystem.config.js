module.exports = {
  apps: [
    {
      name: "cost-tracking-frontend",

      script: "cmd",

      args: "/c serve -s build -l 8001",

      cwd: "C:/Programs/Cost Tracking/frontend",

      instances: 1,

      exec_mode: "fork",

      autorestart: true,

      watch: false,

      env: {
        NODE_ENV: "production",
      },
    },
  ],
};