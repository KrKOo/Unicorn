import React, {Component} from 'react';

import styles from './AlertBox.module.scss';

class AlertBox extends Component{
    constructor(props)
    {
        super(props);
        this.state = {

        }

        
    }

    componentDidMount()
    {

    }

    render() {
        return(
            <div className={`${this.props.className} ${styles.container}`}>
                {this.props.text && <p>{this.props.text}</p>}                
            </div>
        )
    }
}

export default AlertBox;