import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'wid-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() pageSizes: number[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  dataSource = new MatTableDataSource(this.data);

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 3000);

  }

  action(row) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
