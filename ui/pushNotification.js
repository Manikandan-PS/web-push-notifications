var vapidPublicKey =urlBase64ToUint8Array("BFuvdVnXTI6-sA7VR6waS08FaHrxGB9CQOKbnIyinbWLljxciHfHn1V9D7WiJ1K9mKN1bRi5_PBMFWJu2TfxVeE");

if (!("Notification" in window)) {
  alert("This browser does not support desktop notification. This Demo has failed :( ");
  document.getElementById("welcomemsg").innerHTML = "This browser does not support desktop notification. This Demo has failed :( ";
}
else {
    if(Notification.permission==='default' ||Notification.permission ==='denied'){
        Notification.requestPermission((status)=> {
            console.log('Notification Permissiong status:',status);
        });
        if (Notification.permission === 'denied' )
        { 
            document.getElementById("welcomemsg").innerHTML = "You've denied notification on a notifcation DEMO! I'm sad!";
        } 
        if (navigator.serviceWorker) { 
            navigator.serviceWorker.register('/serviceworker.js')
            .then(function(registration) {
                const subscribeOptions = {
                    userVisibleOnly: true,
                    applicationServerKey:vapidPublicKey
                };                 
                return registration.pushManager.subscribe(subscribeOptions);
            }).then(function(pushSubscription) {
                PostSubscriptionDetails(pushSubscription);
            });
        } 
    
    }
    
}

function PostSubscriptionDetails(Subscription) {
    var sub = JSON.parse(JSON.stringify(Subscription));
    var token = sub.keys.p256dh;
    var auth = sub.keys.auth;
    var fields = {endpoint:sub.endpoint,token:token,auth:auth};
    fetch('/subscribe', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(fields)
    }).then(function(data) {
        console.log("returned from server:");
	    console.log(data);
        document.getElementById("welcomemsg").innerHTML = "READY for Notifications!";
    });  
}


function sendNotification(){
    fetch('/sendNotification', {
        method: 'GET',
        headers: new Headers({'Content-Type': 'application/json'}),
    }).then(function(data) {
        console.log("returned from server:");
	    console.log(data);
        document.getElementById("welcomemsg").innerHTML = "READY for Notifications!";
    });  
}
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
  ;
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
