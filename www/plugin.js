
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
        onCertificationStatusChanged : function(success, fail) {
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
        getApplicationCertificationInformation : function(entity, success, fail) {
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
        getApplicationCertificationStatus : function(success, fail) {
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
        getApplicationCertifyingEntities : function(success, fail) {
            cordova.exec(success, fail, 'Certification', 'getApplicationCertifyingEntities', []);
        },
        /**
         * Notifies the Manager that the application is not using it anymore.
         * <br>
         * Applications are required to call this method when they no longer need to use the Manager.
         * Once called, if at a later point they need the Manager again, they can re-request access to
         * it from the {@link ICommonAPIService}.
         * <br>
         * Once unregister is received by the server, the application will not receive any more
         * callbacks from the Manager.
         */
        unregister : function(success, fail) {
            cordova.exec(success, fail, 'Certification', 'unregister', []);
        }
    },
    Connection : {
        /**
         * 4.4.4 Established Audio Connections Callback.
         *
         * <br>
         * <i>Function reference 0x0304.</i>
         * <br>
         * Indicate that the audio connections changed.
         *
         * @param audioConnections Bundle containing the status of the audio connections available. The
         * details of the fields available are found in {@link Defs.AudioConnections}.
         */
        onAudioConnectionsChanged : function (success, fail) {
            cordova.exec(success, fail, 'Connection', 'onAudioConnectionsChanged', []);
        },
        /**
         * 4.4.6 Established Remote Display Connection Callback.
         *
         * <br>
         * <i>Function reference 0x0306.</i>
         * <br>
         * Indicate that the remote display connections changed.
         *
         * @param remoteDisplayConnection integer indicating the status of the remote display connections
         * available. The values are defined in {@link Defs.RemoteDisplayConnection}.
         */
        onRemoteDisplayConnectionChanged : function (success, fail) {
            cordova.exec(success, fail, 'Connection', 'onRemoteDisplayConnectionChanged', []);
        },
        /**
         * 4.4.3 Established Audio Connections.
         *
         * <br>
         * <i>Function reference 0x0303.</i>
         * <br>
         * Established Audio connections within MirrorLink Session
         *
         * @return Bundle containing the status of the audio connections available. The details of the
         * fields available are found in {@link Defs.AudioConnections}.
         */
        getAudioConnections : function (success, fail) {
            cordova.exec(success, fail, 'Connection', 'getAudioConnections', []);
        },
        /**
         * 4.4.5 Established Remote Display Connection.
         *
         * <br>
         * <i>Function reference 0x0305.</i>
         * <br>
         * Established remote display connection within MirrorLink Session.
         *
         * @return Value containing the status of the remote display connections available. The values
         * are defined in {@link Defs.RemoteDisplayConnection}.
         */
        getRemoteDisplayConnections : function (success, fail) {
            cordova.exec(success, fail, 'Connection', 'getRemoteDisplayConnections', []);
        },
        /**
         * 4.4.1 Indicates whether a MirrorLink session is currently established.
         *
         * <br>
         * <i>Function reference 0x0301.</i>
         * <br>
         * A MirrorLink is considered established if a ClientProfile has been
         * set on the MirrorLink Server for the current tethering session.
         * <br>
         * The application MUST use this call and its equivalent callback {@link
         * IConnectionListener#onMirrorLinkSessionChanged} to determine whether a
         * MirrorLink session is established. MirrorLink applications SHOULD use
         * other Common API modules only while a MirrorLink Session is running.
         * MirrorLink Servers MUST have the Common API modules available at all
         * times.
         */
        isMirrorLinkSessionEstablished : function (success, fail) {
            cordova.exec(success, fail, 'Connection', 'isMirrorLinkSessionEstablished', []);
        },
        /**
         * 4.4.2 Established MirrorLink Session Callback.
         *
         * <br>
         * <i>Function reference 0x0302.</i>
         * <br>
         * Indicate that the MirrorLink Session status has changed.
         * <br>
         * The application MUST use this call and its equivalent callback {@link
         * IConnectionManager#isMirrorLinkSessionEstablished} to determine whether a
         * MirrorLink session is established. MirrorLink applications SHOULD use
         * other Common API modules only while a MirrorLink Session is running.
         * MirrorLink Servers MUST have the Common API modules available at all
         * times.
         *
         * @param mirrolinkSessionIsEstablished the new status of the MirrorLink session.
         */
        onMirrorLinkSessionChanged : function (success, fail) {
            cordova.exec(success, fail, 'Connection', 'onMirrorLinkSessionChanged', []);
        }
        /**
         * Notifies the Manager that the application is not using it anymore.
         * <br>
         * Applications are required to call this method when they no longer need to use the Manager.
         * Once called, if at a later point they need the Manager again, they can re-request access to
         * it from the {@link ICommonAPIService}.
         * <br>
         * Once unregister is received by the server, the application will not receive any more
         * callbacks from the Manager.
         */
        unregister : function(success, fail) {
            cordova.exec(success, fail, 'Connection', 'unregister', []);
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