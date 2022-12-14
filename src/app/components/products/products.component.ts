import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable, catchError, map, startWith } from 'rxjs';
import { Product } from 'src/app/model/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { AppDataState, DataStateEnum } from 'src/app/state/product.state';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  //products:Product[]|null=null;
  //products$:Observable<Product[]>|null=null;
  products$:Observable<AppDataState<Product[]>>|null=null;
  readonly DataStateEnum=DataStateEnum;
  
  constructor(private productsService:ProductsService,private router:Router ) { }

  ngOnInit(): void {
  }

/*  onGetAllProducts(){
    this.productsService.getAllProducts().subscribe(data=>{
      this.products=data;
    },err=>{
      console.log(err);
    })
  }*/
  onGetAllProducts(){
    this.products$=this.productsService.getAllProducts().pipe(
      map(data=>{
        console.log(data);
        return({dataState:DataStateEnum.LOADED,data:data})
    }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }

  onGetSelectedProducts(){
    this.products$=this.productsService.getSelectedProducts().pipe(
      map(data=>{
        console.log(data);
        return({dataState:DataStateEnum.LOADED,data:data})
    }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }

  onGetAvailableProducts(){
    this.products$=this.productsService.getAvailableProducts().pipe(
      map(data=>{
        console.log(data);
        return({dataState:DataStateEnum.LOADED,data:data})
    }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }


  onSearch(dataForm:any){
    this.products$=this.productsService.searchProducts(dataForm.keyword).pipe(
      map(data=>{
        console.log(data);
        return({dataState:DataStateEnum.LOADED,data:data})
    }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }

  onSelect(p:Product){
   this.productsService.select(p).subscribe(data=>{
    p.selected=data.selected;
   })
  }

  
  onDelete(p:Product){
    let v=confirm("Etes vous sure?");
    if(v==true)
    this.productsService.deleteProduct(p).subscribe(data=>{
     this.onGetAllProducts();
    })
   }

   onNewProduct(){
    this.router.navigateByUrl("/newProduct");
   }


   
   onEdit(p:Product){
    this.router.navigateByUrl("/editProduct/"+p.id);
   }

}
