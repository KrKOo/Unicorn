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
    shouldComponentUpdate()
    {
        return this.props.mustUpdate;
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
            
            <div id={this.props.id} className={styles.tableCell}>
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
        axios.get("/map", {
            params: {
                mapName: 'map1'
            }
        })
        .then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
            console.log(error);
        })

        this.socket.on("Test", (data) => {
            console.log(data);

            this.setState(prevState => {
                let newMap = prevState.map;
                newMap[9]+=1;
                return {                    
                    map: newMap,
                    updatedRows: [Math.floor(9/this.MAP_SIZE)]
                }
            })
        }); 

    }

    render() {
        let map = [];

        for (let i = 0; i < this.MAP_SIZE; i++)
        {
            let mapRow = [];
            for(let j = 0; j < this.MAP_SIZE; j++)
            {
                mapRow.push(<Cell key={j} id={`cell_${i*this.MAP_SIZE+j}`} value="---"/>);
            }

            map.push(<Row key={i} children={mapRow} mustUpdate={this.state.updatedRows.includes(i)}/>);
        }

        return <Draggable allowAnyClick={false} bounds={{left:-500, top:-500, right: 500, bottom: 500}}><div className={`${styles.mapTable} ${this.props.className}`} id={this.props.id}>
                {map}
                
            </div></Draggable>;
        
        
    }
}

export default Map;