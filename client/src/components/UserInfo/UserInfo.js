import React, {Component} from 'react';

import axios from 'axios';
import styles from './UserInfo.module.scss';

class UserInfo extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            username: "",
            description: "",
            profileImg: ""
        }

        
    }

    componentDidMount()
    {
        this.getInfo();
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.userID !== this.props.userID)
        {
            this.getInfo();
            console.log("prev:" + prevProps.userID + " now: " + this.props.userID);
        }
    }

    getInfo = () => 
    {        
        let self = this;
        axios.get(`/users/get/${this.props.userID}`)
        .then(function (response) {
            self.setState({
                username: response.data.username,
                description: response.data.description,
                profileImg: response.data.profileImg
            });
            console.log(response.data);   
        })
        .catch(function (error) {
            console.log(error);
        })    
    }

    updateDescription = () =>
    {
        let self = this;
        axios.post(`/users/updateDescription`, 
        {description: this.state.description}, 
        {headers: {'Content-Type': 'application/json'}})
            .then(async res => {
               
            })
            .catch(err => {
                console.error(err);
            });
    }

    updateProfileImg = (file) => 
    {
        const self = this;
        const formData = new FormData();
        formData.append("myImage", file);

        axios.post(`/users/updateProfileImg`, 
        formData,
        {headers: {'Content-Type': 'multipart/form-data; boundary=${form._boundary}'}})
            .then(async res => {
                console.log(res);
               self.setState({profileImg: res.data.filename});
            })
            .catch(err => {
                console.error(err);
            });
    }

    handleClick = (e) => 
    {
        if(e.currentTarget.id === "exitButton")
        {
            if(this.props.isThisUser)
            {
                this.updateDescription();
                

            }            
            this.props.toggleUserInfo(false);
        }
    }

    handleChange = (e) =>
    {
        const {name, value} = e.target;
        if(name === "profileImg")
        {
            this.setState({[name]:e.target.files[0]});
            this.updateProfileImg(e.target.files[0]);
            console.log(e.target.files[0]);
        }
        else
        {
            this.setState({[name]:value});
        }
        
    }

    render() {
        return(
            <div className={`${this.props.className} ${styles.container}`}>
                <header>
                    <button className={styles.exitButton} onClick={this.handleClick} id="exitButton"><i className="fas fa-times fa-2x"></i></button>
                    <label>
                        <input type="file" name="profileImg" onChange={this.handleChange} style={{display: "none"}}/>
                        <img src={`/profileImages/${this.state.profileImg || 'profilePlaceholder.jpg'}`} alt="Profile Picture"/>
                    </label>
                    
                    <p className={styles.username}>{this.state.username}</p>
                </header>
                <article>
                    {this.props.isThisUser 
                    ?<textarea placeholder="Edit your description" onChange={this.handleChange} name="description" value={this.state.description || ""}></textarea>
                    :<p>{this.state.description}</p>}
                </article>
            </div>
        )
    }
}

export default UserInfo;