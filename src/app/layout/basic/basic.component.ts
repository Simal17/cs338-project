import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { I18nPipe, SettingsService, User } from "@delon/theme";
import {
  LayoutDefaultModule,
  LayoutDefaultOptions,
} from "@delon/theme/layout-default";
import { SettingDrawerModule } from "@delon/theme/setting-drawer";
import { ThemeBtnComponent } from "@delon/theme/theme-btn";
import { environment } from "@env/environment";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzMenuModule } from "ng-zorro-antd/menu";

import { HeaderClearStorageComponent } from "./widgets/clear-storage.component";
import { HeaderFullScreenComponent } from "./widgets/fullscreen.component";
import { HeaderSearchComponent } from "./widgets/search.component";
import { HeaderUserComponent } from "./widgets/user.component";
import { HeaderI18nComponent } from "./widgets/i18n.component";

@Component({
  selector: "layout-basic",
  template: `
    <layout-default
      [options]="options"
      [content]="contentTpl"
      [customError]="null"
    >
      <layout-default-header-item direction="right" style="width: 200px;">
        <div nz-row>
          <div nz-col nzSpan="12">
            <span nz-icon nzType="bell" nzTheme="outline"></span>
          </div>
          <div nz-col nzSpan="12"><header-user /></div>
        </div>
      </layout-default-header-item>
      <!-- <ng-template #asideUserTpl>
        <div nz-dropdown nzTrigger="click" class="alain-default__aside-user">
          <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar" />
          <div class="alain-default__aside-user-info">
            <strong>{{ user.name }}</strong>
            <p class="mb0">{{ user.email }}</p>
          </div>
        </div>
      </ng-template> -->
      <ng-template #contentTpl>
        <router-outlet />
      </ng-template>
    </layout-default>
    <theme-btn />
  `,
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    I18nPipe,
    LayoutDefaultModule,
    SettingDrawerModule,
    ThemeBtnComponent,
    NzIconModule,
    NzMenuModule,
    NzDropDownModule,
    NzAvatarModule,
    HeaderSearchComponent,
    HeaderClearStorageComponent,
    HeaderFullScreenComponent,
    HeaderUserComponent,
    HeaderI18nComponent,
  ],
})
export class LayoutBasicComponent {
  private readonly settings = inject(SettingsService);
  options: LayoutDefaultOptions = {
    logoExpanded: `./assets/ComputerSelect338.png`,
    logoCollapsed: `./assets/ComputerSelect338s.png`,
  };
  searchToggleStatus = false;
  showSettingDrawer = !environment.production;
  get user(): User {
    return this.settings.user;
  }
}
