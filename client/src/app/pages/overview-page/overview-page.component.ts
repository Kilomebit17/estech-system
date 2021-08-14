import {Component, OnInit} from '@angular/core';
import {AnalyticsService} from "../../shared/services/analytics.service";
import {Observable} from "rxjs";
import {OverViewPage} from "../../shared/intefaces";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit {
  date$: Observable<OverViewPage>
  yesterday = new Date()
  constructor(private service: AnalyticsService) {
  }

  ngOnInit(): void {
    this.date$ = this.service.getOverView()
    this.yesterday.setDate(this.yesterday.getDay() - 1)
  }

}
