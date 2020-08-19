import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { IContract } from '@shared/models/contract.model';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {

  displayedColumns: string[] = ['contract_code', 'contractor_code', 'collaborator_email',
                                'contract_start_date', 'contract_end_date', 'contract_date',
                                'contract_status', 'contract_rate'];
  dataSource: MatTableDataSource<IContract>;

  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;

  /* Static Customers And Status Declaration */
  Customers = [
    { email: 'olivier@europcar.fr', name: 'Olivier'},
    { email: 'frank@canalplus.fr', name: 'Frank'}
  ];
  Status = [
    { value: 'Signed', viewValue: 'Signed'},
    { value: 'Draft', viewValue: 'Draft'},
  ];
  /*******************************************/

  /*********** Contract Data Table ***********/
  contractList: IContract[] = [];
  /*******************************************/

  constructor(
    private contractService: ContractsService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.getContracts();
  }

  /**
   * @description Filter Date with specific value
   * @param event Value to filter with
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * @description Get Contracts List
   */
  getContracts() {
    this.contractService.getContracts('').subscribe(
      (response) => {
        this.contractList = response;
        this.dataSource = new MatTableDataSource(this.contractList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        if (error.error.msg_code === '0004') {
          this.contractList = [];
          this.dataSource = new MatTableDataSource(this.contractList);
        }
      },
    );
  }

  /**
   * @description Navigate to ADD NEW CONTRACT Components
   */
  addNewContract() {
    this.router.navigate(['/manager/contract-management/create']);
  }
}
