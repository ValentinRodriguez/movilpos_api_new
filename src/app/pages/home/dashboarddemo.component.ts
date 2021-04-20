import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboarddemo.scss'],
})
export class DashboardDemoComponent implements OnInit {

    cols: any[];
    items: MenuItem[] = [];
    ordersChart: any;
    ordersChartOptions: any;
    orderWeek: any;
    selectedOrderWeek: any;
    products: Product[];
    productsThisWeek: Product[];
    productsLastWeek: Product[];
    revenueChart: any;

    constructor(private homeService: HomeService,
                public dialogService: DialogService,
                private productService: ProductService,
                private router: Router,
                private datosEstaticosServ: DatosEstaticosService) { }

    ngOnInit() {        
        console.log(this.router.url);
        
        this.homeService.autoLlenado().then((resp: any) => {
            console.log(resp);            
            for (let index = 0; index < resp.length; index++) {      
                if (resp[index].data.length === 0) {     
                  this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(resp[index].label), routerLink: resp[index].label})
                }      
            }   
        })

        //  this.items = [{
        //         label: 'Personal',
        //         routerLink: 'personal'
        //     },
        //     {
        //         label: 'Seat',
        //         routerLink: 'seat'
        //     },
        //     {
        //         label: 'Payment',
        //         routerLink: 'payment'
        //     },
        //     {
        //         label: 'Confirmation',
        //         routerLink: 'confirmation'
        //     }
        // ];
    }

    ngOnDestroy() {

    }

    changeDataset(event) {
      const dataSet = [
          [2, 7, 20, 9, 16, 9, 5],
          [2, 4, 9, 20, 16, 12, 20],
          [2, 17, 7, 15, 4, 20, 8],
          [2, 2, 20, 4, 17, 16, 20]
      ];

      this.ordersChart.datasets[0].data = dataSet[parseInt(event.currentTarget.getAttribute('data-index'))];
      this.ordersChart.datasets[0].label = event.currentTarget.getAttribute('data-label');
      this.ordersChart.datasets[0].borderColor = event.currentTarget.getAttribute('data-stroke');
      this.ordersChart.datasets[0].backgroundColor = event.currentTarget.getAttribute('data-fill');
    }

    recentSales(event) {
        if (event.value.code === '0') {
            this.products = this.productsThisWeek;
        } else {
            this.products = this.productsLastWeek;
        }

        this.productService.getProducts().then(data => this.products = data);
        this.productService.getProducts().then(data => this.productsThisWeek = data);
        this.productService.getProductsMixed().then(data => this.productsLastWeek = data);

        this.cols = [
            {field: 'vin', header: 'Vin'},
            {field: 'year', header: 'Year'},
            {field: 'brand', header: 'Brand'},
            {field: 'color', header: 'Color'}
        ];

        this.items = [{
            label: 'Shipments',
            items: [
                { label: 'Tracker', icon: 'pi pi-compass' },
                { label: 'Map', icon: 'pi pi-map-marker' },
                { label: 'Manage', icon: 'pi pi-pencil' }
            ]
        }
        ];

        this.ordersChart = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'New',
                data: [2, 7, 20, 9, 16, 9, 5],
                backgroundColor: [
                    'rgba(100, 181, 246, 0.2)',
                ],
                borderColor: [
                    '#64B5F6',
                ],
                borderWidth: 3,
                fill: true
            }]
        };

        this.ordersChartOptions = {
            legend: {
                display: true,
            },
            responsive: true,
            hover: {
                mode: 'index'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 20
                    }
                }]
            }
        };

        this.orderWeek = [
            {name: 'This Week', code: '0'},
            {name: 'Last Week', code: '1'}
        ];

        this.revenueChart = {
            labels: ['Direct', 'Promoted', 'Affiliate'],
            datasets: [{
                data: [40, 35, 25],
                backgroundColor: ['#64B5F6', '#7986CB', '#4DB6AC']
            }]
        };
    }

    shuffle() {
        for (let i = this.products.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.products[i], this.products[j]] = [this.products[j], this.products[i]];
        }
        return this.products;
    }
    

}
