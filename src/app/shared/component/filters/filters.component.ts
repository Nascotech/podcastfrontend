import { Component, OnInit } from '@angular/core';
import { PodcastService } from 'src/app/services/podcast.service';
import { Router } from '@angular/router';
import { ConstNameService } from 'src/app/services/const-name.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit {

  groupList: any;
  searchText: string;
  groupId: '';

  constructor(
    private podcastService: PodcastService,
    private constname: ConstNameService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getGroupList();
  }

  getGroupList() {
    this.podcastService.getGroupList(1).subscribe((data: any) => {
      this.groupList = data.response.data;
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
}
