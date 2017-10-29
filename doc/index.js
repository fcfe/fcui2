

import React from 'react';
import ReactDom from 'react-dom';
import Main from './Main';


const container = document.getElementById('main');
render(window.location.hash.replace('#', '')); 


window.onhashchange = function () {
    render(window.location.hash.replace('#', '')); 
};


function render(path) {
    const props = {path};
    ReactDom.render(<Main {...props}/>, container);
}
