define(function (require) {

    const React = require('react');
    const TextLine = require('fcui2/TextLine.jsx');
    const Skin = require('fcui2/Skin.jsx');

    // var items = [
    //     {
    //         title: 'Normal TextLine',
    //         props: {placeholder: 'please input'}
    //     },
    //     {
    //         title: 'Readonly TextLine',
    //         props: {value: }
    //     }
    // ];

    return React.createClass({
        getInitialState() {
            return {
                value: '百度\n腾讯\n阿里\n腾讯\n阿里'
            };
        },
        onChange(e) {
            this.setState({value: e.target.value});
        },
        render() {
            return (
                <div>
                    <div className="demo-item">
                        <h4>OneUX 4</h4>
                        <Skin skin="oneux4">
                            <h5>Skin</h5>
                            <TextLine placeholder="placeholder" value={this.state.value} onChange={this.onChange}/>&nbsp;
                            <TextLine skin="reject" value={'百度\n腾讯\n阿里\n腾讯\n阿里'}/>&nbsp;
                            <TextLine disabled={true}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>OneUX 3</h4>
                        <Skin skin="oneux3">
                            <TextLine placeholder="placeholder"/>&nbsp;
                            <TextLine skin="reject" value={'百度\n腾讯\n阿里\n腾讯\n阿里'}/>&nbsp;
                            <TextLine disabled={true}/>
                        </Skin>
                    </div>
                    <div className="demo-item">
                        <h4>Normal</h4>
                        <Skin skin="">
                            <TextLine placeholder="placeholder"/>&nbsp;
                            <TextLine skin="reject" value={'百度\n腾讯\n阿里\n腾讯\n阿里'}/>&nbsp;
                            <TextLine disabled={true}/>
                        </Skin>
                    </div>
                </div>
            );
        }
    });


});

