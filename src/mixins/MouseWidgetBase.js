// 此mixin已停止维护，即将废弃
define(function (require) {

    function deprecated() {
        try {
            console.error('Mixin MouseWidgetBase is deprecated, please merge these functions to your component.')
        }
        catch (e) {

        }
    }

    return {
        ___mouseenterHandler___: function () {
            deprecated();
            this.setState({mouseover: true});
            typeof this.props.onMouseEnter === 'function' && this.props.onMouseEnter();
        },
        ___mouseleaveHandler___: function () {
            deprecated();
            this.setState({mouseover: false});
            typeof this.props.onMouseLeave === 'function' && this.props.onMouseLeave();
        },
        ___mousedownHandler___: function () {
            deprecated();
            this.setState({mousedown: true});
        },
        ___mouseupHandler___: function () {
            deprecated();
            this.setState({mousedown: false});
        }
    };

});
