import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

declare const mapboxgl:any;

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  instructionSteps = null;
  httpOptions = {
    headers: new HttpHeaders({
      Accept:  'application/json',
    })
  };
  constructor(private http: HttpClient) { }

  async getCoordinates(address: String) {
    // eslint-disable-next-line max-len
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?country=KE&access_token=${environment.mapPublicKey}`;
    mapboxgl.accessToken = environment.mapPublicKey;

    const query = await fetch(
      // eslint-disable-next-line max-len
      url,
      { method: 'GET' }
    );
    const json = await query.json();

    const coordinates = json.features[0].center;
    return coordinates;


  }

  async getRoute(start:any, end:any) {
    const query = await fetch(
      // eslint-disable-next-line max-len
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    // console.log('🚀 ~ file: mapbox.service.ts ~ line 45 ~ MapboxService ~ getRoute ~ json', json.routes[0].distance/1000);

    return {
      duration: json.routes[0].duration / 3600,
      distance: json.routes[0].distance / 1000,
    };
  }


  async getInstructions(map:any, start:any, end:any) {

    // make a directions request using driving profile
    // an arbitrary start will always be the same
    if (end.length > 0 && start.length > 0) {

      // only the end or destination will change
      const query = await fetch(
        // eslint-disable-next-line max-len
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }

      // this.instructionSteps = data;
      return data;
    }

    // this.instuctions(data);
  }
}
