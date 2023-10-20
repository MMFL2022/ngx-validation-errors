import {Component, HostBinding, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-custom-errors',
  templateUrl: './custom-errors.component.html',
  styleUrls: ['./custom-errors.component.scss']
})
export class CustomErrorsComponent implements OnInit {
  @Input() public messages: string[] = [];
  @Input() public params: {[key: string]: any} = {};
  @Input() @HostBinding('class.is-inner') public innerValidationError: boolean = false;

  @ViewChild('impl', {static: true}) template: TemplateRef<any> | undefined;

  constructor(private vcr: ViewContainerRef) {
  }

  ngOnInit() {
    if (this.template != undefined) {
      this.vcr.createEmbeddedView(this.template);
    }
  }
}