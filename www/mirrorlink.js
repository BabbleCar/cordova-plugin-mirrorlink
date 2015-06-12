// Events
var E_ML_AVAILABLE = 'mirrorlink_available',
    // CERTIFICATION EVENTS    
    E_ML_CERTIFICATION_STATUS_CHANGE = 'mirrorlink_certification_status_changed',
    // CONNECTION EVENTS
    E_ML_CONNECTION_AUDIO_CHANGE = 'mirrorlink_connection_audio_changed',
    E_ML_CONNECTION_REMOTE_DISPLAY_CHANGE = 'mirrorlink_connection_remote_display_changed',
    E_ML_CONNECTION_SESSION_CHANGE = 'mirrorlink_connection_session_changed',
    // CONTEXT EVENTS
    
    // ERRORS
    E_ML_ERR_SERVICE_CONNECTION_FAILED = 'mirrorlink_error_service_connection_failed';

// Event manager.
var cordovaEventManager = {
    callbacks_stacks:{},
    on: function( event, callback ){
        if( !this.callbacks_stacks[event] ){
            this.callbacks_stacks[event] = [callback];
        }
        else{
            this.callbacks_stacks[event].push(callback);
        }
        return this;
    },
    off: function( event, callback){
        if( !callback && this.callbacks_stacks[event] ){
            this.callbacks_stacks[event].length = 0;
        }
        else if( this.callbacks_stacks[event] && callback ){
            var i = this.callbacks_stacks[event].indexOf(callback);
            if( i !== -1 ){
                this.callbacks_stacks[event].splice(i,1);
            }
        }
        return this;
    },
    emit: function( event, datas){
        if( this.callbacks_stacks[event] ){
            this.callbacks_stacks[event].forEach(function(callback){
                callback( datas );
            });
        }
        return this;
    },
    service_listeners:{},
    createServiceListener: function( event, cordovaService, cordovaAction, cordovaParams, onError){
        if( !this.service_listeners[event] || force ){
            this.service_listeners[event] = function( datas ){
                cordovaEventManager.emit(event, datas);
            };
            cordova.exec(this.service_listeners[event], onError, cordovaService, cordovaAction, cordovaParams||[]);
        }
        return this;
    }
};

var mirrorlink = {
    certification:{},
    context:{},
    dataservices:{},
    deviceinfo:{},
    devicestatus:{},
    display:{},
    eventmapping:{},
    notification:{}
};

/**
 * Mirrorlink plugin status 
 * {boolean} true if mirrorlink plugin is connected to mirrorlink android service.
 */ 
mirrorlink.is_available = false;

/**
 * Enable mirrorlink plugin ( connect your app to mirrorlink android service )
 * @param {function} callback Callback executed when mirrorlink plugin connect to mirrorlink android service.
 * @param {function} err Callback executed when mirrorlink plugin failed to connect.
 */
mirrorlink.enable = function( callback, err){
    if( typeof callback === 'function' ){
        if( mirrorlink.is_available ){
            return callback();
        }
        cordova.exec(function(){ mirrolink.is_available=true; callback();}, err||function(){}, 'Api', 'connect');
    }
};

//-------- CERTIFICATION SERVICE -----------//
/** 
 * Listen when then application certification status change.
 * The application would receive this callback if, for example, the certification 
 * status changes when the certificate is revoked.
 * @param {function} callback Function to execute when certification status changes.
 * @param {function} err Function executed if service failed to bind listener to event.
 */
mirrorlink.certification.onStatusChanged = function( callback, err ){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordovaEventManager
            .createServiceListener(E_ML_CERTIFICATION_STATUS_CHANGE,'Certification','onCertificationStatusChanged',err)
            .on(E_ML_CERTIFICATION_STATUS_CHANGE, callback);
    }
};

/**
 * Remove listeners from "mirrorlink_certification_status_changed" event.
 * @param {function|undefined} callback Callback you want to stop to listen to event. If 'callback'
 * is undefined, it removes all the event listeners. 
 */
mirrorlink.certification.offStatusChanged = function( callback ){
    cordovaEventManager.off(E_ML_CERTIFICATION_STATUS_CHANGE, callback);
};

/**
 * Get Application Certification Information.
 * @param  {string} entity Name of the certifying entity
 * @param {function} callback Function executed with application certification 
 * information bundle {entity:string,certified:boolean,restricted:string,nonrestricted:string}
 * or null if the application isn't certified or the entity is not part of the 
 * list of certifying entities for the application. 
 * @param {function} err Executed if service failed to get information.
 */
mirrolink.certification.getInformation = function( entity, callback, err){
    if( typeof callback === 'function' && typeof err === 'function' && typeof entity === 'string' ){
        cordova.exec(callback, err, 'Certification', 'getApplicationCertificationInformation', [entity]);
    }
};

/**
 * Get Application Certifying Entities.
 * @param {function} callback Function executed with comma-separated list of 
 * certifying entities, which certified the application,
 * @param {function} err Executed if service failed to get certifying entities.
 */
mirrorlink.certification.getEntities = function( callback, err){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordova.exec(callback, err||function(){}, 'Certification', 'getApplicationCertifyingEntities', []);
    }
};

/**
 * Get Application Certification Status.
 * @param {function} callback Function executed with a 
 * bundle: {has_valid_certificate:boolean,advertised_as_certifiedapp:boolean}
 * @param {function} err Executed if service failed to get certifying entities.
 */ 
mirrorlink.certification.getStatus = function( callback, err){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordova.exec(callback, err, 'Certification', 'getApplicationCertificationStatus', []);
    }
};

/**
 * Stop using mirrorlink certification manager.
 * The application will not receive any more callbacks from certification manager;
 * Listeners are keeped in memory.
 * /!\ To reactivate the manager,  call any method of the manager.
 * @param {function} callback Executed when manager successfully disabled.
 * @param {function} err Executed if mirrorlink failed to disabled certification manager.
 */
mirrorlink.certification.disable = function(callback, err){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordova.exec(callback, err, 'Certification', 'unregister', []);
    }
};

//-------- CONNECTION SERVICE -----------//

/** 
 * Listen when the audio connections changed.
 * @param {function} callback Function to execute when audio connection changes with audioConnections Bundle.
 * @param {function} err Function executed if service failed to bind listener to event.
 */
mirrorlink.connection.onAudioChanged = function( callback, err ){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordovaEventManager
            .createServiceListener(E_ML_CONNECTION_AUDIO_CHANGE,'Connection','onAudioConnectionsChanged',err)
            .on(E_ML_CONNECTION_AUDIO_CHANGE, callback);
    }
};
/**
 * Listen when the remote display connections changed.
 * @param {function} callback Function to execute when audio connection changes 
 * with remoteDisplayConnection integer (see {@link Defs.RemoteDisplayConnection}).
 * @param {function} err Function executed if service failed to bind listener to event.
*/
mirrorlink.connection.onRemoteDisplayChanged = function( callback, err ){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordovaEventManager
            .createServiceListener(E_ML_CONNECTION_REMOTE_DISPLAY_CHANGE,'Connection','onRemoteDisplayConnectionChanged',err)
            .on(E_ML_CONNECTION_REMOTE_DISPLAY_CHANGE, callback);
    }
};

/**
 * Get established audio connections within mirrorlink session.
 * @param {function} callback Executed with a bundle containing the status of 
 * the audio connections available (see {@link Defs.AudioConnections}).
 * @param {function} err Executed if it failed to get audio connections.
 */
mirrorlink.connection.getAudio = function( callback, err){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordova.exec(callback, err, 'Connection', 'getAudioConnections', []);
    }
};

/**
 * Get established remote display connections within mirrorlink session.
 * @param {function} callback Executed with value containing the status of the remote 
 * display connections available (see {@link Defs.RemoteDisplayConnection}).
 * @param {function} err Executed if it failed to get audio connections.
 */
mirrorlink.connection.getRemoteDisplay = function( callback, err){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordova.exec(callback, err, 'Connection', 'getRemoteDisplayConnections', []);
    }
};

/**
 * Indicates whether a MirrorLink session is currently established.
 * A MirrorLink is considered established if a ClientProfile has been
 * set on the MirrorLink Server for the current tethering session.
 * 
 * /!\ The application MUST use this call and its event 
 * listener 'mirrorlink.connection.onSessionChanged' to determine whether a
 * MirrorLink session is established. MirrorLink applications SHOULD use
 * other Common API modules only while a MirrorLink Session is running.
 * MirrorLink Servers MUST have the Common API modules available at all
 * times.
 * 
 * @param {function} callback Executed with boolean.
 * @param {function} err Executed if it failed to get session status.
 */
mirrorlink.connection.isSessionEstablished = function( callback, err){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordova.exec(callback, err, 'Connection', 'isMirrorLinkSessionEstablished', []);
    }
};

/**
 * Listen when the mirrorLink session status has changed.
 * 
 * /!\ The application MUST use this listener and its equivalent 
 * getter 'mirrorlink.connection.isSessionEstablished' to determine whether a
 * MirrorLink session is established. MirrorLink applications SHOULD use
 * other Common API modules only while a MirrorLink Session is running.
 * MirrorLink Servers MUST have the Common API modules available at all
 * times.
 * 
 * @param {function} callback Function executed with mirrorlink session status 
 * when session status changed.
 * @param {function} err Function executed if service failed to bind listener to event.
*/
mirrorlink.connection.onSessionChanged = function( callback, err ){
    if( typeof callback === 'function' && typeof err === 'function'){
        cordovaEventManager
            .createServiceListener(E_ML_CONNECTION_SESSION_CHANGE,'Connection','onMirrorLinkSessionChanged',err)
            .on(E_ML_CONNECTION_SESSION_CHANGE, callback);
    }
};

/**
 * Stop using mirrorlink connection manager.
 * The application will not receive any more callbacks from connection manager;
 * Listeners are keeped in memory.
 * /!\ To reactivate the manager,  call any method of the manager.
 * @param {function} callback . Executed when manager successfully disabled.
 * @param {function} err . Executed if mirrorlink failed to disabled connection manager.
 */
mirrorlink.certification.disable = function(callback, err){
    if( typeof callback === 'function' && typeof err === 'function' ){
        cordova.exec(callback, err, 'Connection', 'unregister', []);
    }
};



module.exports = mirrolink;




