// You must generate and insert your own API key for Google Maps + Directions JS SDK.
// The script uses Google Maps to display the scooters on a map as well as the route to the nearest scooter. Follow the guide on the link below to obtain an API key.
// https://developers.google.com/maps/documentation/javascript/get-api-key
let googleApiKey = ""

// Choose the enabled rental companies. Set to true to enable the rental company and false to disable it.
let COMPANIES = {
    bird: true,
    lime: true
}

// Maximum amountof scooters to show on the map.
// Set to 0 or lower to show all scooters.
let SCOOTER_COUNT = 20

// Set to true to ignore stored authentication token to the Lime and promot for login again.
let FORCE_LIME_LOGIN = false

// Set to true to simulate a location near WWDC.
let SIMULATE_LOCATION = false

// Keys used for the keychain.
let KEYS = {
    LIME_TOKEN: "SCOOTER_LIME_TOKEN",
    LIME_COOKIE: "SCOOTER_LIME_COOKIE",
    BIRD_MAIL: "BIRD_MAIL",
    BIRD_DEVICE_ID: "BIRD_DEVICE_ID",
    BIRD_TOKEN: "BIRD_TOKEN"
}

// Get user location.
let myLocation = null
if (SIMULATE_LOCATION) {
    myLocation = { latitude: 37.334790, longitude: -121.888140 }
} else {
    Location.setAccuracyToTenMeters()
    myLocation = await Location.current()
}
let boundingBox = getBoundingBox(myLocation.latitude, myLocation.longitude, 1000)

// Create promises that carry the fetched scooters for each company.
let scooterPromises = []
if (COMPANIES.lime) {
    let credentials = await getLimeCredentials()
    scooterPromises.push(
        getLimeScooters(
            boundingBox,
            myLocation,
            credentials.token,
            credentials.cookie))
}
if (COMPANIES.bird) {
    let token = await getBirdAuthorizationToken()
    scooterPromises.push(getBirdScooters(myLocation, token))
}

// Fetch scooters and sort them by distance.
let scooters = await Promise.all(scooterPromises)
scooters = scooters.reduce((result, element) => {
    return result.concat(element)
})
scooters = sortScootersByDistance(scooters, myLocation)

if (googleApiKey.length == 0) {
    logWarning("You must set a Google API key. Please read the topmost comment in the script for instructions.")
}

if (scooters.length <= 0) {
    let message = "No scooters available right now."
    console.log(message)
    if (config.runsWithSiri) {
        Speech.speak(message)
    }
} else {
    let closestScooter = scooters[0]
    let resultMessage = "The closest scooter is from " + closestScooter.brand
        + " and it is " + Math.round(closestScooter.distance) + "m away."
    console.log(resultMessage)
    if (config.runsWithSiri) {
        Speech.speak(resultMessage)
    }
    let cappedScooters = SCOOTER_COUNT > 0 ? scooters.slice(0, SCOOTER_COUNT) : scooters
    showMap(cappedScooters, myLocation)
}

async function getLimeScooters(boundingBox, userLocation, token, cookie) {
    let url = "https://web-production.lime.bike/api/rider/v1/views/map"
        + "?ne_lat=" + boundingBox.northEastLat
        + "&ne_lng=" + boundingBox.northEastLon
        + "&sw_lat=" + boundingBox.southWestLat
        + "&sw_lng=" + boundingBox.southWestLon
        + "&user_latitude=" + userLocation.latitude
        + "&user_longitude=" + userLocation.longitude
        + "&zoom=16"
    let req = new Request(url)
    req.headers = {
        "Authorization": "Bearer " + token,
        "Cookie": cookie
    }
    let res = await req.loadJSON()
    let scooters = res.data.attributes.bikes
    return scooters.map(s => {
        return {
            lat: s.attributes.latitude,
            lon: s.attributes.longitude,
            brand: "Lime"
        }
    })
}

async function getLimeCredentials() {
    let existingCredentials = readLimeCredentials()
    if (existingCredentials != null && !FORCE_LIME_LOGIN) {
        return existingCredentials
    } else {
        let phoneNumber = await promptForValue(
            "Enter phone number",
            "A one time code will be sent to your phone number.\n\nRemember to include your country code, e.g. +1 or +45.\n\nIt's a good idea to use a secondary phone number as Lime only allows you to be logged in once so logging in using this script will log you out of the Lime app if you use the same phone number.",
            "+1-202-555-0100")
        await sendLimeOTP(phoneNumber)
        let code = await promptForValue(
            "Enter one time code",
            "Enter the one time code you received on " + phoneNumber,
            "123456")
        let credentials = await logIntoLime(phoneNumber, code)
        storeLimeCredentials(credentials.token, credentials.cookie)
        return credentials
    }
}

async function sendLimeOTP(phoneNumber) {
    let url = "https://web-production.lime.bike/api/rider/v1/login"
        + "?phone=" + encodeURIComponent(phoneNumber)
    let req = new Request(url)
    await req.load()
}

async function logIntoLime(phoneNumber, code) {
    let url = "https://web-production.lime.bike/api/rider/v1/login"
    let req = new Request(url)
    req.method = "POST"
    req.headers = {
        "Content-Type": "application/json"
    }
    req.body = JSON.stringify({
        "login_code": code,
        "phone": phoneNumber
    })
    let res = await req.loadJSON()
    return {
        "token": res.token,
        "cookie": req.response.headers["Set-Cookie"]
    }
}

function storeLimeCredentials(token, cookie) {
    Keychain.set(KEYS.LIME_TOKEN, token)
    Keychain.set(KEYS.LIME_COOKIE, cookie)
}

function readLimeCredentials() {
    if (Keychain.contains(KEYS.LIME_TOKEN) && Keychain.contains(KEYS.LIME_COOKIE)) {
        return {
            "token": Keychain.get(KEYS.LIME_TOKEN),
            "cookie": Keychain.get(KEYS.LIME_COOKIE)
        }
    } else {
        return null
    }
}

async function getBirdAuthorizationToken() {
    let token = readBirdAuthorizationToken()
    let mail = getBirdMail()
    let deviceId = getBirdDeviceId()
    let url = "https://api.bird.co/user/login"
    let req = new Request(url)
    req.method = "POST"
    req.headers = {
        "Content-Type": "application/json",
        "Device-id": deviceId,
        "Platform": "ios"
    }
    req.body = JSON.stringify({
        email: mail
    })
    let res = await req.loadJSON()
    if (token == null) {
        storeBirdAuthorizationToken(res.token)
        return res.token
    } else {
// We already have a token so it just got renewed
// and is not in the response.
        return token
    }
}

async function getBirdScooters(location, token) {
    let radius = 1000
    let mail = getBirdMail()
    let deviceId = getBirdDeviceId()
    let url = "https://api.bird.co/bird/nearby"
        + "?latitude=" + location.latitude
        + "&longitude=" + location.longitude
        + "&radius=" + radius
    let req = new Request(url)
    req.headers = {
        "Authorization": "Bird " + token,
        "Device-id": deviceId,
        "Platform": "ios",
        "App-Version": "3.0.5",
        "Location": JSON.stringify({
            latitude: location.latitude,
            longitude: location.longitude,
            altitude: 500,
            accuracy: 100,
            speed: -1,
            heading: -1
        })
    }
    let res = await req.loadJSON()
    return res.birds.map(s => {
        return {
            lat: s.location.latitude,
            lon: s.location.longitude,
            brand: "Bird"
        }
    })
}

function getBirdMail() {
    if (Keychain.contains(KEYS.BIRD_MAIL)) {
        return Keychain.get(KEYS.BIRD_MAIL)
    } else {
        let mail = UUID.string() + "@" + UUID.string() + ".com"
        Keychain.set(KEYS.BIRD_MAIL, mail)
        return mail
    }
}

function storeBirdAuthorizationToken(token) {
    Keychain.set(KEYS.BIRD_TOKEN, token)
}

function readBirdAuthorizationToken() {
    if (Keychain.contains(KEYS.BIRD_TOKEN)) {
        return Keychain.get(KEYS.BIRD_TOKEN)
    } else {
        return null
    }
}

function getBirdDeviceId() {
    if (Keychain.contains(KEYS.BIRD_DEVICE_ID)) {
        return Keychain.get(KEYS.BIRD_DEVICE_ID)
    } else {
        let deviceId = UUID.string()
        Keychain.set(KEYS.BIRD_DEVICE_ID, deviceId)
        return deviceId
    }
}

function sortScootersByDistance(scooters, toLocation) {
    return scooters.map(s => {
        s.distance = 1000 * distance(s.lat, s.lon, toLocation.latitude, toLocation.longitude, 'K')
        return s
    }).sort((a, b) => {
        return a.distance - b.distance
    })
}

function showMap(nearbyScooters, myLocation) {
    let closest = nearbyScooters[0]
    let zoomLevel = 18
    let preserveViewport = !config.runsWithSiri
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <style>
        #map {
            height: 100%;
        }
        html,
        body {
            height: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
<div id="map"></div>
<script>
    var map;

    function initMap() {
        var myLocation = {
            lat: ${myLocation.latitude},
            lng: ${myLocation.longitude}
        }
        var closestLocation = {
            lat: ${closest.lat},
            lng: ${closest.lon}
        }

        map = new google.maps.Map(document.getElementById('map'), {
            center: myLocation,
            zoom: ${zoomLevel},
            disableDefaultUI: true
        });

        var limeIcon = {
            url: "https://is5-ssl.mzstatic.com/image/thumb/Purple113/v4/c9/ad/b2/c9adb29e-8853-e0ec-6165-c2556508564b/source/512x512bb.jpg",
            scaledSize: new google.maps.Size(30, 30)
        };
        var birdIcon = {
            url: "https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/ef/73/ef/ef73efe9-8d29-3013-8ed6-33591e1a1b48/source/512x512bb.jpg",
            scaledSize: new google.maps.Size(30, 30)
        };
        var iconForBrand = {
            "Lime": limeIcon,
            "Bird": birdIcon
        };

        new google.maps.Marker({
            map: map,
            position: myLocation,
            icon: 'http://maps.google.com/mapfiles/ms/micons/blue.png'
        });

        var nearbyScooters = ${JSON.stringify(nearbyScooters)}
            nearbyScooters.forEach(s => new google.maps.Marker({
                map: map,
                position: {
                    lat: s.lat,
                    lng: s.lon
                },
                icon: iconForBrand[s.brand]
            }))

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            preserveViewport: ${preserveViewport}
        });
        directionsDisplay.setMap(map);
        directionsService.route({
            origin: myLocation,
            destination: closestLocation,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            }
        });
    }
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap" async defer></script>
</body>
</html>
`

    let fm = FileManager.iCloud()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, 'scriptable_closest_scooter_map.html')
    fm.writeString(path, html)
    WebView.loadFile(path, new Size(400, 400))
}

// https://gist.github.com/olegam/901654d0a85f495c53647f1b1bfadc0f
function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0
    } else {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1)
            * Math.sin(radlat2)
            + Math.cos(radlat1)
            * Math.cos(radlat2)
            * Math.cos(radtheta)
        if (dist > 1) {
            dist = 1
        }
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        if (unit=="K") {
            dist = dist * 1.609344
        }
        if (unit=="N") {
            dist = dist * 0.8684
        }
        return dist
    }
}

async function promptForValue(title, message, placeholder, value) {
    let alert = new Alert()
    alert.title = title
    alert.message = message
    alert.addTextField(placeholder, value)
    alert.addAction("OK")
    alert.addCancelAction("Cancel")
    let idx = await alert.present()
    if (idx != -1) {
        return alert.textFieldValue(0)
    } else {
        throw new Error("Cancelled entering value")
    }
}

// https://stackoverflow.com/questions/33232008/javascript-calcualate-the-geo-coordinate-points-of-four-corners-around-a-cente
function getBoundingBox(pLatitude, pLongitude, pDistanceInMeters) {
    var latRadian = degreesToRadians(pLatitude)
    var degLatKm = 110.574235
    var degLongKm = 110.572833 * Math.cos(latRadian)
    var deltaLat = pDistanceInMeters / 1000.0 / degLatKm
    var deltaLong = pDistanceInMeters / 1000.0 / degLongKm

    var topLat = pLatitude + deltaLat
    var bottomLat = pLatitude - deltaLat
    var leftLng = pLongitude - deltaLong
    var rightLng = pLongitude + deltaLong

    return {
        northEastLat: topLat,
        northEastLon: rightLng,
        southWestLat: bottomLat,
        southWestLon: leftLng,
        minLat: Math.min(topLat, bottomLat),
        maxLat: Math.max(topLat, bottomLat),
        minLon: Math.min(leftLng, rightLng),
        maxLon: Math.max(leftLng, rightLng)
    }
}

function degreesToRadians(deg) {
    return deg * Math.PI / 180
}