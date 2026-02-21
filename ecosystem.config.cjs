module.exports = {
  apps: [
    {
      name: 'auez-backend',
      script: 'node',
      args: 'server-pro.js',
      cwd: './',
      shell: true,
      exec_mode: 'fork',
      instances: 1,
      env: { NODE_ENV: 'development' }
    },
    {
      name: 'auez-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './',
      shell: true,
      exec_mode: 'fork',
      instances: 1,
      env: { NODE_ENV: 'development' }
    },
    {
      name: 'auez-tunnel',
      script: 'node',
      args: 'tunnel-server.cjs',
      cwd: './',
      shell: true,
      exec_mode: 'fork'
    }
  ]
}
