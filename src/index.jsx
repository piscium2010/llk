import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import App from './app';
import './app.less';
import 'bootstrap/dist/css/bootstrap.min.css'

let root = document.createElement('div');
root.id = 'app';
document.body.appendChild(root);

ReactDOM.render(<App/>,root);

if (module.hot) {
    module.hot.accept('./index.jsx', function() {
        console.log('Accepting the updated printMe module!');
        ReactDOM.render(<App/>,root);
    })
}