/**
 * @file Tree Demo
 * @author Han Bing Feng (hanbingfeng@)
 */

define(function (require) {
    let React = require('react');
    let Tree = require('fcui/Tree.jsx');

    let items = [
        {
        }
    ];

    function factory(me, items) {
        let widgets = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let prop = item.props;
            let conf = JSON.stringify(prop);
            widgets.push(
                <div className="demo-item" key={i}>
                    <h3>{item.title}</h3>
                    <div className="props">{conf}</div>
                    <Tree {...prop}/>
                </div>
            );
        }
        return widgets;
    }

    return React.createClass({
        // @override
        getDefaultProps() {
            return {
                demo: 'Tree',
                alert() {}
            };
        },
        clickHandler(e) {
            this.props.alert(e.target.value);
        },
        render() {
            let containerProp = {
                className: 'demo-content',
                style: {
                    display: this.props.demo === 'Tree' ? 'block' : 'none'
                }
            };
            return (<div {...containerProp}>{factory(this, items)}</div>);
        }
    });
});
