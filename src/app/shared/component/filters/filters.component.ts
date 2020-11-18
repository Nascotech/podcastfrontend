import { Component, OnInit, OnDestroy } from '@angular/core';
import { PodcastService } from 'src/app/services/podcast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstNameService } from 'src/app/services/const-name.service';
import { HttpErrorResponse } from '@angular/common/http';
import { interval } from 'rxjs';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit, OnDestroy {

  groupList: any;
  searchText: string;
  groupId: '';
  intervalId: any;
  iterations = 0;

  constructor(
    private podcastService: PodcastService,
    private constname: ConstNameService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(queryParams => {
      this.groupId = queryParams.groupId || '';
    });
  }

  ngOnInit() {
    this.intervalId = setInterval(()=> this.getGroups(), 2000);
  }

  getGroups() {
    this.iterations++;
    if(this.iterations === 2 ){
      clearInterval(this.intervalId);
    }
    this.podcastService.getGroupList(1).subscribe((data: any) => {
      this.groupList = data.response;
      console.log(data);
      
      localStorage.setItem('groupList', JSON.stringify(data.response.data));
    }, (error: HttpErrorResponse) => {
      this.constname.forbidden(error);
    });
  }

  groupFilter(event) {
    this.groupId = event.target.value;
    this.router.navigate(['/'], { queryParams: { groupId: this.groupId, searchText: this.searchText } });
  }

  searchPodcast() {
    this.router.navigate(['/'], { queryParams: { groupId: this.groupId, searchText: this.searchText } });
  }

  clearSearch() {
    this.searchText = '';
    this.router.navigate(['/'], { queryParams: { groupId: this.groupId, searchText: this.searchText } });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
