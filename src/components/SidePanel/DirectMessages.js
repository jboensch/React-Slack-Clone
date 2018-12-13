import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon } from 'semantic-ui-react';

//this will be a stateful component
class DirectMessages extends React.Component {
    state = {
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref("users"),
        connectedRef: firebase.database().ref(".info/connected"),
        presenceRef: firebase.database().ref("presence")
    };

    componentDidMount() {
        //check if we have some user data
        if (this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = currentUserUid => {
        let loadedUsers = [];
        this.state.usersRef.on("child_added", snap => {
            //ensure we do not includes ourselves in the loadedUsers array
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user["uid"] = snap.key;
                user["status"] = "offline";
                loadedUsers.push(user);
                this.setState({ users: loadedUsers });
            }
        });

        this.state.connectedRef.on("value", snap => {
            if (snap.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid);
                ref.set(true);
                //if our user disconnects from the app we will remove it from presence
                ref.onDisconnect().remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
            }
        });

        //when someone is added to presence do this
        this.state.presenceRef.on("child_added", snap => {
            //and its not us
            if (currentUserUid !== snap.key) {
                //add status to the user
                this.addStatusToUser(snap.key);
            }
        });

        //when someone is removed from presence do this
        this.state.presenceRef.on('child_removed', snap => {
            //and its not us
            if (currentUserUid !== snap.key) {
                //add status to the user
                this.addStatusToUser(snap.key, false);
            }
        });
    };

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if (user.uid === userId) {
                user["status"] = `${connected ? "online" : "offline"}`;
            }
            return acc.concat(user);
        }, []);
        this.setState({ users: updatedUsers });
    };

    isUserOnline = user => user.status === "online";

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name
        };
        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
    }

    getChannelId = userId => {
        const currentUserUid = this.state.user.uid;
        return userId < currentUserUid ?
            `${userId}/${currentUserUid}` : `${currentUserUid}/${userId}`;
    }

    render() {
        const { users } = this.state;

        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="mail" /> DIRECT MESSAGES
          </span>{" "}
                    ({users.length})
        </Menu.Item>
                {users.map(user => (
                    <Menu.Item
                        key={user.uid}
                        onClick={() => this.changeChannel(user)}
                        style={{ opacity: 0.7, fontStyle: "italic" }}
                    >
                        <Icon
                            name="circle"
                            color={this.isUserOnline(user) ? "green" : "red"}
                        />
                        @ {user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        );
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);