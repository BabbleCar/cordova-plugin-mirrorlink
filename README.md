# cordova-plugin-mirrorlink

Plugin cordova for MirrorLink Technology 

Version stable.

## Revision Common Api

  - Revision: 13

## Installation

This requires cordova 5.0+
Install via repo url directly

    ccordova plugins add https://github.com/BabbleCar/cordova-plugin-mirrorlink.git

## Supported Platforms

- Android


## Documentation


### Certification


**4.4 onCertificationStatusChanged**

>Listen when then application certification status change. The application
>would receive this callback if, for example, the certification status changes
>when the certificate is revoked.

>@param {function} callback Function to execute when certification status changes.
>@param {function} err Function executed if service failed to bind listener to event.

```javascript
    window.cordova.plugins.MirrorLink.certification.onCertificationStatusChanged(callback, err);
    window.cordova.plugins.MirrorLink.certification.offCertificationStatusChanged(callback);
```

**4.3.1  getApplicationCertificationStatus**

>Get Application Certification Status.

>@param {function} callback Function executed with a bundle: >{"HAS_VALID_CERTIFICATE":boolean,"ADVERTISED_AS_CERTIFIEDAPP":boolean}
>@param {function} err Executed if service failed to get certifying entities.

```javascript
    window.cordova.plugins.MirrorLink.certification.getApplicationCertificationStatus(callback, err);
```

**4.3.2  getApplicationCertifyingEntities**

>Get Application Certifying Entities.

>@param {function} callback Function executed with comma-separated list of certifying entities, which certified the >application,
>@param {function} err Executed if service failed to get certifying entities.

```javascript
    window.cordova.plugins.MirrorLink.certification.getApplicationCertifyingEntities(callback, err);
```

**4.3.3  getApplicationCertificationInformation**


>Get Application Certification Information.

>@param {string} entity Name of the certifying entity

>@param {function} callback Function executed with application certification information bundle
>{entity:string,certified:boolean,restricted:string,nonrestricted:string} or
>null if the application isn't certified or the entity is not part of the list of certifying entities for the >application.

>@param {function} err Executed if service failed to get information.

```javascript
    window.cordova.plugins.MirrorLink.certification.getApplicationCertificationInformation(entity, callback, err);
```


### Connection


**4.4.1  isMirrorLinkSessionEstablished**

```javascript
    window.cordova.plugins.MirrorLink.connection.isMirrorLinkSessionEstablished(callback, err);
```

**4.4.2 onMirrorLinkSessionChanged**

```javascript
    window.cordova.plugins.MirrorLink.connection.onMirrorLinkSessionChanged(callback, err);
    window.cordova.plugins.MirrorLink.connection.offMirrorLinkSessionChanged(callback);
```

**4.4.3  getAudioConnections**

```javascript
    window.cordova.plugins.MirrorLink.connection.getAudioConnections(callback, err);
```

**4.4.4 onAudioConnectionsChanged**

```javascript
    window.cordova.plugins.MirrorLink.connection.onAudioConnectionsChanged(callback, err);
    window.cordova.plugins.MirrorLink.connection.offAudioConnectionsChanged(callback);
```

**4.4.5  getAudioConnections**

```javascript
    window.cordova.plugins.MirrorLink.connection.getRemoteDisplayConnections(callback, err);
```

**4.4.6 onRemoteDisplayConnectionChanged**

```javascript
    window.cordova.plugins.MirrorLink.connection.onRemoteDisplayConnectionChanged(callback, err);
    window.cordova.plugins.MirrorLink.connection.offRemoteDisplayConnectionChanged(callback);
```


### Context


**4.9.1 setFramebufferContextInformation**

```javascript
    window.cordova.plugins.MirrorLink.context.setFramebufferContextInformation(content, handleBlocking, callback, err);
```

**4.9.2 onFramebufferBlocked**

```javascript
    window.cordova.plugins.MirrorLink.context.onFramebufferBlocked(callback, err);
    window.cordova.plugins.MirrorLink.context.offFramebufferBlocked(callback);
```

**4.9.3 setAudioContextInformation**

```javascript
    window.cordova.plugins.MirrorLink.context.setAudioContextInformation(audioContent, audioCategories, handleBlocking, callback, err);
```

**4.9.4 onAudioBlocked**

```javascript
    window.cordova.plugins.MirrorLink.context.onAudioBlocked(callback, err);
    window.cordova.plugins.MirrorLink.context.offAudioBlocked(callback);
```

**4.9.5 onFramebufferUnblocked**

```javascript
    window.cordova.plugins.MirrorLink.context.onAudioBlocked(callback, err);
    window.cordova.plugins.MirrorLink.context.offAudioBlocked(callback);
```

**4.9.6 onAudioUnblocked**

```javascript
    window.cordova.plugins.MirrorLink.context.onAudioUnblocked(callback, err);
    window.cordova.plugins.MirrorLink.context.offAudioUnblocked(callback);
```


### Data Services


**4.11.1 getAvailableServices**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.getAvailableServices(callback, err);
```

**4.11.2 onAvailableServicesChanged**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.onAvailableServicesChanged(callback, err);
    window.cordova.plugins.MirrorLink.dataservices.offAvailableServicesChanged(callback);
```

**4.11.3 registerToService**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.registerToService(serviceId, versionMajor, versionMinor, callback, err);
```

**4.11.4 onRegisterForService**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.onRegisterForService(callback, err);
    window.cordova.plugins.MirrorLink.dataservices.offRegisterForService(callback);
```

**4.11.5 unregisterFromService**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.unregisterFromService(serviceId, callback, err);
```

**4.11.6 subscribeObject**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.subscribeObject(serviceId, objectId, callback, err);
```

**4.11.7 onSubscribeResponse**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.onSubscribeResponse(callback, err);
    window.cordova.plugins.MirrorLink.dataservices.offSubscribeResponse(callback);
```

**4.11.8 unsubscribeObject**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.unsubscribeObject(serviceId, objectId, callback, err);
```

**4.11.9 setObject**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.setObject(serviceId, objectId, object, callback, err);
```

**4.11.10 onSetDataObjectResponse**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.onSetDataObjectResponse(callback, err);
    window.cordova.plugins.MirrorLink.dataservices.offSetDataObjectResponse(callback);
```

**4.11.11 getObject**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.getObject(serviceId, objectId, callback, err);
```

**4.11.12 onGetDataObjectResponse**

```javascript
    window.cordova.plugins.MirrorLink.dataservices.onGetDataObjectResponse(callback, err);
    window.cordova.plugins.MirrorLink.dataservices.offGetDataObjectResponse(callback);
```


### Device Info


**4.2.1 getMirrorLinkSessionVersionMajor**

```javascript
    window.cordova.plugins.MirrorLink.deviceinfo.getMirrorLinkSessionVersionMajor(callback, err);
```

**4.2.1 getMirrorLinkSessionVersionMinor**

```javascript
    window.cordova.plugins.MirrorLink.deviceinfo.getMirrorLinkSessionVersionMinor(callback, err);
```

**4.2.2 getMirrorLinkClientInformation**

```javascript
    window.cordova.plugins.MirrorLink.deviceinfo.getMirrorLinkSessionVersionMinor(callback, err);
```

**4.2.4 onDeviceInfoChanged**

```javascript
    window.cordova.plugins.MirrorLink.deviceinfo.onDeviceInfoChanged(callback, err);
    window.cordova.plugins.MirrorLink.deviceinfo.offDeviceInfoChanged(callback);
```

**4.2.5 getServerVirtualKeyboardSupport**

```javascript
    window.cordova.plugins.MirrorLink.deviceinfo.getServerVirtualKeyboardSupport(callback, err);
```


### Device Status


**4.10.1 isInDriveMode**

```javascript
    window.cordova.plugins.MirrorLink.devicestatus.isInDriveMode(callback, err);
```

**4.10.2 onDriveModeChange**

```javascript
    window.cordova.plugins.MirrorLink.devicestatus.onDriveModeChange(callback, err);
    window.cordova.plugins.MirrorLink.devicestatus.offDriveModeChange(callback);
```

**4.10.3 isInDriveMode**

```javascript
    window.cordova.plugins.MirrorLink.devicestatus.isInNightMode(callback, err);
```

**4.10.4 onNightModeChanged**

```javascript
    window.cordova.plugins.MirrorLink.devicestatus.onNightModeChanged(callback, err);
    window.cordova.plugins.MirrorLink.devicestatus.offNightModeChanged(callback);
```

**4.10.5 isMicrophoneOn**

```javascript
    window.cordova.plugins.MirrorLink.devicestatus.isMicrophoneOn(callback, err);
```

**4.10.6 onMicrophoneStatusChanged**

```javascript
    window.cordova.plugins.MirrorLink.devicestatus.onMicrophoneStatusChanged(callback, err);
    window.cordova.plugins.MirrorLink.devicestatus.offMicrophoneStatusChanged(callback);
```

**4.10.7 setMicrophoneOpen**

```javascript
    window.cordova.plugins.MirrorLink.devicestatus.setMicrophoneOpen(micInput, voiceInput, callback, err);
```


### Display


**4.5.1 getDisplayConfiguration**

```javascript
    window.cordova.plugins.MirrorLink.display.getDisplayConfiguration(callback, err);
```

**4.5.2 onMicrophoneStatusChanged**

```javascript
    window.cordova.plugins.MirrorLink.display.onDisplayConfigurationChanged(callback, err);
    window.cordova.plugins.MirrorLink.display.offDisplayConfigurationChanged(callback);
```

**4.5.3 getClientPixelFormat**

```javascript
    window.cordova.plugins.MirrorLink.display.getClientPixelFormat(callback, err);
```

**4.5.4 onPixelFormatChanged**

```javascript
    window.cordova.plugins.MirrorLink.display.onPixelFormatChanged(callback, err);
    window.cordova.plugins.MirrorLink.display.offPixelFormatChanged(callback);
```


### Event Mapping


**4.6.1 getEventConfiguration**

```javascript
    window.cordova.plugins.MirrorLink.eventmapping.getEventConfiguration(callback, err);
```

**4.6.2 onEventConfigurationChanged**

```javascript
    window.cordova.plugins.MirrorLink.eventmapping.onEventConfigurationChanged(callback, err);
    window.cordova.plugins.MirrorLink.eventmapping.offEventConfigurationChanged(callback);
```

**4.6.3 getEventMappings**

```javascript
    window.cordova.plugins.MirrorLink.eventmapping.getEventMappings(callback, err);
```

**4.6.4 onEventMappingChanged**

```javascript
    window.cordova.plugins.MirrorLink.eventmapping.onEventMappingChanged(callback, err);
    window.cordova.plugins.MirrorLink.eventmapping.offEventMappingChanged(callback);
```


### Notification


**4.12.1 setNotificationSupported**

```javascript
    window.cordova.plugins.MirrorLink.notification.setNotificationSupported(notificationSupported, callback, err);
```


**4.12.2 getNotificationEnabled**

```javascript
    window.cordova.plugins.MirrorLink.notification.getNotificationEnabled(callback, err);
```

**4.12.3 onNotificationEnabledChanged**

```javascript
    window.cordova.plugins.MirrorLink.notification.onNotificationEnabledChanged(callback, err);
    window.cordova.plugins.MirrorLink.notification.offNotificationEnabledChanged(callback);
```

**4.12.4 getNotificationConfiguration**

```javascript
    window.cordova.plugins.MirrorLink.notification.getNotificationConfiguration(callback, err);
```

**4.12.5 onNotificationConfigurationChanged**

```javascript
    window.cordova.plugins.MirrorLink.notification.onNotificationConfigurationChanged(callback, err);
    window.cordova.plugins.MirrorLink.notification.offNotificationConfigurationChanged(callback);
```

**4.12.6 getNotificationConfiguration**

```javascript
    window.cordova.plugins.MirrorLink.notification..sendClientNotification(title, body, iconUrl, actionList, callback, err);
```

**4.12.7 sendVncNotification**

```javascript
    window.cordova.plugins.MirrorLink.notification.sendVncNotification(callback, err);
```

**4.12.8 cancelNotification**

```javascript
    window.cordova.plugins.MirrorLink.notification.cancelNotification(notificationId, callback, err);
```

**4.12.9  onNotificationActionReceived**

```javascript
    window.cordova.plugins.MirrorLink.notification.onNotificationActionReceived(callback, err);
    window.cordova.plugins.MirrorLink.notification.offNotificationActionReceived(callback);
```

