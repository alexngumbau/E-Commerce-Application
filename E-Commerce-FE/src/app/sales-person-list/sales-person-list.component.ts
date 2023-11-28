import { Component, OnInit } from '@angular/core';
import { SalesPerson } from './sales-person';

@Component({
  selector: 'app-sales-person-list',
  templateUrl: './sales-person-list-bootstrap.component.html',
  styleUrls: ['./sales-person-list.component.css']
})
export class SalesPersonListComponent implements OnInit {

  // create an array of objects
  salesPersonList : SalesPerson[] = [
    new SalesPerson("Alex", "Ngumbau", "alex@gmail.com", 5000),
    new SalesPerson("Ruth", "Lilly", "ruth@gmail.com", 7000),
    new SalesPerson("Robert", "Njuguini", "robert@gmail.com", 3999),
    new SalesPerson("Annet", "Ayuko", "anet@gmail.com", 600),
    new SalesPerson("Simon", "Mugo", "simon@gmail.com", 4000)
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
