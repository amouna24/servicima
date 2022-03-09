import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'wid-level-bloc',
  templateUrl: './level-bloc.component.html',
  styleUrls: ['./level-bloc.component.scss']
})
export class LevelBlocComponent implements OnInit {
  @Input() level: number;
  constructor() { }

  ngOnInit(): void {
  }

}
