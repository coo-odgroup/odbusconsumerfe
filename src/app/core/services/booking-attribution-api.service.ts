
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AttributionService } from './attribution.service';
import { GlobalConstants } from 'src/app/constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class BookingAttributionApiService {
    baseurl = GlobalConstants.BASE_URL;

  // Replace this with your actual Laravel API endpoint.
  private readonly apiUrl = `${this.baseurl}/save-attribution`;

  constructor(
    private http: HttpClient,
    private attributionService: AttributionService
  ) {}

  saveAttribution(
    bookingId: number | string
  ): Observable<any> {

    const attribution =
      this.attributionService.getAttribution();

    const payload = {
      booking_id: bookingId,
      attribution: attribution
    };

    console.log('Payload to be sent to Laravel API:', payload);

    return this.http.post<any>(
      this.apiUrl,
      payload
    );
  }
}
