module.exports = {
    apps: [{
        name: 'backend',
        script: 'yarn',
        args: 'start',
        interpreter: '/bin/bash',
        env: {
            NODE_ENV: 'production'
        }
    }]
};