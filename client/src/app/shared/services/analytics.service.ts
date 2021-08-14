import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AnalyticsPage, OverViewPage} from "../intefaces";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private http: HttpClient) {
  }

  getOverView(): Observable<OverViewPage> {
    return this.http.get<OverViewPage>('/api/analytics/overview')
  }

  getAnalytics(): Observable<AnalyticsPage> {
    return this.http.get<AnalyticsPage>('/api/analytics/analytics')
  }

}
