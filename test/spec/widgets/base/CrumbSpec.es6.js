/**
 * @file Specs for Crumb
 * @author Wang Yi(wangyispaceman@gmail.com)
 * @date Thu May 19 2016
 */

define(function (require) {
    const React = require('react');
    const TestUtils = React.addons.TestUtils;
    const Crumb = require('Crumb.jsx');

    function shallowRender(Component, props = {}) {
        let renderer = TestUtils.createRenderer();
        renderer.render(<Component {...props} />);
        return renderer.getRenderOutput();
    }

    describe('Crumb', () => {
        // Testing structure
        describe('Testing Crumb with shallow render', () => {
            let crumbProps = {};
            let datasource = [];

            beforeEach(() => {
                datasource = [
                    {
                        href: 'http://www.baidu.com/1',
                        target: '_blank',
                        label: '账户'
                    },
                    {
                        href: 'http://www.baidu.com/2',
                        target: '_blank',
                        label: '计划'
                    },
                    {
                        href: 'http://www.baidu.com/3',
                        target: '_blank',
                        label: '单元'
                    }
                ];
                crumbProps = {
                    skin: 'test-skin',
                    className: 'fcui2-crumb-test',
                    style: {color: '#FFF'},
                    disabled: false,
                    datasource: datasource
                };
            });

            it('Renders a crumb with default props', () => {
                let crumb = shallowRender(Crumb);
                expect(crumb.type).toBe('div');
                expect(crumb.props.className).toBe('fcui2-crumb fcui2-crumb-normal browser-chrome');
                expect(crumb.props.style).toEqual({});
                expect(crumb.props.children).toEqual([]);
            });

            it('Renders a crumb with given props', () => {
                let crumb = shallowRender(Crumb, crumbProps);
                expect(crumb.type).toBe('div');
                expect(crumb.props.className).toBe('fcui2-crumb fcui2-crumb-test fcui2-crumb-test-skin browser-chrome');
                expect(crumb.props.style).toEqual({color: '#FFF'});
                expect(crumb.props.children).toEqual([
                    <a key="l0" href="http://www.baidu.com/1" target="_blank">账户</a>,
                    <div key="s0" className="fcui2-crumb-separator">></div>,
                    <a key="l1" href="http://www.baidu.com/2" target="_blank">计划</a>,
                    <div key="s1" className="fcui2-crumb-separator">></div>,
                    <a key="l2" href="http://www.baidu.com/3" target="_blank">单元</a>
                ]);
            });

            it('Renders a crumb with disabled item', () => {
                datasource[datasource.length - 1].disabled = true;
                crumbProps.separator = '-';
                crumbProps.datasource = datasource;
                let crumb = shallowRender(Crumb, crumbProps);
                expect(crumb.type).toBe('div');
                expect(crumb.props.className).toBe('fcui2-crumb fcui2-crumb-test fcui2-crumb-test-skin browser-chrome');
                expect(crumb.props.style).toEqual({color: '#FFF'});
                expect(crumb.props.children).toEqual([
                    <a key="l0" href="http://www.baidu.com/1" target="_blank">账户</a>,
                    <div key="s0" className="fcui2-crumb-separator">-</div>,
                    <a key="l1" href="http://www.baidu.com/2" target="_blank">计划</a>,
                    <div key="s1" className="fcui2-crumb-separator">-</div>,
                    <span key="n2" className="fcui2-crumb-label">单元</span>
                ]);
            });
        });
    });
});
