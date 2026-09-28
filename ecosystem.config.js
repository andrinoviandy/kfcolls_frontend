module.exports = {
  apps: [
    {
      name: "kfcolls-frontend",

      script: "serve",
      args: "-s build -l 8001",

      cwd: "/home/kfcolls/frontend",

      interpreter: "none",

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