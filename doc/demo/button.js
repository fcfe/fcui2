

import React, {Component} from 'react';
import {Button} from 'fcui2';


export default class Main extends Component {
    render() {
        return (
            <div>
                hahaha：
                <Button size="small"/>
                <Button size="small" skin="active"/>
                <Button size="small" skin="blue"/>
                <Button size="small" skin="grey"/>
                <Button size="small" skin="greyblue"/>
                <Button size="small" skin="lightblue"/>
                <Button size="small" skin="important"/>
                <Button size="small" skin="opacity"/>
                <Button size="small" skin="nocolor"/>
                <Button size="small" skin="disabled"/><br/>
                hahaha：
                <Button/>
                <Button skin="active"/>
                <Button skin="blue"/>
                <Button skin="grey"/>
                <Button skin="greyblue"/>
                <Button skin="lightblue"/>
                <Button skin="important"/>
                <Button skin="opacity"/>
                <Button skin="nocolor"/>
                <Button skin="disabled"/><br/>
                hahaha：
                <Button size="large"/>
                <Button size="large" skin="active"/>
                <Button size="large" skin="blue"/>
                <Button size="large" skin="grey"/>
                <Button size="large" skin="greyblue"/>
                <Button size="large" skin="lightblue"/>
                <Button size="large" skin="important"/>
                <Button size="large" skin="opacity"/>
                <Button size="large" skin="nocolor"/>
                <Button size="large" skin="disabled"/>
            </div>
        );
    }
}
