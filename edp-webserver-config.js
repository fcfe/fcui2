exports.port = 8847;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

// 导入配置
exports.getLocations = function () {
    return [
        // babel 同时对付es6和react
        {
            location: /\.es6|\.jsx\.js/,
            // babelOptions, forceTransform 无论是否有`define`都强制转成UMD/AMD模块
            handler: [
                babel({
                    sourceMaps: 'both'
                }, {
                    forceTransform: true
                })
            ]
        },
        {
            location: /\/$/,
            handler: home( 'index.html' )
        },
        {
            location: /^\/redirect-local/,
            handler: redirect('redirect-target', false)
        },
        {
            location: /^\/redirect-remote/,
            handler: redirect('http://www.baidu.com', false)
        },
        {
            location: /^\/redirect-target/,
            handler: content('redirectd!')
        },
        {
            location: '/empty',
            handler: empty()
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autoless()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
