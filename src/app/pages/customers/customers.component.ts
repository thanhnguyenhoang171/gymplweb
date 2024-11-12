import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomerService, CustomerData } from '../../services/customer.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, 
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    HttpClientModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['CustomerID', 'CustomerName', 'Gender', 'PhoneNumber', 'DateofBirth', 'PackID'];
  dataSource: MatTableDataSource<CustomerData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedCustomer: CustomerData | null = null;
  errorMessage: string | null = null;

  constructor(private customerService: CustomerService) {
    this.dataSource = new MatTableDataSource<CustomerData>([]);
  }

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe({
      next: (data: CustomerData[]) => {
        this.dataSource.data = data;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error("Error fetching customer data: ", error);
        this.errorMessage = "Failed to load customer data. Please try again.";
      },
      complete: () => {
        console.log('Data fetching completed');
      }
    });
  }  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onRowClick(row: CustomerData):void {
    this.selectedCustomer = row;
  } 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}