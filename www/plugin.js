// Events
var E_ML_AVAILABLE = 'mirrorlink_available',
    // CERTIFICATION EVENTS
    E_ML_CERTIFICATION_STATUS_CHANGE = 'mirrorlink_certification_status_changed',
    // CONNECTION EVENTS
    E_ML_CONNECTION_AUDIO_CHANGE = 'mirrorlink_connection_audio_changed',
    E_ML_CONNECTION_REMOTE_DISPLAY_CHANGE = 'mirrorlink_connection_remote_display_changed',
    E_ML_CONNECTION_SESSION_CHANGE = 'mirrorlink_connection_session_changed',
    // CONTEXT EVENTS
    E_ML_CONTEXT_FRAMEBUFFER_BLOCKED = 'mirrorlink_context_framebuffer_blocked',
    E_ML_CONTEXT_AUDIO_BLOCKED = 'mirrorlink_context_audio_blocked',
    E_ML_CONTEXT_FRAMEBUFFER_UNBLOCKED = 'mirrorlink_context_framebuffer_unblocked',
    E_ML_CONTEXT_AUDIO_UNBLOCKED = 'mirrorlink_context_audio_unblocked',
    // DATA SERVICES
    E_ML_DATASERVICES_AVAILABLE_SERVICES_CHANGED = 'mirrorlink_dataservies_available_services_changed',
    E_ML_DATASERVICES_REGISTER_FOR_SERVICE = 'mirrorlink_dataservies_register_for_service',
    E_ML_DATASERVICES_SUBSCRIBE_REPONSE = 'mirrorlink_dataservies_subscribe_reponse',
    E_ML_DATASERVICES_SET_DATA_OBJECT_RESPONSE = 'mirrorlink_dataservies_set_data_object_response',
    E_ML_DATASERVICES_GET_DATA_OBJECT_RESPONSE = 'mirrorlink_dataservies_get_data_object_response',
    // DEVICE INFO
    E_ML_DEVICEINFO_DEVICE_INFO_CHANGED = 'mirrorlink_datainfo_device_info_changed',
    // DEVICE STATUS EVENTS
    E_ML_DEVICE_STATUS_DRIVE_MODE_CHANGED = 'mirrorlink_device_status_drive_mode_changed',
    E_ML_DEVICE_STATUS_NIGHT_MODE_CHANGED = 'mirrorlink_device_status_night_mode_changed',
    E_ML_DEVICE_STATUS_MICROPHONE_STATUS_CHANGED = 'mirrorlink_device_status_microphone_status_changed',
    // DISPLAY
    E_ML_DISPLAY_CONFIGURATION_CHANGED = 'mirrorlink_display_configuration_changed',
    E_ML_DISPLAY_PIXEL_FORMAT_CHANGED = 'mirrorlink_display_pixel_format_changed',
    // EVENTMAPPING
    E_ML_EVENTMAPPING_EVENT_CONFIGURATION_CHANGED = 'mirrorlink_evenmapping_event_configuration_changed',
    E_ML_EVENTMAPPING_EVENT_MAPPING_CHANGED = 'mirrorlink_evenmapping_event_mapping_changed',
    // NOTIFICATION
    E_ML_NOTIFICATION_NOTIFICATION_ENABLED_CHANGED = 'mirrorlink_notification_enabled_changed',
    E_ML_NOTIFICATION_NOTIFICATION_CONFIGURATION_CHANGED = 'mirrorlink_notification_configuration_changed',
    E_ML_NOTIFICATION_NOTIFICATION_ACTION_RECEIVED = 'mirrorlink_notification_action_received',
    // ERRORS
    E_ML_ERR_SERVICE_CONNECTION_FAILED = 'mirrorlink_error_service_connection_failed';
// Event manager.
var cordovaEventManager = {
    callbacks_stacks: {},
    on: function(event, callback) {
        if (!this.callbacks_stacks[event]) {
            this.callbacks_stacks[event] = [
                callback
            ];
        } else {
            this.callbacks_stacks[event].push(callback);
        }
        return this;
    },
    off: function(event, callback) {
        if (!callback && this.callbacks_stacks[event]) {
            this.callbacks_stacks[event].length = 0;
        } else if (this.callbacks_stacks[event] && callback) {
            var i = this.callbacks_stacks[event].indexOf(callback);
            if (i !== -1) {
                this.callbacks_stacks[event].splice(i, 1);
            }
        }
        return this;
    },
    emit: function(event, datas) {
        if (this.callbacks_stacks[event]) {
            this.callbacks_stacks[event].forEach(function(callback) {
                callback(datas);
            });
        }
        return this;
    },
    service_listeners: {},
    createServiceListener: function(event, cordovaService, cordovaAction, cordovaParams, onError) {
        if (!this.service_listeners[event]) {
            this.service_listeners[event] = function(datas) {
                cordovaEventManager.emit(event, datas);
            };
            cordova.exec(this.service_listeners[event], onError, cordovaService, cordovaAction, cordovaParams || []);
        }
        return this;
    }
};
var mirrorlink = {
    certification: {},
    connection: {},
    context: {},
    dataservices: {},
    deviceinfo: {},
    devicestatus: {},
    display: {},
    eventmapping: {},
    notification: {}
};
/**
 * Mirrorlink plugin status {boolean} true if mirrorlink plugin is connected to
 * mirrorlink android service.
 */
mirrorlink.is_available = false;
/**
 * Enable mirrorlink plugin ( connect your app to mirrorlink android service )
 * 
 * @param {function}
 *            callback Callback executed when mirrorlink plugin connect to
 *            mirrorlink android service.
 * @param {function}
 *            err Callback executed when mirrorlink plugin failed to connect.
 */
mirrorlink.enable = function(callback, err) {
    if (typeof callback === 'function') {
        if (mirrorlink.is_available) {
            return callback();
        }
        cordova.exec(function() {
            mirrorlink.is_available = true;
            callback();
        }, err || function() {}, 'Api', 'connect', []);
    }
};
// -------- CERTIFICATION SERVICE -----------//
/**
 * Listen when then application certification status change. The application
 * would receive this callback if, for example, the certification status changes
 * when the certificate is revoked.
 * 
 * @param {function}
 *            callback Function to execute when certification status changes.
 * @param {function}
 *            err Function executed if service failed to bind listener to event.
 */
mirrorlink.certification.onCertificationStatusChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_CERTIFICATION_STATUS_CHANGE, 'Certification', 'onCertificationStatusChanged', [], err)
            .on(E_ML_CERTIFICATION_STATUS_CHANGE, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.certification.offCertificationStatusChanged = function(callback) {
    cordovaEventManager.off(E_ML_CERTIFICATION_STATUS_CHANGE, callback);
};
/**
 * Get Application Certification Status.
 * 
 * @param {function}
 *            callback Function executed with a bundle:
 *            {"HAS_VALID_CERTIFICATE":boolean,"ADVERTISED_AS_CERTIFIEDAPP":boolean}
 * @param {function}
 *            err Executed if service failed to get certifying entities.
 */
mirrorlink.certification.getApplicationCertificationStatus = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Certification', 'getApplicationCertificationStatus', []);
    }
};
/**
 * Get Application Certifying Entities.
 * 
 * @param {function}
 *            callback Function executed with comma-separated list of certifying
 *            entities, which certified the application,
 * @param {function}
 *            err Executed if service failed to get certifying entities.
 */
mirrorlink.certification.getApplicationCertifyingEntities = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err || function() {}, 'Certification', 'getApplicationCertifyingEntities', []);
    }
};
/**
 * Get Application Certification Information.
 * 
 * @param {string}
 *            entity Name of the certifying entity
 * @param {function}
 *            callback Function executed with application certification
 *            information bundle
 *            {entity:string,certified:boolean,restricted:string,nonrestricted:string}
 *            or null if the application isn't certified or the entity is not
 *            part of the list of certifying entities for the application.
 * @param {function}
 *            err Executed if service failed to get information.
 */
mirrorlink.certification.getApplicationCertificationInformation = function(entity, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function' && typeof entity === 'string') {
        cordova.exec(callback, err, 'Certification', 'getApplicationCertificationInformation', [
            entity
        ]);
    }
};
// -------- CONNECTION SERVICE -----------//
/**
 * Indicates whether a MirrorLink session is currently established. A MirrorLink
 * is considered established if a ClientProfile has been set on the MirrorLink
 * Server for the current tethering session.
 * 
 * /!\ The application MUST use this call and its event listener
 * 'mirrorlink.connection.onSessionChanged' to determine whether a MirrorLink
 * session is established. MirrorLink applications SHOULD use other Common API
 * modules only while a MirrorLink Session is running. MirrorLink Servers MUST
 * have the Common API modules available at all times.
 * 
 * @param {function}
 *            callback Executed with boolean.
 * @param {function}
 *            err Executed if it failed to get session status.
 */
mirrorlink.connection.isMirrorLinkSessionEstablished = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Connection', 'isMirrorLinkSessionEstablished', []);
    }
};
/**
 * Listen when the mirrorLink session status has changed.
 * 
 * /!\ The application MUST use this listener and its equivalent getter
 * 'mirrorlink.connection.isSessionEstablished' to determine whether a
 * MirrorLink session is established. MirrorLink applications SHOULD use other
 * Common API modules only while a MirrorLink Session is running. MirrorLink
 * Servers MUST have the Common API modules available at all times.
 * 
 * @param {function}
 *            callback Function executed with mirrorlink session status when
 *            session status changed with boolean.
 * @param {function}
 *            err Function executed if service failed to bind listener to event.
 */
mirrorlink.connection.onMirrorLinkSessionChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_CONNECTION_SESSION_CHANGE, 'Connection', 'onMirrorLinkSessionChanged', [], err)
            .on(E_ML_CONNECTION_SESSION_CHANGE, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_session_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.connection.offMirrorLinkSessionChanged = function(callback) {
    cordovaEventManager.off(E_ML_CONNECTION_SESSION_CHANGE, callback);
};
/**
 * Get established audio connections within mirrorlink session.
 * 
 * @param {function}
 *            callback Executed with a bundle containing the status of the audio
 *            connections available (see {@link Defs.AudioConnections}).
 *            exemple :
 *            {"PHONE_AUDIO":1,"MEDIA_AUDIO_OUT":2,"PAYLOAD_TYPES":"0","VOICE_CONTROL":2,"MEDIA_AUDIO_IN":2}
 * @param {function}
 *            err Executed if it failed to get audio connections.
 */
mirrorlink.connection.getAudioConnections = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Connection', 'getAudioConnections', []);
    }
};
/**
 * Listen when the audio connections changed.
 * 
 * @param {function}
 *            callback Function to execute when audio connection changes with
 *            audioConnections Bundle.
 * @param {function}
 *            err Function executed if service failed to bind listener to event.
 */
mirrorlink.connection.onAudioConnectionsChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_CONNECTION_AUDIO_CHANGE, 'Connection', 'onAudioConnectionsChanged', [], err)
            .on(E_ML_CONNECTION_AUDIO_CHANGE, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_audio_connection_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.connection.offAudioConnectionsChanged = function(callback) {
    cordovaEventManager.off(E_ML_CONNECTION_AUDIO_CHANGE, callback);
};
/**
 * Get established remote display connections within mirrorlink session.
 * 
 * @param {function}
 *            callback Executed with value containing the status of the remote
 *            display connections available (see
 *            {@link Defs.RemoteDisplayConnection}). return integer
 * @param {function}
 *            err Executed if it failed to get audio connections.
 */
mirrorlink.connection.getRemoteDisplayConnections = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Connection', 'getRemoteDisplayConnections', []);
    }
};
/**
 * Listen when the remote display connections changed.
 * 
 * @param {function}
 *            callback Function to execute when audio connection changes with
 *            remoteDisplayConnection integer (see
 *            {@link Defs.RemoteDisplayConnection}). return integer
 * @param {function}
 *            err Function executed if service failed to bind listener to event.
 */
mirrorlink.connection.onRemoteDisplayConnectionChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_CONNECTION_REMOTE_DISPLAY_CHANGE, 'Connection', 'onRemoteDisplayConnectionChanged', [], err)
            .on(E_ML_CONNECTION_REMOTE_DISPLAY_CHANGE, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_audio_connection_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.connection.offRemoteDisplayConnectionChanged = function(callback) {
    cordovaEventManager.off(E_ML_CONNECTION_REMOTE_DISPLAY_CHANGE, callback);
};
// -------- CONTEXT SERVICE -----------//
/**
 * 4.9.1 Framebuffer Context Information.
 * 
 * Provides information of the current framebuffer context; the MirrorLink
 * Server MUST use the application and content category values from the UPnP
 * advertisements, unless otherwise stated from the application using this
 * function. The MirrorLink Server MUST use the given values until a new set
 * function is called. Unless set by the application, the MirrorLink Server MUST
 * treat the "Handle Blocking" flag as being set to a FALSE value.
 * 
 * The application MUST continue updating the information, whenever the context
 * chang-es, even when the application is blocked (0x0802) by the MirrorLink
 * Client. The Mir-rorLink Server MUST store the latest update and use it,
 * whenever needed.
 * 
 * If no explicit framebuffer context information is set, then the server will
 * behave as if the appplication doesn't handle framebuffer blocking
 * notifications.
 * 
 * Calling this will reset any previous information on the framebuffer context
 * information, so the application must ensure to always include all the context
 * information each time it invokes this call.
 * 
 * @param content
 *            A list of rectangles with their context information. Any areas not
 *            covered by the list will be treated as having the default context
 *            information. So if the list is empty, then the server will just
 *            assume that the context information is the default one for the
 *            whole application. Each element of the list is a Bundle with the
 *            fields defined in {@link Defs.FramebufferAreaContent}. The
 *            ordering of the rectangles in the list is from back to front. The
 *            application MUST provide for each item explicit rectangle
 *            information and the explicit content category (none of the fileds
 *            should not be undefined). The coordinates of each rectangle MUST
 *            be absolute screen coordinates.
 * @exemple content param : [ { "APPLICATION_CATEGORY" : "<integer>",
 *          "CONTENT_CATEGORY" : "<integer>", "RECT" : { "WIDTH" <integer>,
 *          "HEIGHT" <integer>, "X" <integer>, "Y" <integer> } },... ]
 * 
 * @param handleBlocking
 *            Flag indicating whether the application will take care of the
 *            blocking if the MirrorLink Client blocks the content.
 * 
 * @param {function}
 *            callback Executed with value containing the status of the
 *            Framebuffer Context Information available (see
 *            {@link Defs.RemoteDisplayConnection}).
 * 
 * @param {function}
 *            err Executed if it failed to get Framebuffer Context Information.
 */
mirrorlink.context.setFramebufferContextInformation = function(content, handleBlocking, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Context', 'setFramebufferContextInformation', [
            content,
            handleBlocking
        ]);
    }
};
/**
 * 4.9.2 Framebuffer Blocking Information Callback.
 * 
 * Listen when the Framebuffer Blocking changed.
 * 
 * Framebuffer is blocked from the MirrorLink Client; in case the application
 * has indicated that it will handle the blocking it MUST remove the blocked
 * content.
 * 
 * Sometimes the application MUST switch to a new view and update its context
 * information, other times there is nothing the application can do to help
 * unblock the framebuffer. For details of reasons of blocking and what the
 * application is required to do see {@link Defs.BlockingInformation}.
 * 
 * @param {function}
 *            callback with reason Reason for Framebuffer blocking. Will have a
 *            value defined in {@link Defs.BlockingInformation}. Note: Blocking
 *            because of the wrong framebuffer orientation, is not reported via
 *            this function. And framebufferArea Framebuffer rectangle for the
 *            specified region. The values available are defined in
 *            {@link Defs.Rect}.
 * 
 * @exemple {"reason":2,"framebufferArea":{"CONTENT_CATEGORY":12,"RECT":{"X":50,"Y":50,"WIDTH":200,"HEIGHT":200}}}
 * 
 * @param {function}
 *            err Function executed if service failed to bind listener to event.
 * @see #onFramebufferUnblocked
 */
mirrorlink.context.onFramebufferBlocked = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_CONTEXT_FRAMEBUFFER_BLOCKED, 'Context', 'onFramebufferBlocked', [], err)
            .on(E_ML_CONTEXT_FRAMEBUFFER_BLOCKED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.context.offFramebufferBlocked = function(callback) {
    cordovaEventManager.off(E_ML_CONTEXT_FRAMEBUFFER_BLOCKED, callback);
};
/**
 * 4.9.3 Audio Context Information.
 * 
 * Provides information of the current audio context and whether the application
 * is currently providing audio; The MirrorLink Server MUST use the application
 * category value from the UPnP advertisements, unless otherwise stated from the
 * application using this SET function. The MirrorLink Server MUST use the given
 * values until a new SET function call is issued. The application has to set
 * the application context information prior to starting the audio stream.
 * Unless set by the application, the MirrorLink Server MUST treat the "Handle
 * Blocking" flag as being set to a FALSE value.
 * 
 * If no explicit audio context information is set, then the server will behave
 * as if the appplication doesn't handle audio blocking notifications.
 * 
 * Calling this will reset any previous information on the audio context
 * information, so the application must ensure to always include all the context
 * information each time it invokes this call.
 * 
 * The application MUST set the application context information with
 * audioContent set to False, after stopping the audio stream.
 * 
 * The application MUST continue updating the information, whenever the context
 * changes, even when the audio is blocked by the MirrorLink Client. The
 * MirrorLink Server MUST store the latest update and use it, whenever needed.
 * 
 * @param audioContent
 *            Application is providing Audio content. If set to True, the
 *            application is contributing to the audio stream, which is
 *            potentially mixed with other audio sources.
 * 
 * @param audioCategories
 *            Categories of the audio stream. An integer array of categories
 *            with values defined in {@link Defs.ContextInformation}. Usually
 *            an application will only have one category (for example media),
 *            but if some applications have two or more audio sources
 *            contributing to the stream in parallel (for example one
 *            application might stream media and navigation at the same time),
 *            then it is possible to report both categories. The list should be
 *            ordered with the higher priority category first (top priority is
 *            at position 0). Setting the value to a null, or empty array, will
 *            reset the audio content category to the value provided in the UPnP
 *            application advertisement, if audioContent is true.
 * 
 * @param handleBlocking
 *            Flag indicating whether the application will take care of the
 *            blocking if the MirrorLink Client blocks the content.
 * 
 * @param {function}
 *            callback Executed with value containing the status of the set
 *            Audio Context Information available (see
 *            {@link Defs.RemoteDisplayConnection}).
 * 
 * @param {function}
 *            err Executed if it failed to set Audio Context Information.
 */
mirrorlink.context.setAudioContextInformation = function(audioContent, audioCategories, handleBlocking, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Context', 'setAudioContextInformation', [
            audioContent,
            audioCategories,
            handleBlocking
        ]);
    }
};
/**
 * 4.9.4 Audio Blocking Information.
 * 
 * Audio is blocked from the MirrorLink Client; in case the application has
 * indicated that it will handle the blocking it MUST remove the blocked
 * content.
 * 
 * @param reason
 *            Reason for Audio blocking. Will have a value defined in {@link
 *            Defs.BlockingInformation}. The reason MUST be different from 0 as
 *            reason 0 means that the audio is unblocked, that is reported via
 *            {@link #onAudioUnblocked}.
 * 
 * @see #onAudioUnblocked
 * 
 * @param {function}
 *            err Function executed if service failed to bind listener to event.
 * 
 * @see #onFramebufferUnblocked
 */
mirrorlink.context.onAudioBlocked = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_CONTEXT_AUDIO_BLOCKED, 'Context', 'onAudioBlocked', [], err)
            .on(E_ML_CONTEXT_AUDIO_BLOCKED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.context.offAudioBlocked = function(callback) {
    cordovaEventManager.off(E_ML_CONTEXT_AUDIO_BLOCKED, callback);
};
/**
 * 4.9.4 Audio Blocking Information.
 * 
 * Audio is blocked from the MirrorLink Client; in case the application has
 * indicated that it will handle the blocking it MUST remove the blocked
 * content.
 * 
 * @param reason
 *            Reason for Audio blocking. Will have a value defined in {@link
 *            Defs.BlockingInformation}. The reason MUST be different from 0 as
 *            reason 0 means that the audio is unblocked, that is reported via
 *            {@link #onAudioUnblocked}.
 * 
 * @see #onAudioUnblocked
 * 
 * @param {function}
 *            err Function executed if service failed to bind listener to event.
 * 
 * @see #onFramebufferUnblocked
 */
mirrorlink.context.onAudioBlocked = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_CONTEXT_AUDIO_BLOCKED, 'Context', 'onAudioBlocked', [], err)
            .on(E_ML_CONTEXT_AUDIO_BLOCKED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.context.offAudioBlocked = function(callback) {
    cordovaEventManager.off(E_ML_CONTEXT_AUDIO_BLOCKED, callback);
};
/**
 * 4.9.5 Framebuffer Unblocking Callback
 * 
 * Framebuffer is unblocked from the MirrorLink Client. There can be various
 * ways to unblock the framebuffer, depending on the blocking reasons. See
 * {@link Defs.BlockingInformation} for details.
 * 
 * If the framebuffer was blocked with more than one reason, all the reasons
 * must be resolved before this callback will be issued.
 * 
 * @see #onFramebufferBlocked
 */
mirrorlink.context.onFramebufferUnblocked = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_CONTEXT_FRAMEBUFFER_UNBLOCKED, 'Context', 'onFramebufferUnblocked', [], err)
            .on(E_ML_CONTEXT_FRAMEBUFFER_UNBLOCKED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.context.offFramebufferUnblocked = function(callback) {
    cordovaEventManager.off(E_ML_CONTEXT_FRAMEBUFFER_UNBLOCKED, callback);
};
/**
 * 4.9.6 Audio Unblocking Callback
 * 
 * Audio is unblocked from the MirrorLink Client. This signal will be emitted,
 * if the MirrorLink Client has previously blocked application's audio stream.
 * The application will receive this signal, as soon as the MirrorLink Client
 * resumes the audio.
 * 
 * @see #onAudioBlocked
 */
mirrorlink.context.onAudioUnblocked = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_CONTEXT_AUDIO_UNBLOCKED, 'Context', 'onAudioUnblocked', [], err)
            .on(E_ML_CONTEXT_AUDIO_UNBLOCKED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.context.offAudioUnblocked = function(callback) {
    cordovaEventManager.off(E_ML_CONTEXT_AUDIO_UNBLOCKED, callback);
};
// -------- DATA SERVICES -----------//
/**
 * 4.11.1 Get Available Services.
 * 
 * Retrieve list of available Services provided from the MirrorLink Client and
 * supported from the MirrorLink Server.
 * 
 * @return List of provided services; an empty list is returned if the CDB
 *         connection has not been established. The list contains Bundles with
 *         the fields as defined in {@link Defs.ServiceInformation}.
 */
mirrorlink.dataservices.getAvailableServices = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DataServices', 'getAvailableServices', []);
    }
};
/**
 * 4.11.2 Available Services Callback.
 * 
 * Change in available services. Callback must be called, when CDB connection is
 * established.
 * 
 * @param services
 *            List of provided services. The list contains Bundles with the
 *            fields as defined in {@link Defs.ServiceInformation}.
 */
mirrorlink.dataservices.onAvailableServicesChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DATASERVICES_AVAILABLE_SERVICES_CHANGED, 'DataServices', 'onAvailableServicesChanged', [], err)
            .on(E_ML_DATASERVICES_AVAILABLE_SERVICES_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.dataservices.offAvailableServicesChanged = function(callback) {
    cordovaEventManager.off(E_ML_DATASERVICES_AVAILABLE_SERVICES_CHANGED, callback);
};
/**
 * 4.11.3 Register to a Service.
 * 
 * Register to an available Service.
 * 
 * @param serviceId
 *            Service identifier. Can be one of {@link
 *            Defs.LocationService#LOCATION_OBJECT_UID}, or
 *            {@link Defs.GPSService#NMEA_OBJECT_UID}.
 * @param versionMajor
 *            The major version of the service supported by the application.
 * @param versionMinor
 *            The minor version of the service supported by the application.
 */
mirrorlink.dataservices.registerToService = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DataServices', 'registerToService', []);
    }
};
/**
 * 4.11.4 Register to a Service Callback.
 * 
 * Registration completed.
 * 
 * @param serviceId
 *            Service identifier.
 * @param success
 *            Flag, to indicate whether the action is successful.
 */
mirrorlink.dataservices.onRegisterForService = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DATASERVICES_REGISTER_FOR_SERVICE, 'DataServices', 'offRegisterForService', [], err)
            .on(E_ML_DATASERVICES_REGISTER_FOR_SERVICE, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.dataservices.offRegisterForService = function(callback) {
    cordovaEventManager.off(E_ML_DATASERVICES_REGISTER_FOR_SERVICE, callback);
};
/**
 * 4.11.5 Unregister from a Service.
 * 
 * Unregister from an available Service.
 * 
 * @param serviceId
 *            Service identifier.
 */
mirrorlink.dataservices.unregisterFromService = function(serviceId, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DataServices', 'unregisterFromService', [
            serviceId
        ]);
    }
};
/**
 * 4.11.6 Subscribe to an Object.
 * 
 * Subscribe a Service Object.
 * 
 * @param serviceId
 *            Service identifier.
 * @param objectId
 *            Hash value of the object.
 */
mirrorlink.dataservices.subscribeObject = function(serviceId, objectId, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DataServices', 'subscribeObject', [
            serviceId,
            objectId
        ]);
    }
};
/**
 * 4.11.7 Subscribe to an Object Callback.
 * 
 * Subscription complete.
 * 
 * If the subcription was successful then any update to the value of the data
 * will be provided via {@link #onGetDataObjectResponse}.
 * 
 * @param serviceId
 *            Service identifier.
 * @param objectId
 *            Hash value of the object.
 * @param success
 *            Flag, to indicate whether the action is successful.
 * @param subscriptionType
 *            The subscription type. Will have one of the values defined in
 *            {@link Defs.SubscriptionType}.
 * @param interval
 *            Regular time interval in ms, in which updates are sent. MUST be 0
 *            for subscription types {@link Defs.SubscriptionType#ON_CHANGE} and
 *            {@link Defs.SubscriptionType#AUTOMATIC}.
 */
mirrorlink.dataservices.onSubscribeResponse = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DATASERVICES_SUBSCRIBE_REPONSE, 'DataServices', 'onSubscribeResponse', [], err)
            .on(E_ML_DATASERVICES_SUBSCRIBE_REPONSE, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.dataservices.offSubscribeResponse = function(callback) {
    cordovaEventManager.off(E_ML_DATASERVICES_SUBSCRIBE_REPONSE, callback);
};
/**
 * 4.11.8 Unsubscribe from an Object.
 * 
 * Unsubscribe from a Service Object.
 * 
 * @param serviceId
 *            Service identifier.
 * @param objectId
 *            Hash value of the object.
 */
mirrorlink.dataservices.unsubscribeObject = function(serviceId, objectId, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DataServices', 'unsubscribeObject', [
            serviceId,
            objectId
        ]);
    }
};
/**
 * 4.11.9 Set an Object.
 * 
 * Set a Service Object. Requires established CDB connection and registered
 * service.
 * 
 * The Object is packaged as a Bundle as described in
 * {@link Defs.DataObjectKeys}.
 * 
 * @param serviceId
 *            Service identifier.
 * @param objectId
 *            the hash value of the object.
 * @param object
 *            Bundle containing the object payload.
 */
mirrorlink.dataservices.setObject = function(serviceId, objectId, object, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DataServices', 'unsubscribeObject', [
            serviceId,
            objectId,
            object
        ]);
    }
};
/**
 * 4.11.10 Set an Object Callback.
 * 
 * Object set.
 * 
 * @param serviceId
 *            Service identifier
 * @param objectId
 *            Hash value of the object
 * @param success
 *            Flag to indicate whether the action is successful.
 */
mirrorlink.dataservices.onSetDataObjectResponse = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DATASERVICES_SET_DATA_OBJECT_RESPONSE, 'DataServices', 'onSetDataObjectResponse', [], err)
            .on(E_ML_DATASERVICES_SET_DATA_OBJECT_RESPONSE, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.dataservices.offSetDataObjectResponse = function(callback) {
    cordovaEventManager.off(E_ML_DATASERVICES_SET_DATA_OBJECT_RESPONSE, callback);
};
/**
 * 4.11.11 Get an Object.
 * 
 * Get a Service Object. Requires established CDB connection and registered
 * service.
 * 
 * @param serviceId
 *            Service identifier
 * @param objectId
 *            the hash value of the object
 */
mirrorlink.dataservices.getObject = function(serviceId, objectId, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DataServices', 'getObject', [
            serviceId,
            objectId
        ]);
    }
};
/**
 * 4.11.11 Get an Object Callback.
 * 
 * Object received, packaged as a Bundle as described in
 * {@link Defs.DataObjectKeys}.
 * 
 * @param serviceId
 *            Service identifier
 * @param objectId
 *            Hash value of the object
 * @param success
 *            Flag to indicate whether the action is successful.
 * @param object
 *            Bundle containing the object payload.
 */
mirrorlink.dataservices.onGetDataObjectResponse = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DATASERVICES_GET_DATA_OBJECT_RESPONSE, 'DataServices', 'onGetDataObjectResponse', [], err)
            .on(E_ML_DATASERVICES_GET_DATA_OBJECT_RESPONSE, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.dataservices.offGetDataObjectResponse = function(callback) {
    cordovaEventManager.off(E_ML_DATASERVICES_GET_DATA_OBJECT_RESPONSE, callback);
};
// -------- DEVISE INFO -----------//
/**
 * 4.2.1 MirrorLink Session Major Version.
 * 
 * Available MirrorLink Version for the established connection, as agreed
 * between the MirrorLink Server and Client. Information MUST be available as
 * soon as the MirrorLink session is connected
 * 
 * @return MirrorLink Session major version or 1 if version information is not
 *         available.
 */
mirrorlink.deviceinfo.getMirrorLinkSessionVersionMajor = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DeviceInfo', 'getObject', []);
    }
};
/**
 * 4.2.1 MirrorLink Session Minor Version.
 * 
 * Available MirrorLink Version for the established connection, as agreed
 * between the MirrorLink Server and Client. Information MUST be available as
 * soon as the MirrorLink session is connected
 * 
 * @return MirrorLink Session minor version or 0 if version information is not
 *         available.
 */
mirrorlink.deviceinfo.getMirrorLinkSessionVersionMinor = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DeviceInfo', 'getMirrorLinkSessionVersionMinor', []);
    }
};
/**
 * 4.2.2 MirrorLink Client Manufacturer and Model Information.
 * 
 * Provided MirrorLink client manufacturer and model information, as received
 * through the UPnP Client Profile Service; any later change to the provided
 * information MUST be notified via the callback function.
 * 
 * @return Bundle containg the client information or null if no client is
 *         connected. The bundle will contain the values defined in
 *         {@link Defs.ClientInformation}.
 */
mirrorlink.deviceinfo.getMirrorLinkClientInformation = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DeviceInfo', 'getMirrorLinkClientInformation', []);
    }
};
/**
 * 4.2.4 MirrorLink Client Manufacturer and Model Information Callback.
 * 
 * Indicates that the Client information has changed;
 * 
 * @param clientInformation
 *            containg the client information or null if no client is connected.
 *            The bundle will contain the values defined in
 *            {@link Defs.ClientInformation}.
 */
mirrorlink.deviceinfo.onDeviceInfoChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DEVICEINFO_DEVICE_INFO_CHANGED, 'DataServices', 'onDeviceInfoChanged', [], err)
            .on(E_ML_DEVICEINFO_DEVICE_INFO_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_context_framebuffer_blocked" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.deviceinfo.offDeviceInfoChanged = function(callback) {
    cordovaEventManager.off(E_ML_DEVICEINFO_DEVICE_INFO_CHANGED, callback);
};
/**
 * 4.2.5 Server Device Virtual Keyboard Support.
 * 
 * Provides information about the available virtual keyboard from the MirrorLink
 * Server, which can be used from application, during a MirrorLink session.
 * Handling of the virtual keyboard is following regular Android means.
 * 
 * @return Bundle containg the virtual keyboard support. It will contain the
 *         values defined in {@link Defs.VirtualKeyboardSupport}.
 */
mirrorlink.deviceinfo.getServerVirtualKeyboardSupport = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DeviceInfo', 'getServerVirtualKeyboardSupport', []);
    }
};
// -------- DEVICE STATUS SERVICE -----------//
/**
 * 4.10.1 Drive Mode.
 * 
 * Check the drive mode status on the MirrorLink Server; requires established
 * VNC connection.
 * 
 * @return Flag set to true if the Server is in Drive Mode.
 */
mirrorlink.devicestatus.isInDriveMode = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DeviceStatus', 'isInDriveMode', []);
    }
};
/**
 * 4.10.2 Drive Mode Callback.
 * 
 * Enable drive mode on the MirrorLink Server application.
 * 
 * @param driveMode
 *            Flag indicating drive mode.
 */
mirrorlink.devicestatus.onDriveModeChange = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DEVICE_STATUS_DRIVE_MODE_CHANGED, 'DeviceStatus', 'onDriveModeChange', [], err)
            .on(E_ML_DEVICE_STATUS_DRIVE_MODE_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.devicestatus.offDriveModeChange = function(callback) {
    cordovaEventManager.off(E_ML_DEVICE_STATUS_DRIVE_MODE_CHANGED, callback);
};
/**
 * 4.10.3 Night Mode.
 * 
 * Check the night mode status on the MirrorLink Server; requires established
 * VNC connection.
 * 
 * @return Flag set to true if the Server is in Night Mode.
 */
mirrorlink.devicestatus.isInNightMode = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DeviceStatus', 'isInNightMode', []);
    }
};
/**
 * 4.10.4 Night Mode Callback.
 * 
 * Enable night mode on the MirrorLink Server application.
 * 
 * @param nightMode
 *            Flag indicating night mode.
 */
mirrorlink.devicestatus.onNightModeChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DEVICE_STATUS_NIGHT_MODE_CHANGED, 'DeviceStatus', 'onNightModeChanged', [], err)
            .on(E_ML_DEVICE_STATUS_NIGHT_MODE_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.devicestatus.offNightModeChanged = function(callback) {
    cordovaEventManager.off(E_ML_DEVICE_STATUS_NIGHT_MODE_CHANGED, callback);
};
/**
 * 4.10.5 Microphone State.
 * 
 * Check the status of the Microphone from the MirrorLink Client; requires
 * established VNC connection.
 * 
 * @return Flag set to true if the mic input is enabled on MirrorLink Client.
 */
mirrorlink.devicestatus.isMicrophoneOn = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DeviceStatus', 'isMicrophoneOn', []);
    }
};
/**
 * 4.10.6 Open Microphone Callback.
 * 
 * Response on opening the Microphone from the MirrorLink Client.
 * 
 * @param micInput
 *            Flag whether mic input is enabled on MirrorLink Client.
 */
mirrorlink.devicestatus.onMicrophoneStatusChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DEVICE_STATUS_MICROPHONE_STATUS_CHANGED, 'DeviceStatus', 'onMicrophoneStatusChanged', [], err)
            .on(E_ML_DEVICE_STATUS_MICROPHONE_STATUS_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.devicestatus.offMicrophoneStatusChanged = function(callback) {
    cordovaEventManager.off(E_ML_DEVICE_STATUS_MICROPHONE_STATUS_CHANGED, callback);
};
/**
 * 4.10.7 Set Open Microphone.
 * 
 * Open the Microphone on the MirrorLink Client.
 * 
 * @param micInput
 *            Flag enabling mic input on the MirrorLink Client.
 * @param voiceInput
 *            Flag enabling voice input on the MirrorLink Client. The
 *            application MUST set the Mic Input flag to true if the Voice input
 *            flag is set to true.
 */
mirrorlink.devicestatus.setMicrophoneOpen = function(micInput, voiceInput, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'DeviceStatus', 'setMicrophoneOpen', [
            micInput,
            voiceInput
        ]);
    }
};
// -------- DEVICE DISPLAY -----------//
/**
 * 4.5.1 Display Configuration.
 * 
 * Access information on the display properties of the MirrorLink Session; this
 * information is used by MirrorLink certified applications to adapt its user
 * interface to fulfill driver distraction guidelines, in particular regarding
 * font sizes; Requires an established VNC connection; any later change to the
 * provided information are notified via the callback function
 * {@link IDisplayListener#onDisplayConfigurationChanged}.
 * 
 * The provided framebuffer resolutions are modeling the following framebuffer
 * pipeline:
 * <ol>
 * <li>The applications renders its user interface into a framebuffer available
 * in full to the application (App Horizontal / Vertical Resolution). </li>
 * <li>The MirrorLink Server scales that framebuffer to better fit the
 * MirrorLink Cli- ent’s framebuffer properties (Server Horizontal / Vertical
 * Resolution). </li>
 * <li>The MirrorLink Server adds pad rows and/or columns to the scaled
 * framebuffer (Server Pad Rows / Columns). </li>
 * <li>The MirrorLink Server transmits that framebuffer to the MirrorLink
 * Client. </li>
 * <li>The MirrorLink Client scales the received framebuffer to fit into its
 * framebuffer (Client Horizontal / Vertical Resolution); the MirrorLink Client
 * may add pad rows or columns (but not both) to compensate for differences in
 * the framebuffer aspect ratio. Those pad rows or columns to not take away any
 * resolution from the transmitted MirrorLink Server framebuffer. </li>
 * </ol>
 * <br>
 * All pixel-based resolutions are based on a pixel aspect ratio of 1 (one),
 * i.e. a squared pixel.
 * 
 * @return Bundle object containing the display configuration, as defined in
 *         {@link Defs.DisplayConfiguration}, of the MirrorLink session.
 */
mirrorlink.display.getDisplayConfiguration = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Display', 'getDisplayConfiguration', []);
    }
};
/**
 * 4.5.2 Display Configuration Callback.
 * 
 * Display Configuration has changed.
 * 
 * @param displayConfiguration
 *            the display configuration of the MirrorLink Client. The fields
 *            available in the data type are in
 *            {@link Defs.DisplayConfiguration}.
 */
mirrorlink.display.onDisplayConfigurationChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DISPLAY_CONFIGURATION_CHANGED, 'Display', 'onDisplayConfigurationChanged', [], err)
            .on(E_ML_DISPLAY_CONFIGURATION_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.display.offDisplayConfigurationChanged = function(callback) {
    cordovaEventManager.off(E_ML_DISPLAY_CONFIGURATION_CHANGED, callback);
};
/**
 * 4.5.3 Client Pixel Format.
 * 
 * Access information about the pixel format of the framebuffer data, being
 * transmitted to the MirrorLink Client.
 * 
 * @return The pixel format of the framebuffer data. A Bundle with the fields
 *         defined in {@link Defs.ClientPixelFormat}.
 */
mirrorlink.display.getClientPixelFormat = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Display', 'getClientPixelFormat', []);
    }
};
/**
 * 4.5.4 Client Pixel Format Callback.
 * 
 * Pixel format has changed.
 * 
 * @param pixelFormat
 *            the pixel format of the framebuffer data. A Bundle with the fields
 *            defined in {@link Defs.ClientPixelFormat}.
 */
mirrorlink.display.onPixelFormatChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_DISPLAY_PIXEL_FORMAT_CHANGED, 'Display', 'onPixelFormatChanged', [], err)
            .on(E_ML_DISPLAY_PIXEL_FORMAT_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.display.offPixelFormatChanged = function(callback) {
    cordovaEventManager.off(E_ML_DISPLAY_PIXEL_FORMAT_CHANGED, callback);
};
// -------- EVENT MAPPING -----------//
/**
 * 4.6.1 Event Configuration.
 * 
 * Access information on the event properties of the MirrorLink connection, i.e.
 * the event properties, which are supported from both, the MirrorLink Server
 * and MirrorLink Client; details on the event configuration are specified in
 * the VNC specification.
 * 
 * Requires established VNC connection; any later change to the provided
 * information MUST be notified via the callback function
 * {@link IEventMappingListener#onEventConfigurationChanged}.
 * 
 * @return The event configuration of the connection as specified in MirrorLink
 *         VNC specification. The fields available in the return type are
 *         defined in {@link Defs.EventConfiguration}.
 */
mirrorlink.eventmapping.getEventConfiguration = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'EventMapping', 'getEventConfiguration', []);
    }
};
/**
 * 4.6.2 Event Configuration Callback.
 * 
 * MirrorLink session event configuration information has changed.
 * 
 * @param eventConfiguration
 *            The event configuration of the MirrorLink session. The fields
 *            available in the return type are defined in
 *            {@link Defs.EventConfiguration}.
 */
mirrorlink.eventmapping.onEventConfigurationChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_EVENTMAPPING_EVENT_CONFIGURATION_CHANGED, 'EventMapping', 'onEventConfigurationChanged', [], err)
            .on(E_ML_EVENTMAPPING_EVENT_CONFIGURATION_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.eventmapping.offEventConfigurationChanged = function(callback) {
    cordovaEventManager.off(E_ML_EVENTMAPPING_EVENT_CONFIGURATION_CHANGED, callback);
};
/**
 * 4.6.3 Get Event Mapping.
 * 
 * Mapping MirrorLink Client events to local MirrorLink Server events; this API
 * call gives access to the internal mapping in the MirrorLink Server.
 * 
 * Requires established VNC connection; any later change to the provided
 * information MUST be notified via the callback function
 * {@link IEventMappingListener#onEventMappingChanged}.
 * 
 * @return The key mapping information about remote events and local events.
 *         This is a list of Bundles that have their fields defined in
 *         {@link Defs.EventMapping}.
 */
mirrorlink.eventmapping.getEventMappings = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'EventMapping', 'getEventMappings', []);
    }
};
/**
 * 4.6.4 Get Event Mapping Callback.
 * 
 * The application MUST be notified, whenever the MirrorLink Server and Client
 * change the mapping.
 * 
 * @param eventMapping
 *            The mapping information about remote events and local events. This
 *            is a Bundle with the fields defined in {@link Defs.EventMapping}.
 */
mirrorlink.eventmapping.onEventMappingChanged = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_EVENTMAPPING_EVENT_MAPPING_CHANGED, 'EventMapping', 'onEventMappingChanged', [], err)
            .on(E_ML_EVENTMAPPING_EVENT_MAPPING_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.eventmapping.offEventMappingChanged = function(callback) {
    cordovaEventManager.off(E_ML_EVENTMAPPING_EVENT_MAPPING_CHANGED, callback);
};
// -------- NOTIFICATION -----------//
/**
 * 4.12.1 Notifications Supported.
 * 
 * Indicate support for UPnP notifications from the application; the MirrorLink
 * Server will issue a NotiAppListUpdate event, to inform the MirrorLink Client
 * that the notification support for this application has changed. Unless
 * otherwise set by the application, the MirrorLink Server MUST assume that the
 * application will not support notifications.
 * 
 * @param notificationSupported
 *            Flag indicating notification support from the application.
 */
mirrorlink.notification.setNotificationSupported = function(notificationSupported, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Notification', 'setNotificationSupported', [
            notificationSupported
        ]);
    }
};
/**
 * 4.12.2 Notifications Enabled.
 * 
 * Checks whether notifications are enabled for the application from the
 * MirrorLink Server and Client.
 * 
 * @return Flag indicating that notifications are enabled from MirrorLink Server
 *         and Client for the application.
 */
mirrorlink.notification.getNotificationEnabled = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Notification', 'getNotificationEnabled', []);
    }
};
/**
 * 4.12.3 Notifications Enabled Callback.
 * 
 * Notification that enablement has changed.
 * 
 * @param notiEnabled
 *            The flag indicating the notifications are enabled or not.
 */
mirrorlink.notification.onNotificationEnabledChanged = function(notiEnabled, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_NOTIFICATION_NOTIFICATION_ENABLED_CHANGED, 'Notification', 'onNotificationEnabledChanged', [
                notiEnabled
            ], err)
            .on(E_ML_NOTIFICATION_NOTIFICATION_ENABLED_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.notification.offNotificationEnabledChanged = function(callback) {
    cordovaEventManager.off(E_ML_NOTIFICATION_NOTIFICATION_ENABLED_CHANGED, callback);
};
/**
 * 4.12.4 Notification Configuration.
 * 
 * Get configuration information for the notification service, any later change
 * to the provided information MUST be notified via the callback function.
 * 
 * @return Bundle containing the notification configuration. The fields
 *         available are defined in {@link Defs.NotificationConfiguration}.
 */
mirrorlink.notification.getNotificationConfiguration = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Notification', 'getNotificationConfiguration', []);
    }
};
/**
 * 4.12.5 Notification Configuration Callback.
 * 
 * Notification Configuration information has changed.
 * 
 * @param notificationConfiguration
 *            The UPnP notification service related preference of Client. The
 *            fields available are defined in
 *            {@link Defs.NotificationConfiguration}.
 */
mirrorlink.notification.onNotificationConfigurationChanged = function(notificationConfiguration, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_NOTIFICATION_NOTIFICATION_CONFIGURATION_CHANGED, 'Notification', 'onNotificationConfigurationChanged', [
                notificationConfiguration
            ], err)
            .on(E_ML_NOTIFICATION_NOTIFICATION_CONFIGURATION_CHANGED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * 
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.notification.offNotificationConfigurationChanged = function(callback) {
    cordovaEventManager.off(E_ML_NOTIFICATION_NOTIFICATION_CONFIGURATION_CHANGED, callback);
};
/**
 * 4.12.6 Send Notification for client-based Notification UI.
 * 
 * Send a notification from the application; this notification replaces a
 * previously send notification.
 * 
 * @param title
 *            Title of the notification event
 * @param body
 *            Body of the notification event
 * @param iconUrl
 *            Url to icon belonging to the notification
 * @param actionList
 *            List of actions belonging to the notification
 * 
 * @return The notification identifier; a Zero value will be returned, if the
 *         action was not successful.
 */
mirrorlink.notification.sendClientNotification = function(title, body, iconUrl, actionList, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Notification', 'sendClientNotification', [
            title, body,
            iconUrl,
            actionList
        ]);
    }
};
/**
 * 4.12.7 Send Notification for VNC-based Notification UI.
 * 
 * Send a notification from the application; this notification replaces a
 * previously send notification.
 * 
 * @return The notification identifier; a Zero value will be returned, if the
 *         action was not successful.
 */
mirrorlink.notification.sendVncNotification = function(callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Notification', 'sendVncNotification', []);
    }
};
/**
 * 4.12.8 Cancel Notification.
 * 
 * Cancel a notification from the application.
 * 
 * @param notificationId
 *            Identifier of the notification, which needs to get canceled.
 */
mirrorlink.notification.cancelNotification = function(notificationId, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordova.exec(callback, err, 'Notification', 'cancelNotification', [
            notificationId
        ]);
    }
};
/**
 * 4.12.9 Receive Action Callback.
 * 
 * Receive action from the MirrorLink Client for a notification.
 * 
 * @param notificationId
 *            Identifier of the notification
 * @param actionId
 *            Action identifier
 */
mirrorlink.notification.onNotificationActionReceived = function(notificationId, actionId, callback, err) {
    if (typeof callback === 'function' && typeof err === 'function') {
        cordovaEventManager.createServiceListener(E_ML_NOTIFICATION_NOTIFICATION_ACTION_RECEIVED, 'Notification', 'onNotificationActionReceived', [
                notificationId,
                actionId
            ], err)
            .on(E_ML_NOTIFICATION_NOTIFICATION_ACTION_RECEIVED, callback);
    }
};
/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 *
 * @param {function|undefined}
 *            callback Callback you want to stop to listen to event. If
 *            'callback' is undefined, it removes all the event listeners.
 */
mirrorlink.notification.offNotificationActionReceived = function(callback) {
    cordovaEventManager.off(E_ML_NOTIFICATION_NOTIFICATION_ACTION_RECEIVED, callback);
};
module.exports = mirrorlink;
