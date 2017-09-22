define(function (require) {


    const React = require('react');
    const Skin = require('fcui2/Skin.jsx');
    const Wizard = require('fcui2/Wizard.jsx');


    const datasource = ['第一步', '第二步', '第三步', '第四步'];


    return React.createClass({
        render() {
            return (
                <div>
                    <div className="demo-item">
                        <h4>OneUX 4</h4>
                        <Skin skin="oneux4">
                            <Wizard datasource={datasource}/>
                            <Wizard datasource={datasource} value={2}/>
                            <Wizard datasource={datasource} skin="line"/>
                            <Wizard datasource={datasource} skin="line" value={1}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                        <Skin skin="oneux3">
                            <Wizard datasource={datasource}/>
                            <Wizard datasource={datasource} value={2}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <Wizard datasource={datasource}/>
                            <Wizard datasource={datasource} value={1}/>
                        </Skin>
                    </div>
                </div>
            );
        }
    });
});
