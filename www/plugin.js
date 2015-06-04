
var mirrolink = {
    dataServices : {
        onConnect : function(callback) {
            //cordova.exec(success, fail, 'MirrorLinkPlugin', 'onDriveModeChange', []);
        },
        onRegisterForService : function (callback) {
            //void onRegisterForService(in int serviceId, in boolean success);
        },
        onAvailableServicesChanged : function (callback) {
            //void onAvailableServicesChanged(in List<Bundle> services);
        },
        onSubscribeResponse : function (callback) {
            //void onSubscribeResponse(in int serviceId, in int objectId, in boolean success,in int subscriptionType, in int interval);
        },
        onSetDataObjectResponse : function (callback) {
            //void onSetDataObjectResponse(in int serviceId, in int objectId, boolean success);
        },
        onSetDataObjectResponse : function (callback) {
           //void onGetDataObjectResponse(in int serviceId, in int objectId, boolean success, in Bundle object);
        }
    },
    deviceStatus : {
        onDriveModeChange : function (success, fail) {
            cordova.exec(success, fail, 'DeviceStatus', 'onDriveModeChange', []);
        },
        onNightModeChanged : function (success, fail) {
            cordova.exec(success, fail, 'DeviceStatus', 'onNightModeChanged', []);
        },
        onMicrophoneStatusChanged : function (success, fail) {
            cordova.exec(success, fail, 'DeviceStatus', 'onMicrophoneStatusChanged', []);
        },
        isInDriveMode : function (success, fail) {
            cordova.exec(success, fail, 'DeviceStatus', 'isInDriveMode', []);
        },
        isInNightMode : function (success, fail) {
            cordova.exec(success, fail, 'DeviceStatus', 'isInNightMode', []);
        },
        isMicrophoneOn : function (success, fail) {
            cordova.exec(success, fail, 'DeviceStatus', 'isMicrophoneOn', []);
        },
        setMicrophoneOpen : function (micInput, voiceInput, success, fail) {
            cordova.exec(success, fail, 'DeviceStatus', 'setMicrophoneOpen', [micInput, voiceInput]);
        }
    },
    EventMapping : {
        onEventConfigurationChanged : function (success, fail) {
            cordova.exec(success, fail, 'EventMapping', 'onEventConfigurationChanged', []);
        },
        onEventMappingChanged : function (success, fail) {
            cordova.exec(success, fail, 'EventMapping', 'onEventMappingChanged', []);
        },
        eventConfiguration : function (success, fail) {
            cordova.exec(success, fail, 'EventMapping', 'eventConfiguration', []);
        },
        isInDriveMode : function (success, fail) {
            cordova.exec(success, fail, 'eventMappings', 'eventMappings', []);
        }
    },
    Connection : {
         onAudioConnectionsChanged : function (success, fail) {
             cordova.exec(success, fail, 'Connection', 'onAudioConnectionsChanged', []);
         },
         onRemoteDisplayConnectionChanged : function (success, fail) {
             cordova.exec(success, fail, 'Connection', 'onRemoteDisplayConnectionChanged', []);
         },
         getAudioConnections : function (success, fail) {
             cordova.exec(success, fail, 'Connection', 'getAudioConnections', []);
         },
         getRemoteDisplayConnections : function (success, fail) {
             cordova.exec(success, fail, 'Connection', 'getRemoteDisplayConnections', []);
         },
         isMirrorLinkSessionEstablished : function (success, fail) {
             cordova.exec(success, fail, 'Connection', 'isMirrorLinkSessionEstablished', []);
         },
         onMirrorLinkSessionChanged : function (success, fail) {
             cordova.exec(success, fail, 'Connection', 'onMirrorLinkSessionChanged', []);
         }
    }
};

module.exports = mirrolink;