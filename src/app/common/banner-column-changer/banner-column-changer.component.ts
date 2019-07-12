import { Component, OnInit } from '@angular/core';
import {WebSettingService} from '@app/layout/webSettingService';
@Component({
  selector: 'app-banner-column-changer',
  templateUrl: './banner-column-changer.component.html',
  styleUrls: ['./banner-column-changer.component.less']
})
export class BannerColumnChangerComponent implements OnInit {
  data=[{name:'0%',value:0},{name:'20%',value:5},{name:'25%',value:6},{name:'30%',value:7},{name:'33%',value:8},{name:'50%',value:12},{name:'67%',value:16},{name:'80%',value:20},{name:'100%',value:24}];
  constructor(public webSetting:WebSettingService) { }

  ngOnInit() {
    
  }
  change(item:any):void{
    this.webSetting.bannerChange(item.value);
  }
}
