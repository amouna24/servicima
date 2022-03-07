import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { colorList } from '@shared/statics/testTechnologiesColorList';
import { UtilsService } from '@core/services/utils/utils.service';
import { Color } from 'ng2-charts';
import { ChartType } from 'chart.js';
@Component({
  selector: 'wid-customize-session',
  templateUrl: './customize-session.component.html',
  styleUrls: ['./customize-session.component.scss']
})
export class CustomizeSessionComponent implements OnInit {
  selectedBlocArray = [];
  blocTitlesAndPointsList = [];
  totalPoints = 0;
  options = { };
   doughnutChartType: ChartType = 'doughnut';
  doughnutChartColors: Color[] = [];
  selectedBlocsStringFormat: string;

constructor(
  private testService: TestService,
  private utilsService: UtilsService,
) {
  this.getChartParams();
  this.getSelectedBlocArray();
}
  blocQuestionsList: Array<{
    questionDetails: ITestQuestionModel,
    bloc_title: string,
    color: string
  }> = [];

  sessionQuestionsList = [];
  async ngOnInit(): Promise<void> {
    await this.getBlocQuestionsData();
    this.getBlocTitleAndPoints();
  }
  getBlocQuestionsData() {
    this.testService.getQuestion(`?test_question_bloc_code=${this.selectedBlocsStringFormat}`).subscribe( (resNode) => {
      const quartLength = Math.ceil(resNode.length / 3);
      resNode.map( (resOneNode, index) => {
        this.testService
          .getQuestionBloc(`?test_question_bloc_code=${resOneNode.TestQuestionKey.test_question_bloc_code}`)
          .subscribe( (resBlocQuestion) => {
            if
            (this.blocQuestionsList.length - this.sessionQuestionsList.length > quartLength
              &&
              resBlocQuestion['results'][0]?.test_question_bloc_title !== this.sessionQuestionsList[index - 1]?.bloc_title) {
              this.sessionQuestionsList.push({
                questionDetails: resOneNode,
                bloc_title: resBlocQuestion['results'][0]?.test_question_bloc_title,
                color: colorList[index]
              });
            } else {
              this.blocQuestionsList.push({
                questionDetails: resOneNode,
                bloc_title: resBlocQuestion['results'][0]?.test_question_bloc_title,
                color: colorList[index]
              });
            }
            this.totalPoints += Number(resOneNode.mark);
        });
      });
      });
  }
  dragAndDrop(event: CdkDragDrop<Array<{ questionDetails: ITestQuestionModel; bloc_title: string; color: string }>, any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  getLevel(levelCode) {
    switch (levelCode) {
      case 'TestLevel00001' : {
        return  1;
      }
      default: return 4;
    }
  }
  getColors(index) {
      switch (index) {
        case this.selectedBlocArray[0]: {
          return colorList[0];
        }
        case this.selectedBlocArray[1]: return colorList[1];
        case this.selectedBlocArray[2]: return colorList[2];
        case this.selectedBlocArray[3]: return colorList[3];
        case this.selectedBlocArray[4]: return colorList[4];
        case this.selectedBlocArray[5]: return colorList[5];
      }
    }
  addRandomQuestion() {
    const randomNumber = Math.floor(Math.random() * this.blocQuestionsList.length);
    this.sessionQuestionsList.push(this.blocQuestionsList[randomNumber]);
    this.blocQuestionsList.splice(randomNumber, 1);
  }
  setDuration(duration) {
    const displayedHours = Math.floor(duration / 3600) <= 9 ? '0' + Math.floor(duration / 3600) : Math.floor(duration / 3600);
    const displayedMinutes = Math.floor(duration % 3600 / 60) <= 9 ? '0' + Math.floor(duration / 60) : Math.floor(duration / 60);
    const displayedSeconds = Math.floor(duration % 3600 % 60) <= 9 ? '0' + Math.floor(duration % 60) : Math.floor(duration % 60);
    return displayedHours !== 0 ? displayedMinutes + ':' + displayedSeconds : displayedHours + ':' + displayedMinutes + ':' + displayedSeconds;
  }
  getBlocTitleAndPoints()  {
       this.selectedBlocArray.forEach( (blocQuestionCode) => {
        let totalPoints = 0;
         this.testService.getQuestionBloc(`?test_question_bloc_code=${blocQuestionCode}`)
          .subscribe( (resNode) => {
            this.testService
              .getQuestion(`?test_question_bloc_code=${blocQuestionCode}`)
              .subscribe( (resQuestion) => {
                resQuestion.map( (resOneQuestion) => {
                  totalPoints += Number(resOneQuestion.mark);
                });
                this.blocTitlesAndPointsList.push({
                  title: resNode['results'][0].test_question_bloc_title,
                  points: totalPoints,
                  code: blocQuestionCode
                });
              });
          });
      });
    }
  getSelectedBlocArray() {
    this.utilsService.verifyCurrentRoute('/manager/test/bloc-list').subscribe( (data) => {
      this.selectedBlocsStringFormat = data.selectedBlocs;
      this.selectedBlocArray = data.selectedBlocs.split(',');
    });
    }
  getChartPercentage() {
      return this.blocTitlesAndPointsList.map( (oneBloc) => {
        return Number((oneBloc.points * 100) / this.totalPoints);
      });
    }
  getChartTitle() {
    return this.blocTitlesAndPointsList.map( (oneBloc) => {
      return oneBloc.title;
    });
  }
  getChartParams() {
    this.doughnutChartType = 'doughnut';
    this.options = {
      cutoutPercentage: 70,
      cutout: 70,
      legend: { display: false }
    };
    this.doughnutChartColors = [{
      backgroundColor: colorList
    }];
  }
}
