declare module '@svg-country-maps/canada' {
  interface Location {
    name: string;
    id: string;
    path: string;
  }

  interface CanadaMapData {
    label: string;
    viewBox: string;
    locations: Location[];
  }

  const data: CanadaMapData;
  export default data;
}
