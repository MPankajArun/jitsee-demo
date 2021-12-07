import React, { Component } from 'react';
import AddToCalendar from 'react-add-to-calendar';
class JitsiComponent extends Component {

    domain = 'meet.jit.si';
    api = {};
    event = {
        title: 'Sample Event',
        description: 'This is the sample event provided as an example only',
        location: 'Portland, OR',
        startTime: '2016-09-16T20:15:00-04:00',
        endTime: '2016-09-16T21:45:00-04:00'
    };
    

    items = [
        { outlook: 'Outlook' },
        { google: 'Google' }
     ];
    constructor(props) {
        super(props);
        this.state = {
            room: 'some-room',
            user: {
                name: 'Pankaj Meshram'
            },
            isAudioMuted: false,
            isVideoMuted: false,
            chatDetected: false
        }
    }

    startMeet = () => {
        const options = {
            roomName: this.state.room,
            width: '90%',
            height: 900,
            configOverwrite: { prejoinPageEnabled: false },
            interfaceConfigOverwrite: {
                // overwrite interface properties
            },
            parentNode: document.querySelector('#jitsi-iframe'),
            userInfo: {
                displayName: this.state.user.name
            }
        }
        this.api = new window.JitsiMeetExternalAPI(this.domain, options);
        console.log(this.api);
        this.api.addEventListeners({
            readyToClose: this.handleClose,
            endpointTextMessageReceived: this.handleReceivedMessage,
            incomingMessage: this.handleReceivedMessage,    
        });
    }
    
    messages = [];
    handleReceivedMessage = (
        event) => {
            console.log("incomingMessage");
            console.log(event);
            // debugger;
            if(event.message.search('meet') > -1) {
                this.setState({
                    chatDetected: true
                });
            }
    }

    handleClose = () => {
        console.log("handleClose");
    }


    getParticipants() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.api.getParticipantsInfo()); // get all participants
            }, 500)
        });
    }

    // custom events
    executeCommand(command) {
        this.api.executeCommand(command);;
        if(command == 'hangup') {
            return this.props.history.push('/thank-you');
        }
    }

    componentDidMount() {
        if (window.JitsiMeetExternalAPI) {
            this.startMeet();
        } else {
            alert('JitsiMeetExternalAPI not loaded');
        }
    }

    render() {
        const chatDetected = this.state.chatDetected;
        return (
            <>
            <div className="container">
                <div id="jitsi-iframe"></div>
                <div id="notification-container">
                <header className="nav-bar">
                    <p className="heading">Notification  {chatDetected}</p>
                    
                    {chatDetected &&
                        <AddToCalendar event={this.event} listItems={this.items} />
                    }
                    
                </header>
                </div>
            </div>

            </>
        );
    }
}

export default JitsiComponent;
