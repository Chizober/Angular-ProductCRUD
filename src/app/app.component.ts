import { Component,ViewChild, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  title = 'ProductCRUD';
  displayedColumns: string[] = ['productName', 'category', 'date','freshness','price','comment','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog:MatDialog, private api:ApiService,private toast :NgToastService){

  }
  ngOnInit(): void{
    this.getAllProducts();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
     width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val=='save')
      {
        this.getAllProducts();
      }
    })
  }
  getAllProducts()
  {
this.api.getProduct().subscribe({
  next:(res)=>{
  this.dataSource = new MatTableDataSource(res);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort
  },
  error:(err)=>{
    // alert("error while getting products")
    this.toast.error({detail:'error Message',summary:'error while getting products',duration:3000})
  }
})
  }
  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
     width:'30%',
     data:row
    }).afterClosed().subscribe(val=>{
      if(val=='update')
      {
        this.getAllProducts();
      }
    })
  }
  deleteProduct(id:number)
  {
    this.api.deleteProduct(id).subscribe({
      next:(res)=>
      {
        // alert("product deleted successfully");
      this.toast.success({detail:'Success Message',summary:'Product deleted successfully',duration:3000})
      this.getAllProducts();
    },error:()=>{
      // alert("product was not deleted successfully")
      this.toast.error({detail:'error Message',summary:'product was not deleted successfully',duration:3000})
    }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
