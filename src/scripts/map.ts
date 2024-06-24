const avalon = new google.maps.LatLng({ lat: 51.450616, lng: -0.1480473 });
const mapElement = document.getElementById('js-map') as HTMLDivElement;
const path =
  'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z';

const red = '#FF0000';
const green = '#00ff00';

const customIcon: google.maps.Symbol = {
  path,
  fillOpacity: 1,
  anchor: new google.maps.Point(0, 0),
  strokeWeight: 0,
  scale: 1.25,
};

const startIcon: google.maps.Symbol = { ...customIcon, fillColor: red };
const endIcon: google.maps.Symbol = { ...customIcon, fillColor: green };

const renderMarker = (
  position: google.maps.LatLng,
  icon: google.maps.Symbol,
  map: google.maps.Map,
  label: string,
): google.maps.Marker =>
  new google.maps.Marker({
    position,
    map,
    icon,
    zIndex: 1000,
    label: {
      color: '#000',
      fontSize: '24px',
      text: label,
      fontFamily: 'Permanent Marker',
    },
  });

const getUserCoordinates = async (): Promise<google.maps.LatLng> => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { coords } = position;
      const { latitude, longitude } = coords;
      resolve(new google.maps.LatLng(latitude, longitude));
    });
  });
};

const getPositionFromLeg = (position: google.maps.LatLng) => ({
  lat: position.lat(),
  lng: position.lng(),
});

const renderRoute = (
  map: google.maps.Map,
  leg: google.maps.DirectionsLeg,
): void => {
  // const startLocation = getPositionFromLeg(leg.start_location);
  // const endLocation = getPositionFromLeg(leg.end_location);
  renderMarker(leg.start_location, startIcon, map, 'You');
  renderMarker(leg.end_location, endIcon, map, 'Party 🎉');
};

const renderDirections = (
  from: google.maps.LatLng,
  map: google.maps.Map,
): void => {
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#ff00bc',
      strokeWeight: 15,
    },
  });
  directionsDisplay.setMap(map);

  directionsService.route(
    {
      origin: from,
      destination: avalon,
      // @ts-ignore
      travelMode: 'DRIVING',
    },
    (result: google.maps.DirectionsResult, status: string) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(result);
        const [leg] = result.routes[0].legs;
        renderRoute(map, leg);
      }
    },
  );
};

const renderMap = async () => {
  const map = new google.maps.Map(mapElement, {
    center: avalon,
    zoom: 15,
  });

  let from: google.maps.LatLng;

  try {
    from = await getUserCoordinates();
  } catch (error) {
    console.error(error);
  }

  if (from) {
    renderDirections(from, map);
  }
};

window.addEventListener('load', renderMap);
