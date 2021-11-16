import {Component, OnInit, OnDestroy} from '@angular/core';
import {PodcastService} from 'src/app/services/podcast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConstNameService} from 'src/app/services/const-name.service';
import {HttpErrorResponse} from '@angular/common/http';
import {interval} from 'rxjs';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit, OnDestroy {

    groupList: any;
    searchText: string;
    groupId = 0;
    intervalId: any;
    iterations = 0;

    constructor(
        private podcastService: PodcastService,
        private constname: ConstNameService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.route.paramMap.subscribe(queryParams => {
            if (queryParams.get('gid') !== null) {
                this.groupId = Number(queryParams.get('gid'));
            }
        });
    }

    ngOnInit() {
        this.intervalId = setInterval(() => this.getGroups(), 2000);
    }

    getGroups() {
        this.iterations++;
        if (this.iterations === 2) {
            clearInterval(this.intervalId);
        }
        this.podcastService.getGroupList(1).subscribe((data: any) => {
            this.groupList = data.response;
            localStorage.setItem('groupList', JSON.stringify(data.response.data));
        }, (error: HttpErrorResponse) => {
            this.constname.forbidden(error);
        });
    }

    groupFilter(event) {
        this.groupId = event.target.value;
        const publisherSlug = localStorage.getItem('publisherSlug') || '';
        if (publisherSlug !== '') {
            this.router.navigate([`/publisher/${publisherSlug}/${this.groupId}`]);
        }else {
            this.router.navigate([`/group/${this.groupId}`]);
        }
    }

    searchPodcast() {
        const publisherSlug = localStorage.getItem('publisherSlug') || '';
        if (publisherSlug !== '') {
            if (this.groupId > 0) {
                this.router.navigate([`/publisher/${publisherSlug}/${this.groupId}`], {queryParams: {searchText: this.searchText}});
            } else {
                this.router.navigate([`/publisher/${publisherSlug}`], {queryParams: {searchText: this.searchText}});
            }

        }else {
            this.route.paramMap.subscribe(queryParams => {
                if (queryParams.get('gid') !== null) {
                    this.groupId = Number(queryParams.get('gid'));
                }
            });
            if (this.groupId > 0) {
                this.router.navigate([`/group/${this.groupId}`], {queryParams: {searchText: this.searchText}});
            }else {
                this.router.navigate(['/'], {queryParams: {searchText: this.searchText}});
            }
        }
    }

    clearSearch() {
        this.searchText = '';
        const publisherSlug = localStorage.getItem('publisherSlug') || '';
        if (publisherSlug !== '') {
            if (this.groupId > 0) {
                this.router.navigate([`/publisher/${publisherSlug}/${this.groupId}`]);
            } else {
                this.router.navigate([`/publisher/${publisherSlug}`]);
            }

        }else {
            this.route.paramMap.subscribe(queryParams => {
                if (queryParams.get('gid') !== null) {
                    this.groupId = Number(queryParams.get('gid'));
                }
            });
            if (this.groupId > 0) {
                this.router.navigate([`/group/${this.groupId}`]);
            }else {
                this.router.navigate(['/']);
            }
        }
    }

    ngOnDestroy() {
        clearInterval(this.intervalId);
    }
}
