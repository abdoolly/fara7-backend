module.exports = {
    apps: [{
        name: 'plano',
        script: 'yarn',
        args: 'prod',
        interpreter: '/bin/bash',
        env: {
            NODE_ENV: 'development'
        }
    }]
};