import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { HeaderI18nComponent } from '../basic/widgets/i18n.component';

@Component({
  selector: 'layout-passport',
  template: `
    <div class="container">
      <header-i18n showLangText="false" class="langs" />
      <div class="wrap">
        <div class="top">
          <div class="head">
            <img class="logo" src="./assets/ComputerSelect338b.png" style="height: 100px">
          </div>
        </div>
        <router-outlet />
      </div>
    </div>
  `,
  styleUrls: ['./passport.component.less'],
  standalone: true,
  imports: [RouterOutlet, HeaderI18nComponent, GlobalFooterModule, NzIconModule, ThemeBtnComponent]
})
export class LayoutPassportComponent{
}
