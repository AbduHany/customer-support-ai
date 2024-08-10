module.exports = {
  apps: [{
    script: 'npm start',
  }],

  deploy: {
    production: {
      key: 'key01.pem',
      user: 'ubuntu',
      host: '3.84.134.65',
      ref: 'origin/main',
      repo: 'git@github.com:AbduHany/customer-support-ai.git',
      path: '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh-options': 'ForwardAgent=yes',
    }
  }
};
