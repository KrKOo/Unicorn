import React, { Component } from 'react';

import Draggable from 'react-draggable';
import axios from 'axios';
import styles from './Map.module.scss';

import UserCell from '../UserCell/UserCell';

class Row extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps) {
        return this.props.children !== nextProps.children;
    }
    render() {
        return (
            <div className={styles.tableRow}>{this.props.children}</div>
        );
    }
}


class Cell extends Component {
    constructor(props) {
        super(props);
    }



    shouldComponentUpdate(nextProps) {
        return this.props.value !== nextProps.value;
    }

    render() {
        return (
            <div 
                className={styles.tableCell} 
                id={this.props.id} 
                onDoubleClick={this.props.onDoubleClick}
                style={{backgroundColor: this.props.background}}>
                    {this.props.value}
            </div>
        );
    }
}

class Map extends Component {
    constructor(props) {
        super(props);

        this.MAP_SIZE = 10;
        this.socket = this.props.socket;

        this.state = {
            map: []
        }
    }

    componentDidMount() {
        this.getMap(this.props.mapID);

        this.socket.on('mapEvent', (data) => {
            console.log("mapEvent");
            if (!data.isJoin) {
                console.log("Left");
                console.log(data);
                this.setState(prevState => {
                    let newMap = prevState.map;

                    newMap[data.lastPosition].user_id = null;
                    return {
                        map: newMap
                    }
                })
            }
        });

        this.socket.on('move', (data) => {
            console.log(data);
            
            this.setState(prevState => {
                let newMap = prevState.map;

                newMap[data.position] = newMap[data.position] || {};

                newMap[data.position].user_id = data.userID;
                if (data.lastPosition !== undefined) {
                    newMap[data.lastPosition] = newMap[data.lastPosition] || {};
                    newMap[data.lastPosition].user_id = null;
                }
                return {
                    map: newMap
                }
            })
        });

        /*this.socket.on('roomCreate', (data) => { //TODO
            this.setState(prevState => {
                let newRoomColors = prevState.roomColors;
                newRoomColors.push({id: data.roomID, background: data.background});
                return ({roomColors: newRoomColors});
            })
        });*/

        this.socket.on('roomEdit', (data) => {
            console.log(data);            

            this.setState(prevState => {
                let newMap = prevState.map;
                newMap[data.cell] = newMap[data.cell] || {};
                newMap[data.cell].room_id = data.roomID;
                newMap[data.cell].background = data.background;

                return({map: newMap});
            })
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.mapID !== prevProps.mapID) {
            this.getMap(this.props.mapID);
        }
    }

    handleClick = (e) => {
        console.log("Edit Mode: " + this.props.isEditMode);
        if (!this.props.isEditMode) {
            const position = parseInt(e.currentTarget.id.split('cell_').pop());

            if(this.state.map[position])
            {
                this.props.onRoomChange(this.state.map[position].room_id);
                console.log("Position: " + position);
                console.log("Room Change: " + this.state.map[position].room_id);
            }
            else
            {
                this.props.onRoomChange(null);
            }            
            

            this.socket.emit('move', {
                mapID: this.props.mapID,
                position: position
            })
        }
        else if (this.props.isEditMode) {
            this.socket.emit('roomEdit', {
                mapID: this.props.mapID,
                cell: parseInt(e.currentTarget.id.split('cell_').pop())
            })
        }
    }

    getMap = (mapID) => {
        let self = this;
        console.log("GET MAP mapID: " + this.props.mapID)
        axios.get(`/map/get/${mapID}`)
            .then(function (response) {
                console.log(response.data);

                const newMap = [];
                response.data.forEach(field => {
                    newMap[field.id] = field;
                })

                self.setState({map: newMap});

                /*const newMap = [];
                response.data.users.forEach(user => {
                    newMap[user.position] = user.user_id;
                });

                let newFieldColors = [];
                response.data.fields.forEach(field => {                    
                    newFieldColors[field.id] = response.data.colors.find(x => x.id == field.room_id).background;
                    
                })

                console.log(response.data.colors);
                self.setState({ 
                    map: newMap,
                    roomFields: response.data.fields,
                    roomColors: response.data.colors,
                    fieldColors: newFieldColors
                });*/

                
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        console.log(this.state.map)
        let map = [];
        for (let i = 0; i < this.MAP_SIZE; i++) {
            let mapRow = [];
            for (let j = 0; j < this.MAP_SIZE; j++) {
                const cellID = i * this.MAP_SIZE + j;
                mapRow.push(
                    <Cell
                        key={j}
                        id={`cell_${cellID}`}
                        background={(this.state.map[cellID])&&this.state.map[cellID].background}
                        value={
                            <UserCell
                                userID={(this.state.map[cellID])&&this.state.map[cellID].user_id}
                            />
                        }
                        onDoubleClick={this.handleClick}
                    />
                );
            }

            map.push(<Row key={i} children={mapRow} />);
        }

        return <Draggable allowAnyClick={false} bounds={{ top: -500, right: 500, bottom: 500, left: -500 }}>
            <div className={`${styles.mapTable} ${this.props.className}`} id={this.props.id}>
                {map}
            </div>
        </Draggable>;



    }
}

export default Map;