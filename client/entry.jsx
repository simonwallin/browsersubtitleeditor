import React from 'react';
import {render} from 'react-dom';
import Layout from "./components/Layout.jsx";
const style = require("!style-loader!css-loader!sass-loader!./styles/main.scss");
const textContent = require("./../config.js");

render(<Layout title={textContent.title} introtext={textContent.introtext}/>, document.getElementById('app'));
