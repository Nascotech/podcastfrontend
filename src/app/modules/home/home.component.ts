import { Component, OnInit } from '@angular/core';
import { PodcastService } from 'src/app/services/podcast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private podcastService:PodcastService) { }

  ngOnInit() {
  }

}


