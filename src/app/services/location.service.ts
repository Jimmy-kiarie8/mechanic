import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import { Observable } from 'rxjs';
import { OrderService } from './order.service';
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private orderService: OrderService) { }


  async startTracking() {
    // Define your configuration object
    const config = {
      // For example, set desired accuracy and distance filter
      desiredAccuracy: 10,
      distanceFilter: 10,
      // You can add more configuration options as needed
    };

    // // Start tracking
    await BackgroundGeolocation.addWatcher({
      backgroundMessage: "Cancel to prevent battery drain.",
      backgroundTitle: "Tracking You.",
      requestPermissions: true,
      stale: false,
      distanceFilter: 50
    }, function callback(location, error) {
      console.log("🚀 ~ LocationService ~ startTracking ~ error:", error)
      if (error) {
        if (error.code === "NOT_AUTHORIZED") {
          if (window.confirm("This app needs your location, but does not have permission.\n\nOpen settings now?")) {
            BackgroundGeolocation.openSettings();
          }
        }
        return console.error(error);
      }

      console.log(location);



      // Send location to your API
      fetch('https://3ecd-41-90-189-105.ngrok-free.app/api/mobile/map-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
      })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));


    }).then(function after_the_watcher_has_been_added(watcher_id) {
      console.log("🚀 ~ LocationService ~ startTracking ~ watcher_id:", watcher_id)
      // Use watcher_id to remove the watcher later if needed
    });

  }

  async stopTracking() {
    // Stop the background geolocation
    // await BackgroundGeolocation.stop();


    // BackgroundGeolocation.removeWatcher({
    //   id: watcher_id
    // });

  }

}
