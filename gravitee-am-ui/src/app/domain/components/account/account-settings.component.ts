/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from "moment";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  @Output() onSavedAccountSettings = new EventEmitter<any>();
  @Input() accountSettings: any = {};
  @Input() inheritMode: boolean = false;
  formChanged: boolean = false;

  constructor() {}

  save() {
    this.onSavedAccountSettings.emit(this.accountSettings);
  }

  ngOnInit(): void {
    this.accountSettings = this.accountSettings || { 'inherited' : this.inheritMode };
    this.initDateValues();
  }

  enableInheritMode(event) {
    this.accountSettings.inherited = event.checked;
    this.formChanged = true;
  }

  isInherited() {
    return this.accountSettings && this.accountSettings.inherited;
  }

  enableBrutForceAuthenticationDetection(event) {
    this.accountSettings.loginAttemptsDetectionEnabled = event.checked;
    this.formChanged = true;
  }

  isBrutForceAuthenticationEnabled() {
    return this.accountSettings && this.accountSettings.loginAttemptsDetectionEnabled;
  }

  formIsValid() {
    if (this.accountSettings.loginAttemptsDetectionEnabled) {
      if (this.accountSettings.maxLoginAttempts < 1) {
        return false;
      }
      if (this.accountSettings.loginAttemptsResetTime < 1) {
        return false;
      } else if (!this.accountSettings.loginAttemptsResetTimeUnitTime) {
        return false;
      }
      if (this.accountSettings.accountBlockedDuration < 1) {
        return false;
      } else if (!this.accountSettings.accountBlockedDurationUnitTime) {
        return false;
      }
    }
    return true;
  }

  private initDateValues() {
    if (this.accountSettings.loginAttemptsResetTime > 0) {
      let loginAttemptsResetTime = this.getHumanizeDuration(this.accountSettings.loginAttemptsResetTime);
      this.accountSettings.loginAttemptsResetTime = loginAttemptsResetTime[0];
      this.accountSettings.loginAttemptsResetTimeUnitTime = loginAttemptsResetTime[1];
    }

    if (this.accountSettings.accountBlockedDuration > 0) {
      let accountBlockedDuration = this.getHumanizeDuration(this.accountSettings.accountBlockedDuration);
      this.accountSettings.accountBlockedDuration = accountBlockedDuration[0];
      this.accountSettings.accountBlockedDurationUnitTime = accountBlockedDuration[1];
    }
  }

  private getHumanizeDuration(value) {
    let humanizeDate = moment.duration(value, 'seconds').humanize().split(' ');
    let humanizeDateValue = humanizeDate[0] === 'a' ? 1 : humanizeDate[0];
    let humanizeDateUnit = humanizeDate[1].endsWith('s') ? humanizeDate[1] : humanizeDate[1] + 's';
    return new Array(humanizeDateValue, humanizeDateUnit);
  }
}
