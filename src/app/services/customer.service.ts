import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CustomerData {
  CustomerID: string;
  CustomerName: string;
  Gender: string;
  PhoneNumber: string;
  DateofBirth: Date | null;
  PackID: string;
  StaffID?: string;
  Startdate?: Date | null;
  Note?: string;
  Image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080/api/customer/'; // URL to web API

  constructor(private http: HttpClient) {}

  getImagePath(imagePath: string): string {
    return imagePath.replace(`${environment.imagePath}`, 'assets');
  }

  getCustomers(): Observable<CustomerData[]> {
    return this.http.get<{ data: CustomerData[] }>(`${this.apiUrl}all`).pipe(
      map((response) => {
        const customers = response.data;

        if (!Array.isArray(customers)) {
          throw new Error('Unexpected response format: not an array');
        }

        return customers.map((customer) => ({
          CustomerID: customer.CustomerID,
          CustomerName: customer.CustomerName,
          Gender: customer.Gender,
          PhoneNumber: customer.PhoneNumber,
          DateofBirth: customer.DateofBirth
            ? new Date(customer.DateofBirth)
            : null,
          PackID: customer.PackID,
          Image: customer.Image
            ? this.getImagePath(customer.Image)
            : 'https://material.angular.io/assets/img/examples/shiba2.jpg', // Chuyển đổi đường dẫn hình ảnh
        }));
      }),
      catchError((error) => {
        console.error('Error fetching customers:', error);
        return of([]);
      })
    );
  }

  addCustomer(
    customer: CustomerData,
    queryParam?: any
  ): Observable<CustomerData | null> {
    let params = new HttpParams();
    if (queryParam && queryParam.key) {
      params = params.append('key', queryParam.key);
    }

    return this.http.post<CustomerData>(this.apiUrl, customer, { params }).pipe(
      catchError((error) => {
        console.error('Error adding customer:', error);
        return of(null);
      })
    );
  }

  updateCustomer(customer: CustomerData): Observable<CustomerData | null> {
    const url = `${this.apiUrl}update?id=${customer.CustomerID}`;

    // Format Startdate to YYYY-MM-DD HH:MM:SS
    const formattedStartdate = customer.Startdate
      ? `${customer.Startdate.getFullYear()}-${String(
          customer.Startdate.getMonth() + 1
        ).padStart(2, '0')}-${String(customer.Startdate.getDate()).padStart(
          2,
          '0'
        )} ${String(customer.Startdate.getHours()).padStart(2, '0')}:${String(
          customer.Startdate.getMinutes()
        ).padStart(2, '0')}:${String(customer.Startdate.getSeconds()).padStart(
          2,
          '0'
        )}`
      : null;

    // Format DateofBirth to YYYY-MM-DD without time
    const formattedDateofBirth = customer.DateofBirth
      ? `${new Date(customer.DateofBirth).toISOString().split('T')[0]}`
      : null;

    return this.http
      .put<CustomerData>(url, {
        CustomerName: customer.CustomerName,
        Gender: customer.Gender,
        DateofBirth: formattedDateofBirth,
        PhoneNumber: customer.PhoneNumber,
        PackID: customer.PackID,
        StaffID: customer.StaffID,
        Startdate: formattedStartdate,
        Note: customer.Note,
      })
      .pipe(
        catchError((error) => {
          console.error('Error updating customer:', error);
          return of(null);
        })
      );
  }
}
