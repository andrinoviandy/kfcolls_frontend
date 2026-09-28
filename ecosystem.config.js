module.exports = {
  apps: [
    {
      name: "kfcolls-frontend",

      script: "bash",
      args: '-lc "serve -s build -l 8001"',

      cwd: "/home/kfcolls/frontend",

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