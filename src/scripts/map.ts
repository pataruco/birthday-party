const avalon: google.maps.LatLngLiteral = {
  lat: 51.450616,
  lng: -0.1480473,
};
const mapElement = document.getElementById('js-map') as HTMLDivElement;
const pinPath =
  'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z';

const red = '#FF0000';
const green = '#00ff00';

const SVG_NS = 'http://www.w3.org/2000/svg';

const buildMarkerContent = (color: string, label: string): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '55');
  svg.setAttribute('height', '75');
  svg.setAttribute('viewBox', '-27.5 -75 55 75');

  const pin = document.createElementNS(SVG_NS, 'path');
  pin.setAttribute('d', pinPath);
  pin.setAttribute('fill', color);
  pin.setAttribute('transform', 'scale(1.25)');
  svg.appendChild(pin);

  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('x', '0');
  text.setAttribute('y', '-32');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('fill', '#000');
  text.setAttribute('font-size', '24');
  text.setAttribute('font-family', 'Permanent Marker');
  text.textContent = label;
  svg.appendChild(text);

  return svg;
};

const renderMarker = (
  position: google.maps.marker.AdvancedMarkerElementOptions['position'],
  color: string,
  map: google.maps.Map,
  label: string,
): google.maps.marker.AdvancedMarkerElement =>
  new google.maps.marker.AdvancedMarkerElement({
    position,
    map,
    content: buildMarkerContent(color, label),
    zIndex: 1000,
  });

const fallbackOrigin: google.maps.LatLngLiteral = {
  lat: 51.5074,
  lng: -0.1278,
};

const getUserCoordinates = (): Promise<google.maps.LatLngLiteral> =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      reject,
      { timeout: 5000 },
    );
  });

const renderDirections = async (
  from: google.maps.LatLngLiteral,
  map: google.maps.Map,
): Promise<void> => {
  const { Route } = (await google.maps.importLibrary(
    'routes',
  )) as google.maps.RoutesLibrary;

  const { routes } = await Route.computeRoutes({
    origin: from,
    destination: avalon,
    travelMode: 'DRIVING',
    fields: ['legs', 'path'],
  });

  if (!routes || routes.length === 0) return;
  const [route] = routes;

  route.createPolylines({
    polylineOptions: {
      strokeColor: '#ff00bc',
      strokeWeight: 15,
      map,
    },
  });

  const [leg] = route.legs ?? [];
  if (!leg) return;
  if (leg.startLocation) {
    renderMarker(leg.startLocation, red, map, 'You');
  }
  if (leg.endLocation) {
    renderMarker(leg.endLocation, green, map, 'Party 🎉');
  }
};

const renderMap = async () => {
  await google.maps.importLibrary('marker');

  const map = new google.maps.Map(mapElement, {
    center: avalon,
    zoom: 15,
    mapId: 'DEMO_MAP_ID',
  });

  let from: google.maps.LatLngLiteral;
  try {
    from = await getUserCoordinates();
  } catch (error) {
    console.warn('[map] geolocation failed, using fallback origin', error);
    from = fallbackOrigin;
  }

  try {
    await renderDirections(from, map);
  } catch (error) {
    console.error('[map] renderDirections failed', error);
  }
};

window.addEventListener('load', renderMap);
