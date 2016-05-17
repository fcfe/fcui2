# FCUI2
[![Build Status](https://travis-ci.org/fcfe/fcui2.svg?branch=master)](https://travis-ci.org/fcfe/fcui2)

## What is FCUI2?

* FCUI2 is a lightweight UI based on React and underscore.js.
* FCUI2 adhere to AMD mechanism, your project need to employ javascript module loaders such as RequireJS, curl, Dojo to import FCUI2 modules.
* All widgets in FCUI2 are written in JSX, you need to import compilation tools such as Babel to your development environment and package tools.

## See FCUI2 examples

* Enter FCUI2 root directory, install scaffold tools by running: 
```
    npm install edp
```

* Start a http server by running:
```
    edp webserver start
```

* Using a browser to access URL:

        http://localhost:8847/index.html


## Use FCUI2 in browsers

* Clone a copy of the main git repo by running:
```bash
    git clone https://github.com/fcfe/fcui2.git
```

* Compile fcui2/src/css/main.less, fcui2/src/css/icon/fc-icon.less to css file, or add less compiling module to your development environment, then import style sheet in your home page:
```html
    <link rel="stylesheet" href="./dep/fcui2/src/css/icon/fc-icon.css"/>
    <link rel="stylesheet" href="./dep/fcui2/src/css/main.css"/>
```

* Configure the underlying dependency like:
```javascript
    require.config({
        baseUrl: './src',
        paths: {
            'react-dom': '../dep/react/react-dom',
            'react': '../dep/react/react-with-addons'
        },
        packages: [
            {
                name: 'fcui',
                location: '../dep/fcui/src',
                main: 'main'
            },
            {
                name: 'underscore',
                location: '../dep/underscore/1.8.5/src',
                main: 'underscore'
            }
        ]
    });
```

* Create a simple project in src/main.js like:
```javascript
    define(function (require) {

        var ReactDOM = require('react-dom');
        var React = require('react');
        var App = require('./app.jsx');
        var props = {};

        ReactDOM.render(
            React.createElement(App, props),
            document.getElementById('react-container')
        );

    });
```

* Create a html file for access like:
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<link rel="stylesheet" href="./dep/fcui2/css/icon/fc-icon.css"/>
<link rel="stylesheet" href="./dep/fcui2/src/css/main.css"/>
</head>
<body><div id="react-container"></div></body>
<script type="text/javascript" src="./dep/require.js"></script>
<script type="text/javascript">
    require.config({
        baseUrl: './src',
        paths: {
            'react-dom': '../dep/react/react-dom',
            'react': '../dep/react/react-with-addons'
        },
        packages: [
            {
                name: 'fcui',
                location: '../dep/fcui/src',
                main: 'main'
            },
            {
                name: 'underscore',
                location: '../dep/underscore/1.8.5/src',
                main: 'underscore'
            }
        ]
    });
    require(['main']);
</script>
</html>
```
* Here is an example for src/App.jsx.js:
```javascript
    define(function (require) {

        var React = require('react');
        var TextBox = require('fcui/TextBox.jsx');
        var Button = require('fcui/Button.jsx'); 
       
        return React.createClass({
            // @override
            getDefaultProps: function () {
                return {
                    name: 'Brian',
                    age: '18'
                };
            },
            // @override
            getInitialState: function () {
                return {

                };
            },
            render: function () {
                return (
                    <div>
                        Name: <TextBox value={this.props.name} /><br/>
                        Age: <TextBox value={this.props.age} /><br/>
                        <Button label="OK" />
                    </div>
                );
            }
        });
    });
```

## Author
* email: lbxxlht@163.com
* weibo: http://weibo.com/lbxx1984
* blog: http://blog.csdn.net/lbxx1984
