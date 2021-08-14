import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsService} from "../../shared/services/analytics.service";
import {Subscription} from "rxjs";
import {Chart,registerables } from "chart.js";
@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef:ElementRef
  @ViewChild('order') orderRef:ElementRef
  average:number
  aSub:Subscription
  constructor(private service:AnalyticsService) {
    Chart.register(...registerables)
  }

  ngAfterViewInit(): void {
    const gainConfig:any = {
      label:'Gain',
      color:'rgb(255,99,132)'
    }
    const orderConfig:any = {
      label:'Order',
      color:'rgb(54,162,235)'
    }
    this.aSub = this.service.getAnalytics().subscribe((data) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      // **** temp ****
      // gainConfig.labels.push('13.05.2020')
      // gainConfig.data.push(9999999500)
      // gainConfig.labels.push('14.05.2020')
      // gainConfig.data.push(1500)
      // **** temp ****

      // gain
      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      new Chart(gainCtx, createChartConfig(gainConfig))

      // order
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      orderCtx.canvas.height = '300px'
      new Chart(orderCtx, createChartConfig(orderConfig))

    })
  }
  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}
function createChartConfig({labels,data,label,color}):any {
  return {
    type:"line",
    options: {
      responsive:true
    },
    data: {
      labels,
      datasets: [
        {
          label,data,
          borderColor:color,
          steppedLine:false,
          fill:false
        }
      ]
    }
  }
}
