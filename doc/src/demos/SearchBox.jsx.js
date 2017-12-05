define(function (require) {


    const React = require('react');
    const Skin = require('fcui2/Skin.jsx');
    const SearchBox = require('fcui2/SearchBox.jsx');


    return React.createClass({
        render() {
            return (
                <div>
                    <div className="demo-item">
                        <h4>OneUX 4</h4>
                        <Skin skin="oneux4">
                            <h5>Skin</h5>
                            <SearchBox/>&nbsp;
                            <SearchBox placeholder="placeholder"/>&nbsp;
                            <SearchBox disabled={true}/>
                            <h5>Mode</h5>
                            <SearchBox mode="withButton"/>&nbsp;
                            <SearchBox mode="withButton" disabled={true}/>&nbsp;
                            <h5>Clear Button</h5>
                            <SearchBox showClearButton={true}/>&nbsp;
                            <SearchBox mode="withButton" showClearButton={true}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                        <Skin skin="oneux3">
                            <SearchBox/>&nbsp;
                            <SearchBox disabled={true}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <SearchBox/>&nbsp;
                            <SearchBox disabled={true}/>
                        </Skin>
                    </div>
                </div>
            );
        }
    });

});
