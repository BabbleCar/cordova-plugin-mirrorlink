
var mirrolink = {
    ServiceConnect : function(success, fail) {
        cordova.exec(success, fail, 'Api', 'connect', []);
    },
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
        /**
         * 4.9.2 Framebuffer Blocking Information Callback.
         *
         * <br>
         * <i>Function reference 0x0802.</i>
         * <br>
         * Framebuffer is blocked from the MirrorLink Client; in case the application has indicated that
         * it will handle the blocking it MUST remove the blocked content.
         * <br>
         * Sometimes the application MUST switch to a new view and update its context information, other
         * times there is nothing the application can do to help unblock the framebuffer. For details of
         * reasons of blocking and what the application is required to do see {@link
         * Defs.BlockingInformation}.
         * <br>
         * The Server SHOULD only pass the framebuffer blocking notification to the application only if
         * no reason flag is set to handle the blocking by itself.
         *
         * @param reason Reason for Framebuffer blocking. Will have a value defined in {@link
         * Defs.BlockingInformation}.  Note: Blocking because of the wrong
         * framebuffer orientation, is not reported via this function.
         * @param framebufferArea Framebuffer rectangle for the specified region. The values available
         * are defined in {@link Defs.Rect}.
         *
         * @see #onFramebufferUnblocked
         */
        onFramebufferBlocked : function (success, fail) {
             cordova.exec(success, fail, 'Context', 'onFramebufferBlocked', []);
        },
        /**
         * 4.9.4 Audio Blocking Information.
         *
         * <br>
         * <i>Function reference 0x0804.</i>
         * <br>
         * Audio is blocked from the MirrorLink Client; in case the application has indicated that
         * it will handle the blocking it MUST remove the blocked content.
         * <br>
         * The Server SHOULD only pass the audio blocking notification to the application only if
         * no reason flag is set to handle the blocking by itself.
         * <br>
         * If handling the audio blocking, the MirrorLink Server MUST either filter the application's
         * audio, or terminate the application.
         * <br>
         * If the application is handling the blocking but it continues to stream after being notified,
         * then the Server MAY terminate the application.
         *
         * @param reason Reason for Audio blocking. Will have a value defined in {@link
         * Defs.BlockingInformation}. The reason MUST be different from 0 as reason 0 means that the
         * audio is unblocked, that is reported via {@link #onAudioUnblocked}.
         *
         * @see #onAudioUnblocked
         */
        onAudioBlocked : function (success, fail) {
             cordova.exec(success, fail, 'Context', 'onAudioBlocked', []);
        },
        /**
         * 4.9.5 Framebuffer Unblocking Callback
         * <br>
         * <i>Function reference 0x0805.</i>
         * <br>
         * Framebuffer is unblocked from the MirrorLink Client. There can be various ways to unblock the
         * framebuffer, depending on the blocking reasons. See {@link Defs.BlockingInformation} for
         * details.
         * <p>
         * If the framebuffer was blocked with more than one reason, all the reasons must be resolved
         * before this callback will be issued.
         * <br>
         * The Server SHOULD only pass the framebuffer unblocking notification to the application only if
         * no reason flag was set to handle the blocking by itself.
         *
         * @see #onFramebufferBlocked
         */
        onFramebufferUnblocked : function (success, fail) {
            cordova.exec(success, fail, 'Context', 'onFramebufferUnblocked', []);
        },
        /**
         * 4.9.6 Audio Unblocking Callback
         * <br>
         * <i>Function reference 0x0806.</i>
         * <br>
         * Audio is unblocked from the MirrorLink Client. This signal will be emitted, if the
         * MirrorLink Client has previously blocked application's audio stream. The application will
         * receive this signal, as soon as the MirrorLink Client resumes the audio.
         * <br>
         * The Server SHOULD only pass the audio unblocking notification to the application only if
         * no reason flag was set to handle the blocking by itself.
         *
         * @see #onAudioBlocked
         */
        onAudioUnblocked : function (success, fail) {
            cordova.exec(success, fail, 'Context', 'onAudioUnblocked', []);
        },
        /**
         * 4.9.3 Audio Context Information.
         *
         * <br>
         * <i>Function reference 0x0803.</i>
         * <br>
         * Provides information of the current audio context and whether the application is currently
         * providing audio; The MirrorLink Server MUST use the application category value from the UPnP
         * advertisements, unless otherwise stated from the application using this SET function. The
         * MirrorLink Server MUST use the given values until a new SET function call is issued. The
         * application has to set the application context information prior to starting the audio
         * stream. Unless set by the application, the MirrorLink Server MUST treat the "Handle Blocking"
         * flag as being set to a FALSE value.
         * <br>
         * If no explicit audio context information is set, then the server will behave as if the
         * appplication doesn't handle audio blocking notifications.
         * <br>
         * Calling this will reset any previous information on the audio context information, so the
         * application must ensure to always include all the context information each time it invokes
         * this call.
         * <br>
         * The application MUST set the application context information with audioContent set to
         * False, after stopping the audio stream.
         * <br>
         * The application MUST continue updating the information, whenever the context changes, even
         * when the audio is blocked by the MirrorLink Client. The MirrorLink Server MUST store the
         * latest update and use it, whenever needed.
         *
         * @param audioContent Application is providing Audio content. If set to True, the application
         * is contributing to the audio stream, which is potentially mixed with other audio sources.
         * @param audioCategories Categories of the audio stream. An integer array of categories with
         * values defined in {@link Defs.ContextInformation}. Usually an application will only have one
         * category (for example media), but if some applications have two or more audio sources
         * contributing to the stream in parallel (for example one application might stream media and
         * navigation at the same time), then it is possible to report both categories. The list should
         * be ordered with the higher priority category first (top priority is at position 0). Setting
         * the value to a null, or empty array, will reset the audio content category to the value
         * provided in the UPnP application advertisement, if audioContent is true.
         * @param handleBlocking Flag indicating whether the application will take care of the blocking
         * if the MirrorLink Client blocks the content.
         */
        setAudioContextInformation : function (audioContent, audioCategories, handleBlocking, success, fail) {
            cordova.exec(success, fail, 'Context', 'setAudioContextInformation', [audioContent, audioCategories, handleBlocking]);
        },
        /**
         * 4.9.1 Framebuffer Context Information.
         *
         * <br>
         * <i>Function reference 0x0801.</i>
         * <br>
         * Provides information of the current framebuffer context; the MirrorLink Server MUST use the
         * application and content category values from the UPnP advertisements, unless otherwise stated
         * from the application using this function. The MirrorLink Server MUST use the given values
         * until a new set function is called. Unless set by the application, the MirrorLink Server MUST
         * treat the "Handle Blocking" flag as being set to a FALSE value.
         * <br>
         * The application MUST continue updating the information, whenever the context chang-es, even
         * when the application is blocked (0x0802) by the MirrorLink Client. The Mir-rorLink Server
         * MUST store the latest update and use it, whenever needed.
         * <br>
         * If no explicit framebuffer context information is set, then the server will behave as if the
         * appplication doesn't handle framebuffer blocking notifications.
         * <br>
         * Calling this will reset any previous information on the framebuffer context information, so
         * the application must ensure to always include all the context information each time it
         * invokes this call.
         *
         * @param content A list of rectangles with their context information. Any areas not
         * covered by the list will be treated as having the default context information. So if the list
         * is empty, then the server will just assume that the context information is the default one
         * for the whole application. Each element of the list is a Bundle with the fields defined in
         * {@link Defs.FramebufferAreaContent}. The ordering of the rectangles in the list is from back
         * to front. The application MUST provide for each item explicit rectangle information and the
         * explicit content category (none of the fileds should not be undefined). The coordinates of
         * each rectangle MUST be absolute screen coordinates.
         * @param handleBlocking Flag indicating whether the application will take care of the blocking
         * if the MirrorLink Client blocks the content.
         */
        setFramebufferContextInformation : function (content, handleBlocking, success, fail) {
            cordova.exec(success, fail, 'Context', 'setFramebufferContextInformation', [content, handleBlocking]);
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
            cordova.exec(success, fail, 'Context', 'unregister', []);
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