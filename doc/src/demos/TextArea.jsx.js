define(function (require) {

    const React = require('react'); 
    const TextArea = require('fcui2/TextArea.jsx');



    return React.createClass({
        getInitialState() {
            return {
                value: 'asd'
            };
        },
        onChange(e) {
            this.setState({value: e.target.value});
        },
        render() {
            return (
                <div>
                    <h4>{this.state.value}</h4>
                    <TextArea value={this.state.value} onChange={this.onChange}/>
                </div>
            );
        }
    });
});
