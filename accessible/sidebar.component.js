/**
 * AccessibleBlockly
 *
 * Copyright 2016 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Angular2 Component representing the sidebar that is shown next
 * to the workspace.
 *
 * @author sll@google.com (Sean Lip)
 */

blocklyApp.SidebarComponent = ng.core.Component({
  selector: 'blockly-sidebar',
  template: `
  <div class="blocklySidebarColumn">
    <div id="blockly-workspace-sidebar" (keydown)="onSidebarKeypress($event)">
      <span *ngFor="#buttonConfig of customSidebarButtons">
        <button *ngIf="!buttonConfig.isHidden()"
                (click)="handleButtonClick(buttonConfig)"
                [attr.aria-describedby]="buttonConfig.ariaDescribedBy"
                class="blocklySidebarButton">
          {{buttonConfig.text}}
        </button>
      </span>
      <button id="clear-workspace" (click)="workspace.clear()"
              [attr.aria-disabled]="isWorkspaceEmpty()"
              class="blocklySidebarButton">
        {{'CLEAR_WORKSPACE'|translate}}
      </button>
    </div>
  </div>
  `,
  pipes: [blocklyApp.TranslatePipe]
})
.Class({
  constructor: [
    blocklyApp.NotificationsService, blocklyApp.TreeService,
    blocklyApp.UtilsService,
    function(_notificationsService, _treeService, _utilsService) {
      // ACCESSIBLE_GLOBALS is a global variable defined by the containing
      // page. It should contain a key, customSidebarButtons, describing
      // additional buttons that should be displayed after the default ones.
      // See README.md for details.
      this.customSidebarButtons =
          ACCESSIBLE_GLOBALS && ACCESSIBLE_GLOBALS.customSidebarButtons ?
          ACCESSIBLE_GLOBALS.customSidebarButtons : [];
      this.workspace = blocklyApp.workspace;
      this.notificationsService = _notificationsService;
      this.treeService = _treeService;
      this.utilsService = _utilsService;
    }
  ],
  handleButtonClick: function(buttonConfig) {
    buttonConfig.action();
    if (buttonConfig.onClickNotification) {
      this.notificationsService.setStatusMessage(
          buttonConfig.onClickNotification);
    }
  },
  onSidebarKeypress: function(e) {
    this.treeService.onSidebarKeypress(e, document.activeElement.id);
  },
  isWorkspaceEmpty: function() {
    return this.utilsService.isWorkspaceEmpty();
  }
});
