import React, {Component} from 'react';

import Draggable from 'react-draggable';
import axios from 'axios';
import styles from './Map.module.scss';

class Row extends Component 
{
    constructor(props)
    {
        super(props);
    }
    shouldComponentUpdate(nextProps)
    {
        //return this.props.mustUpdate;

        return this.props.children !== nextProps.children;
    }
    render()
    {
        return (
            <div className={styles.tableRow}>{this.props.children}</div>
        );
    }
}


class Cell extends Component
{
    constructor(props)
    {
        super(props);
    }

    

    shouldComponentUpdate(nextProps)
    {
        return this.props.value !== nextProps.value;
    }

    render()
    {
        return (
            
            <div id={this.props.id} className={styles.tableCell} onDoubleClick={this.props.onDoubleClick}>
                {this.props.value}
                {console.log(this.props.value)}
            </div>
        );
    }
}

class Map extends Component{
    constructor(props)
    {
        super(props);

        this.MAP_SIZE = 10;
        this.socket = this.props.socket;

        this.state = {
            map: [],
            number: 1,
            updatedRows: []
        }

        
    }

    componentDidMount()
    {
        let self = this;
		axios.get("/map/get/0")
			.then(function (response) {		
                console.log(response);
                self.setState((prevState) => 
                {
                    let newMap = prevState.map;
                    let updatedRows = [];
                    response.data.forEach(user => {
                        newMap[user.position] = user.users_id;
                        let updatedRow = Math.floor(user.position/self.MAP_SIZE);

                        if(updatedRows.indexOf(updatedRow) === -1) {
                            updatedRows.push(updatedRow);
                        }
                        
                    });

                    return ({
                        map: newMap,
                        updatedRows: updatedRows
                    });
                })
			})
			.catch(function (error) {
				console.log(error);
			})


        this.socket.on("move", (data) => {
            console.log(data);

            this.setState(prevState => {
                let newMap = prevState.map;
                newMap[data.position] = data.username;
                newMap[data.lastPosition] = null;
                return {                    
                    map: newMap
                }
            })
        }); 

    }

    handleClick = (e) =>
    {
        this.socket.emit('move', {
            server: 0,
            position: e.target.id.split('cell_').pop()
        })
    }

    render() {
        let map = [];
        console.log("MAP:" + this.state.map[25])
        for (let i = 0; i < this.MAP_SIZE; i++)
        {
            let mapRow = [];
            for(let j = 0; j < this.MAP_SIZE; j++)
            {
                
                mapRow.push(<Cell key={j} id={`cell_${i*this.MAP_SIZE+j}`} value={this.state.map[i*this.MAP_SIZE+j]} onDoubleClick={this.handleClick}/>);
            }

            console.log(this.state.updatedRows);
            map.push(<Row key={i} children={mapRow}/>);
        }

        return <Draggable allowAnyClick={false} bounds={{top: -500, right: 500, bottom: 500, left: -500}}>
                <div className={`${styles.mapTable} ${this.props.className}`} id={this.props.id}>
                    {map}                
                </div>
            </Draggable>;
            
        
        
    }
}

export default Map;