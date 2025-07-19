module.exports = {
  apps: [
    {
      name: "loka",
      cwd: "/home/ec2-user/Loka",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: "3100",
        HOST: "0.0.0.0"
      }
    },
    {
      name: "loka-backend",
      cwd: "/home/ec2-user/Loka/backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: "4000"
      }
    }
  ]
};
