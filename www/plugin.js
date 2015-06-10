
var mirrolink = {
    Certification : {
        /** Indicate that the application certification status has changed.
         * <br>
         * <i>Function reference 0x0204.</i>
         * <br>
         * The application would receive this callback if, for example, the certification status changes
         * when the certificate is revoked.
         * <br>
         * The application should use the calls in the {@link ICertificationManager} to find the latest
         * certification details.
         */
        onCertificationStatusChanged : function(callback) {
            cordova.exec(success, fail, 'Certification', 'onCertificationStatusChanged', []);
        },
        /**
         * 4.3.3 Get Application Certification Information.
         *
         * <br>
         * <i>Function reference 0x0203.</i>
         * <br>
         * Provide application certificate information.
         *
         * @param   entity the name of the certifying entity,
         *
         * @return  Bundle containing {@link Defs.CertificateInformation} for the given entity
         *          or null if the application isn't certified or the entity is not part of the list of
         *          certifying entities for the application,
         */
        getApplicationCertificationInformation : function(entity, callback) {
            cordova.exec(success, fail, 'Certification', 'getApplicationCertificationInformation', [entity]);
        },
        /**
         * 4.3.1 Get Application Certification Status.
         *
         * <br>
         * <i>Function reference 0x0201.</i>
         * <br>
         * Provided application certificate status, as captured from the application certificate.
         *
         * @return A bundle detailing {@link Defs.ApplicationCertificationStatus}.
         */
        getApplicationCertificationStatus : function(callback) {
            cordova.exec(success, fail, 'Certification', 'getApplicationCertificationStatus', []);
        },
        /**
         * 4.3.2 Get Application Certifying Entities.
         *
         * <br>
         * <i>Function reference 0x0202.</i>
         * <br>
         * Provide information on the certifying entities.
         *
         * @return Comma-separated list of certifying entities, which certified the application,
         */
        getApplicationCertifyingEntities : function(callback) {
            cordova.exec(success, fail, 'Certification', 'getApplicationCertifyingEntities', []);
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
    },
    Context : {
        onFramebufferBlocked : function (success, fail) {
             cordova.exec(success, fail, 'Context', 'onFramebufferBlocked', []);
        },
        onAudioBlocked : function (success, fail) {
             cordova.exec(success, fail, 'Context', 'onAudioBlocked', []);
        },
        onFramebufferUnblocked : function (success, fail) {
            cordova.exec(success, fail, 'Context', 'onFramebufferUnblocked', []);
        },
        onAudioUnblocked : function (success, fail) {
            cordova.exec(success, fail, 'Context', 'onAudioUnblocked', []);
        },
        setAudioContextInformation : function (success, fail) {
            cordova.exec(success, fail, 'Context', 'setAudioContextInformation', []);
        },
        setFramebufferContextInformation : function (success, fail) {
            cordova.exec(success, fail, 'Context', 'setFramebufferContextInformation', []);
        }
    },
    DataServices : {
        onAvailableServicesChanged : function (callback) {  //void onAvailableServicesChanged(in List<Bundle> services);
            cordova.exec(success, fail, 'DataServices', 'onAvailableServicesChanged', []);
        },
        onRegisterForService : function (callback) {  //void onRegisterForService(in int serviceId, in boolean success);
            cordova.exec(success, fail, 'DataServices', 'onRegisterForService', []);
        },
        onSubscribeResponse : function (callback) {//void onSubscribeResponse(in int serviceId, in int objectId, in boolean success,in int subscriptionType, in int interval);
            cordova.exec(success, fail, 'DataServices', 'onSubscribeResponse', []);
        },
        onSetDataObjectResponse : function (callback) { //void onSetDataObjectResponse(in int serviceId, in int objectId, boolean success);
            cordova.exec(success, fail, 'DataServices', 'onSetDataObjectResponse', []);
        },
        onGetDataObjectResponse : function (callback) { //void onGetDataObjectResponse(in int serviceId, in int objectId, boolean success, in Bundle object);
            cordova.exec(success, fail, 'DataServices', 'onGetDataObjectResponse', []);
        },
        getAvailableServices : function (callback) {
            cordova.exec(success, fail, 'DataServices', 'getAvailableServices', []);
        },
        registerToService : function (callback) {
            cordova.exec(success, fail, 'DataServices', 'registerToService', []);
        },
        setObject : function (callback) {
            cordova.exec(success, fail, 'DataServices', 'setObject', []);
        }
    },
    DeviceInfo : {
        onDeviceInfoChanged : function (callback) {
            cordova.exec(success, fail, 'DeviceInfo', 'onDeviceInfoChanged', []);
        },
        getMirrorLinkClientInformation : function (callback) {
             cordova.exec(success, fail, 'DeviceInfo', 'getMirrorLinkClientInformation', []);
        },
        getServerVirtualKeyboardSupport : function (callback) {
             cordova.exec(success, fail, 'DeviceInfo', 'getServerVirtualKeyboardSupport', []);
        },
        getMirrorLinkSessionVersionMajor : function (callback) {
             cordova.exec(success, fail, 'DeviceInfo', 'getMirrorLinkSessionVersionMajor', []);
        },
        getMirrorLinkSessionVersionMinor : function (callback) {
             cordova.exec(success, fail, 'DeviceInfo', 'getMirrorLinkSessionVersionMinor', []);
        },
    },
    DeviceStatus : {
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
    Display : {
        onDisplayConfigurationChanged : function (success, fail) {
            cordova.exec(success, fail, 'Display', 'onDisplayConfigurationChanged', []);
        },
        onPixelFormatChanged : function (success, fail) {
            cordova.exec(success, fail, 'Display', 'onPixelFormatChanged', []);
        },
        getClientPixelFormat : function (success, fail) {
            cordova.exec(success, fail, 'Display', 'getClientPixelFormat', []);
        },
        eventMappings : function (success, fail) {
            cordova.exec(success, fail, 'Display', 'eventMappings', []);
        },
    },
    EventMapping : {
        onEventConfigurationChanged : function (success, fail) {
            cordova.exec(success, fail, 'EventMapping', 'onEventConfigurationChanged', []);
        },
        onEventMappingChanged : function (success, fail) {
            cordova.exec(success, fail, 'EventMapping', 'onEventMappingChanged', []);
        },
        getEventConfiguration : function (success, fail) {
            cordova.exec(success, fail, 'EventMapping', 'getEventConfiguration', []);
        },
        getEventMappings : function (success, fail) {
            cordova.exec(success, fail, 'EventMapping', 'getEventMappings', []);
        }
    },
    Notification : {
        onNotificationEnabledChanged : function (success, fail) {
            cordova.exec(success, fail, 'Notification', 'onNotificationEnabledChanged', []);
        },
        onNotificationConfigurationChanged : function (success, fail) {
            cordova.exec(success, fail, 'Notification', 'onNotificationConfigurationChanged', []);
        },
        onNotificationActionReceived : function (success, fail) {
            cordova.exec(success, fail, 'Notification', 'onNotificationActionReceived', []);
        },
        getNotificationConfiguration : function (success, fail) {
            cordova.exec(success, fail, 'Notification', 'getNotificationConfiguration', []);
        },

        getNotificationEnabled : function (success, fail) {
            cordova.exec(success, fail, 'Notification', 'getNotificationEnabled', []);
        },
        cancelNotification : function (success, fail) {
            cordova.exec(success, fail, 'Notification', 'cancelNotification', []);
        },
        sendVncNotification : function (success, fail) {
            cordova.exec(success, fail, 'Notification', 'sendVncNotification', []);
        },
        sendClientNotification : function (success, fail) {
            cordova.exec(success, fail, 'Notification', 'sendClientNotification', []);
        }
    }
};

module.exports = mirrolink;