module.exports = {
    // world hello
    apps: [{
        name: 'plano',
        script: 'yarn',
        args: 'prod',
        interpreter: '/bin/bash',
        env: {
            NODE_ENV: 'production',
            PORT: '4000'
        }
    }]
};