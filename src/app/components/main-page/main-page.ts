import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule
} from 'ng-apexcharts';
import { Observable, combineLatest } from 'rxjs';
import { DataService } from '../../services/data';

interface Tradesperson { id: string; trade: string; rating?: number; }
interface Service { id: string; category: string; isActive: boolean; }
interface Order { id?: string; status: string; date: string; }
interface Client { id?: string; }



@Component({
  selector: 'app-main-page',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage implements OnInit {
  totalTradespeople = 0;
  totalServices = 0;
  totalOrders = 0;
  totalClients = 0;
  activeServices = 0;
  completedOrders = 0;

  donutOptions!: DonutChartOptions;
  barOptions!: BarChartOptions;
  lineOptions!: LineChartOptions;
  radialOptions!: RadialChartOptions;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.initCharts();
    this.loadDashboardData();
  }

  initCharts() {
    this.donutOptions = {
      series: [],
      labels: [],
      colors: ['#00C853', '#FFD600', '#FF5722', '#9C27B0', '#2196F3', '#FF9800'],
      chart: { type: 'donut', height: 300 },
      responsive: [{ breakpoint: 480, options: { chart: { width: 200 } } }],
      title: { text: 'توزيع الفنيين حسب التخصص', style: { fontSize: '16px', fontFamily: 'Tajawal, sans-serif' } }
    };

    this.barOptions = {
      series: [{ name: 'الخدمات', data: [] }],
      xaxis: { categories: [] },
      yaxis: { title: { text: 'عدد الخدمات' }, min: 0, },
      chart: { type: 'bar', height: 300 },
      colors: ['#3F51B5'],
      title: { text: 'الخدمات حسب الفئة', style: { fontSize: '16px' } }
    };

    this.lineOptions = {
      series: [{ name: 'الطلبات', data: [] }],
      xaxis: { categories: [] },
      chart: { type: 'area', height: 300 },
      colors: ['#4CAF50'],
      title: { text: 'الطلبات الشهرية (آخر 6 أشهر)', style: { fontSize: '16px' } }
    };

    this.radialOptions = {
      series: [0],
      chart: { type: 'radialBar', height: 300 },
      colors: ['#00C853'],
      plotOptions: {
        radialBar: {
          hollow: { size: '70%' },
          dataLabels: {
            name: { fontSize: '16px', fontFamily: 'Tajawal, sans-serif' },
            value: { fontSize: '22px', fontFamily: 'Tajawal, sans-serif' }
          }
        }
      },
      labels: ['التقييم المتوسط']
    };
  }

  loadDashboardData() {
    const trades$ = this.dataService.getData('Tradespeople') as Observable<Tradesperson[]>;
    const services$ = this.dataService.getData('services') as Observable<Service[]>;
    const orders$ = this.dataService.getData('orders') as Observable<Order[]>;
    const clients$ = this.dataService.getData('clients') as Observable<Client[]>;

    combineLatest([trades$, services$, orders$, clients$]).subscribe(([trades, services, orders, clients]) => {
      this.totalTradespeople = trades.length;
      this.totalServices = services.length;
      this.totalOrders = orders.length;
      this.totalClients = clients.length;
      this.activeServices = services.filter(s => s.isActive).length;
      this.completedOrders = orders.filter(o => ['مكتملة', 'completed'].includes(o.status)).length;


      const tradeCount: { [key: string]: number } = {};
      trades.forEach(t => {
        const trade = this.translateTrade(t.trade);
        tradeCount[trade] = (tradeCount[trade] || 0) + 1;
      });
      this.donutOptions = {
        ...this.donutOptions,
        series: Object.values(tradeCount),
        labels: Object.keys(tradeCount)
      };


      const categoryCount: { [key: string]: number } = {};
      services.forEach(s => {
        categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
      });
      this.barOptions = {
        ...this.barOptions,
        series: [{ name: 'الخدمات', data: Object.values(categoryCount) }],
        xaxis: { categories: Object.keys(categoryCount) }
      };


      const monthlyOrders: { [key: string]: number } = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = d.toLocaleString('ar-EG', { month: 'short', year: '2-digit' });
        monthlyOrders[monthKey] = 0;
      }
      orders.forEach(o => {
        const orderDate = new Date(o.date);
        const monthKey = orderDate.toLocaleString('ar-EG', { month: 'short', year: '2-digit' });
        if (monthlyOrders.hasOwnProperty(monthKey)) {
          monthlyOrders[monthKey]++;
        }
      });
      this.lineOptions = {
        ...this.lineOptions,
        series: [{ name: 'الطلبات', data: Object.values(monthlyOrders) }],
        xaxis: { categories: Object.keys(monthlyOrders) }
      };


      const ratings = trades.map(t => t.rating || 0).filter(r => r > 0);
      const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
      this.radialOptions = {
        ...this.radialOptions,
        series: [Math.min(100, Math.round(avgRating * 20))],
        colors: avgRating >= 4 ? ['#00C853'] : avgRating >= 3 ? ['#FFD600'] : ['#FF5722']
      };
    });
  }

  translateTrade(trade: string): string {
    const map: { [key: string]: string } = {
      'سباكة': 'سباكين',
      'نجارة': 'نجارين',
      'كهرباء': 'كهربائيين',
 
    };
    return map[trade] || trade;
  }
}


type DonutChartOptions = {
  series: number[];
  labels: string[];
  colors: string[];
  chart: ApexChart;
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
};

type BarChartOptions = {
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  chart: ApexChart;
  colors: string[];
  title: ApexTitleSubtitle;
};

type LineChartOptions = {
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  chart: ApexChart;
  colors: string[];
  title: ApexTitleSubtitle;
  
};

type RadialChartOptions = {
  series: number[];
  chart: ApexChart;
  colors: string[];
  plotOptions: any;
  labels: string[];
};