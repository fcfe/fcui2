/**
 * 工具集
 * @author Brian Li
 * @email lihaitao03@baidu.com
 * @version 2.5.0.0
 */

function noop () {

}

function getBrowserType() {
    if (!(typeof window !== 'undefined' && window.document && window.document.createElement)) {
        return 'chrome';
    }
    var ua = navigator.userAgent.toLowerCase();
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return 'ie';
    }
    if (ua.indexOf('chrome') > -1) {
        return 'chrome';
    }
    if (ua.indexOf('firefox') > -1) {
        return 'firefox';
    }
    return 'chrome';
}

export {noop, getBrowserType}