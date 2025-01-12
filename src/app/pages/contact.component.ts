import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-contact',
  template: `
    <div class="page-container">
      @if (contactForm.invalid) {
      <div class="debug">
        <h3>Form Debug Info:</h3>
        <p>Form Valid: {{ contactForm.valid }}</p>
        <p>Form Touched: {{ contactForm.touched }}</p>
        <p>Form Dirty: {{ contactForm.dirty }}</p>
        <p>Form Errors: {{ contactForm.errors | json }}</p>

        <h4>Form Controls Status:</h4>
        <div *ngFor="let control of getFormControls()">
          <p>{{ control.key }}:</p>
          <ul>
            <li>Valid: {{ contactForm.get(control.key)?.valid }}</li>
            <li>Touched: {{ contactForm.get(control.key)?.touched }}</li>
            <li>Dirty: {{ contactForm.get(control.key)?.dirty }}</li>
            <li>Errors: {{ contactForm.get(control.key)?.errors | json }}</li>
          </ul>
        </div>

        <pre>{{ contactForm.value | json }}</pre>
      </div>
      }

      <div class="form-card">
        <h2>{{ isEditMode ? 'Edit Contact' : 'Add New Contact' }}</h2>
        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
          <div class="form-content">
            <div class="image-upload">
              <div class="image-container">
                <img
                  [src]="imagePreview || 'images/profile.png'"
                  alt="Profile image"
                  class="profile-image"
                />
                <button
                  type="button"
                  (click)="fileInput.click()"
                  class="change-image-btn"
                >
                  <i class="fas fa-camera"></i>
                </button>
              </div>
              <input
                type="file"
                accept="image/*"
                (change)="onImageSelected($event)"
                #fileInput
              />
            </div>

            <!-- Common Fields -->
            <div class="form-section">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    formControlName="firstName"
                    [class.invalid]="isFieldInvalid('firstName')"
                  />
                  <div
                    class="error-message"
                    *ngIf="isFieldInvalid('firstName')"
                  >
                    First name is required
                  </div>
                </div>
                <div class="form-group">
                    <label for="middleName">Middle Name</label>
                    <input
                      id="middleName"
                      type="text"
                      formControlName="middleName"
                    />
                  </div>
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    formControlName="lastName"
                    [class.invalid]="isFieldInvalid('lastName')"
                  />
                  <div class="error-message" *ngIf="isFieldInvalid('lastName')">
                    Last name is required
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="emailAddress">Email Address</label>
                  <input
                    id="emailAddress"
                    type="email"
                    formControlName="emailAddress"
                    [class.invalid]="isFieldInvalid('emailAddress')"
                  />
                  <div
                    class="error-message"
                    *ngIf="isFieldInvalid('emailAddress')"
                  >
                    Please enter a valid email address
                  </div>
                </div>
                <div class="form-group">
                  <label for="mobilePhone">Mobile Phone</label>
                  <input
                    id="mobilePhone"
                    type="tel"
                    formControlName="mobilePhone"
                    [class.invalid]="isFieldInvalid('mobilePhone')"
                  />
                  <div
                    class="error-message"
                    *ngIf="isFieldInvalid('mobilePhone')"
                  >
                    Please enter a valid phone number
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="company">Company</label>
                <input id="company" type="text" formControlName="company" />
              </div>

              <div class="form-group">
                <label for="jobTitle">Job Title</label>
                <input id="jobTitle" type="text" formControlName="jobTitle" />
              </div>
            </div>

            <!-- Toggle Button -->
            <button
              type="button"
              class="toggle-btn"
              (click)="toggleAdvancedFields()"
            >
              {{
                showAdvancedFields
                  ? 'Hide Advanced Fields'
                  : 'Show Advanced Fields'
              }}
            </button>

            <!-- Advanced Fields -->
            <div *ngIf="showAdvancedFields" class="advanced-fields">
              <!-- Personal Information -->
              <fieldset>
                <legend>Personal Information</legend>
                <div class="form-row">
                  <div class="form-group">
                    <label for="birthday">Birthday</label>
                    <input
                      id="birthday"
                      type="date"
                      formControlName="birthday"
                    />
                  </div>
                  <div class="form-group">
                    <label for="anniversary">Anniversary</label>
                    <input
                      id="anniversary"
                      type="date"
                      formControlName="anniversary"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="nickname">Nickname</label>
                    <input
                      id="nickname"
                      type="text"
                      formControlName="nickname"
                    />
                  </div>
                
                  <div class="form-group">
                    <label for="suffix">Suffix</label>
                    <input id="suffix" type="text" formControlName="suffix" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="title">Title</label>
                    <input id="title" type="text" formControlName="title" />
                  </div>
                  <div class="form-group">
                    <label for="spouse">Spouse</label>
                    <input id="spouse" type="text" formControlName="spouse" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="children">Children</label>
                  <input id="children" type="text" formControlName="children" />
                </div>
              </fieldset>

              <!-- Business Information -->
              <fieldset>
                <legend>Business Information</legend>
                <div class="form-group">
                  <label for="businessAddress">Business Address</label>
                  <input
                    id="businessAddress"
                    type="text"
                    formControlName="businessAddress"
                  />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="businessCity">City</label>
                    <input
                      id="businessCity"
                      type="text"
                      formControlName="businessCity"
                    />
                  </div>
                  <div class="form-group">
                    <label for="businessState">State</label>
                    <input
                      id="businessState"
                      type="text"
                      formControlName="businessState"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="businessPhone">Business Phone</label>
                    <input
                      id="businessPhone"
                      type="tel"
                      formControlName="businessPhone"
                    />
                  </div>
                  <div class="form-group">
                    <label for="businessFax">Business Fax</label>
                    <input
                      id="businessFax"
                      type="tel"
                      formControlName="businessFax"
                    />
                  </div>
                </div>
              </fieldset>

              <!-- Additional Contact Information -->
              <fieldset>
                <legend>Additional Contact Information</legend>
                <div class="form-group">
                  <label for="webPage">Web Page</label>
                  <input
                    id="webPage"
                    type="url"
                    formControlName="webPage"
                    [class.invalid]="isFieldInvalid('webPage')"
                  />
                  <div class="error-message" *ngIf="isFieldInvalid('webPage')">
                    Please enter a valid web address (e.g., https://example.com)
                  </div>
                </div>
                <div class="form-group">
                  <label for="notes">Notes</label>
                  <textarea
                    id="notes"
                    formControlName="notes"
                    rows="3"
                  ></textarea>
                </div>
              </fieldset>

              <!-- Contact Information -->
              <fieldset>
                <legend>Additional Contact Information</legend>
                <div class="form-row">
                  <div class="form-group">
                    <label for="email2Address">Email 2</label>
                    <input
                      id="email2Address"
                      type="email"
                      formControlName="email2Address"
                      [class.invalid]="isFieldInvalid('email2Address')"
                    />
                    <div
                      class="error-message"
                      *ngIf="isFieldInvalid('email2Address')"
                    >
                      Please enter a valid email address
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="email3Address">Email 3</label>
                    <input
                      id="email3Address"
                      type="email"
                      formControlName="email3Address"
                      [class.invalid]="isFieldInvalid('email3Address')"
                    />
                    <div
                      class="error-message"
                      *ngIf="isFieldInvalid('email3Address')"
                    >
                      Please enter a valid email address
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="primaryPhone">Primary Phone</label>
                    <input
                      id="primaryPhone"
                      type="tel"
                      formControlName="primaryPhone"
                    />
                  </div>
                  <div class="form-group">
                    <label for="homePhone">Home Phone</label>
                    <input
                      id="homePhone"
                      type="tel"
                      formControlName="homePhone"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="homePhone2">Home Phone 2</label>
                    <input
                      id="homePhone2"
                      type="tel"
                      formControlName="homePhone2"
                    />
                  </div>
                  <div class="form-group">
                    <label for="homeFax">Home Fax</label>
                    <input id="homeFax" type="tel" formControlName="homeFax" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="carPhone">Car Phone</label>
                    <input
                      id="carPhone"
                      type="tel"
                      formControlName="carPhone"
                    />
                  </div>
                  <div class="form-group">
                    <label for="pager">Pager</label>
                    <input id="pager" type="tel" formControlName="pager" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="callback">Callback Number</label>
                  <input id="callback" type="tel" formControlName="callback" />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="isdn">ISDN</label>
                    <input id="isdn" type="tel" formControlName="isdn" />
                  </div>
                  <div class="form-group">
                    <label for="radioPhone">Radio Phone</label>
                    <input
                      id="radioPhone"
                      type="tel"
                      formControlName="radioPhone"
                    />
                  </div>
                  <div class="form-group">
                    <label for="telex">Telex</label>
                    <input id="telex" type="tel" formControlName="telex" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="ttyTddPhone">TTY/TDD Phone</label>
                  <input
                    id="ttyTddPhone"
                    type="tel"
                    formControlName="ttyTddPhone"
                  />
                </div>
              </fieldset>

              <!-- Extended Business Information -->
              <fieldset>
                <legend>Extended Business Information</legend>
                <div class="form-row">
                  <div class="form-group">
                    <label for="department">Department</label>
                    <input
                      id="department"
                      type="text"
                      formControlName="department"
                    />
                  </div>
                  <div class="form-group">
                    <label for="officeLocation">Office Location</label>
                    <input
                      id="officeLocation"
                      type="text"
                      formControlName="officeLocation"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="managerName">Manager's Name</label>
                    <input
                      id="managerName"
                      type="text"
                      formControlName="managerName"
                    />
                  </div>
                  <div class="form-group">
                    <label for="assistantName">Assistant's Name</label>
                    <input
                      id="assistantName"
                      type="text"
                      formControlName="assistantName"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="assistantPhone">Assistant's Phone</label>
                  <input
                    id="assistantPhone"
                    type="tel"
                    formControlName="assistantPhone"
                  />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="companyMainPhone">Company Main Phone</label>
                    <input
                      id="companyMainPhone"
                      type="tel"
                      formControlName="companyMainPhone"
                    />
                  </div>
                  <div class="form-group">
                    <label for="businessPhone2">Business Phone 2</label>
                    <input
                      id="businessPhone2"
                      type="tel"
                      formControlName="businessPhone2"
                    />
                  </div>
                </div>
              </fieldset>

              <!-- Business Address -->
              <fieldset>
                <legend>Business Address</legend>
                <div class="form-group">
                  <label for="businessStreet">Street</label>
                  <textarea
                    id="businessStreet"
                    formControlName="businessStreet"
                    rows="3"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="businessStreet2">Street Line 2</label>
                  <textarea
                    id="businessStreet2"
                    formControlName="businessStreet2"
                    rows="2"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="businessStreet3">Street Line 3</label>
                  <textarea
                    id="businessStreet3"
                    formControlName="businessStreet3"
                    rows="2"
                  ></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="businessPostalCode">Postal Code</label>
                    <input
                      id="businessPostalCode"
                      type="text"
                      formControlName="businessPostalCode"
                    />
                  </div>
                  <div class="form-group">
                    <label for="businessAddressPOBox">PO Box</label>
                    <input
                      id="businessAddressPOBox"
                      type="text"
                      formControlName="businessAddressPOBox"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="businessCountry">Country</label>
                    <input
                      id="businessCountry"
                      type="text"
                      formControlName="businessCountry"
                    />
                  </div>
                  <div class="form-group">
                    <label for="businessCountryRegion">Country/Region</label>
                    <input
                      id="businessCountryRegion"
                      type="text"
                      formControlName="businessCountryRegion"
                    />
                  </div>
                </div>
              </fieldset>

              <!-- Home Address -->
              <fieldset>
                <legend>Home Address</legend>
                <div class="form-group">
                  <label for="homeStreet">Street</label>
                  <textarea
                    id="homeStreet"
                    formControlName="homeStreet"
                    rows="3"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="homeStreet2">Street Line 2</label>
                  <textarea
                    id="homeStreet2"
                    formControlName="homeStreet2"
                    rows="2"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="homeStreet3">Street Line 3</label>
                  <textarea
                    id="homeStreet3"
                    formControlName="homeStreet3"
                    rows="2"
                  ></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="homeCity">City</label>
                    <input
                      id="homeCity"
                      type="text"
                      formControlName="homeCity"
                    />
                  </div>
                  <div class="form-group">
                    <label for="homeState">State</label>
                    <input
                      id="homeState"
                      type="text"
                      formControlName="homeState"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="homePostalCode">Postal Code</label>
                    <input
                      id="homePostalCode"
                      type="text"
                      formControlName="homePostalCode"
                    />
                  </div>
                  <div class="form-group">
                    <label for="homeAddressPOBox">PO Box</label>
                    <input
                      id="homeAddressPOBox"
                      type="text"
                      formControlName="homeAddressPOBox"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="homeCountry">Country</label>
                    <input
                      id="homeCountry"
                      type="text"
                      formControlName="homeCountry"
                    />
                  </div>
                  <div class="form-group">
                    <label for="homeCountryRegion">Country/Region</label>
                    <input
                      id="homeCountryRegion"
                      type="text"
                      formControlName="homeCountryRegion"
                    />
                  </div>
                </div>
              </fieldset>

              <!-- Other Address -->
              <fieldset>
                <legend>Other Address</legend>
                <div class="form-group">
                  <label for="otherAddress">Address</label>
                  <input
                    id="otherAddress"
                    type="text"
                    formControlName="otherAddress"
                  />
                </div>
                <div class="form-group">
                  <label for="otherStreet">Street</label>
                  <textarea
                    id="otherStreet"
                    formControlName="otherStreet"
                    rows="3"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="otherStreet2">Street Line 2</label>
                  <textarea
                    id="otherStreet2"
                    formControlName="otherStreet2"
                    rows="2"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="otherStreet3">Street Line 3</label>
                  <textarea
                    id="otherStreet3"
                    formControlName="otherStreet3"
                    rows="2"
                  ></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="otherCity">City</label>
                    <input
                      id="otherCity"
                      type="text"
                      formControlName="otherCity"
                    />
                  </div>
                  <div class="form-group">
                    <label for="otherState">State</label>
                    <input
                      id="otherState"
                      type="text"
                      formControlName="otherState"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="otherPostalCode">Postal Code</label>
                    <input
                      id="otherPostalCode"
                      type="text"
                      formControlName="otherPostalCode"
                    />
                  </div>
                  <div class="form-group">
                    <label for="otherAddressPOBox">PO Box</label>
                    <input
                      id="otherAddressPOBox"
                      type="text"
                      formControlName="otherAddressPOBox"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="otherCountry">Country</label>
                    <input
                      id="otherCountry"
                      type="text"
                      formControlName="otherCountry"
                    />
                  </div>
                  <div class="form-group">
                    <label for="otherCountryRegion">Country/Region</label>
                    <input
                      id="otherCountryRegion"
                      type="text"
                      formControlName="otherCountryRegion"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="otherFax">Fax</label>
                  <input id="otherFax" type="tel" formControlName="otherFax" />
                </div>
                <div class="form-group">
                  <label for="otherPhone">Phone</label>
                  <input
                    id="otherPhone"
                    type="tel"
                    formControlName="otherPhone"
                  />
                </div>
              </fieldset>

              <!-- Other -->
              <fieldset>
                <legend>Other Information</legend>
                <div class="form-group">
                  <label for="categories">Categories</label>
                  <input
                    id="categories"
                    type="text"
                    formControlName="categories"
                  />
                </div>
                <div class="form-group">
                  <label for="hobby">Hobby</label>
                  <input id="hobby" type="text" formControlName="hobby" />
                </div>
                <div class="form-group">
                  <label for="location">Location</label>
                  <input id="location" type="text" formControlName="location" />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="referredBy">Referred By</label>
                    <input
                      id="referredBy"
                      type="text"
                      formControlName="referredBy"
                    />
                  </div>
                  <div class="form-group">
                    <label for="schools">Schools</label>
                    <input id="schools" type="text" formControlName="schools" />
                  </div>
                </div>
                <div class="form-group">
                  <label for="personalWebPage">Personal Web Page</label>
                  <input
                    id="personalWebPage"
                    type="url"
                    formControlName="personalWebPage"
                    [class.invalid]="isFieldInvalid('personalWebPage')"
                  />
                  <div
                    class="error-message"
                    *ngIf="isFieldInvalid('personalWebPage')"
                  >
                    Please enter a valid web address (e.g., https://example.com)
                  </div>
                </div>
                <div class="form-group">
                  <label for="imAddress">IM Address</label>
                  <input
                    id="imAddress"
                    type="text"
                    formControlName="imAddress"
                  />
                </div>
              </fieldset>

              <!-- Yomi Names (Japanese) -->
              <fieldset>
                <legend>Yomi Names (Japanese Phonetic)</legend>
                <div class="form-row">
                  <div class="form-group">
                    <label for="companyYomi">Company Yomi</label>
                    <input
                      id="companyYomi"
                      type="text"
                      formControlName="companyYomi"
                    />
                  </div>
                  <div class="form-group">
                    <label for="givenYomi">Given Yomi</label>
                    <input
                      id="givenYomi"
                      type="text"
                      formControlName="givenYomi"
                    />
                  </div>
                  <div class="form-group">
                    <label for="surnameYomi">Surname Yomi</label>
                    <input
                      id="surnameYomi"
                      type="text"
                      formControlName="surnameYomi"
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="form-actions-wrapper">
            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="cancel()">
                Cancel
              </button>
              <button type="submit" [disabled]="!contactForm.valid">
                {{ isEditMode ? 'Update' : 'Add' }} Contact
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        max-width: 1200px;  /* Increased from 600px */
        width: 95%;         /* Added for responsive sizing */
        margin: 0 auto;
        padding: 20px;
        padding-bottom: 80px;
      }

      .form-card {
        background: var(--card);
        border-radius: 12px;
        padding: 24px;
        box-shadow: var(--shadow);
      }

      h2 {
        margin: 0 0 24px 0;
        font-size: 20px;
        font-weight: 600;
      }

      .image-upload {
        text-align: center;
        margin-bottom: 24px;
      }

      .image-container {
        position: relative;
        display: inline-block;
      }

      .profile-image {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        object-fit: cover;
      }

      .change-image-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .form-group {
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text);
      }

      .array-entry {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }

      .array-entry input {
        flex: 1;
      }

      .add-btn {
        background: var(--success);
        color: white;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 8px;
      }

      .remove-btn {
        background: var(--danger);
        color: white;
        padding: 8px;
      }

      .form-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
      }

      .form-actions button {
        flex: 1;
        padding: 12px;
      }

      .cancel-btn {
        background: var(--text-light);
        color: white;
      }

      button[type='submit'] {
        background: var(--primary);
        color: white;
      }

      button[type='submit']:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      input[type='file'] {
        display: none;
      }

      .form-row {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
        flex-wrap: wrap;  /* Added for responsive layout */
      }

      .form-row .form-group {
        flex: 1;
        min-width: 250px;  /* Added minimum width for better mobile layout */
      }

      .toggle-btn {
        width: 100%;
        background: var(--secondary);
        color: var(--foreground);
        padding: 12px;
        margin: 16px 0;
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.2s;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      }

      .toggle-btn:hover {
        background: rgba(var(--secondary-rgb), 0.9);
        transform: translateY(-1px);
        filter: brightness(1.1);
      }

      fieldset {
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      }

      legend {
        padding: 0 8px;
        font-weight: 500;
      }

      textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--border);
        border-radius: 4px;
        resize: vertical;
        min-height: 38px;
        font-family: inherit;
        font-size: inherit;
      }

      textarea:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
      }

      .advanced-fields {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
      }

      .form-content {
        margin-bottom: 16px;
      }

      .form-actions-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--card);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        z-index: 100;
      }

      .form-actions {
        max-width: 1200px;  /* Increased from 600px to match container */
        width: 95%;         /* Added for responsive sizing */
        margin: 0 auto;
        display: flex;
        gap: 12px;
        padding: 16px 20px;
      }

      .form-actions button {
        flex: 1;
        padding: 12px;
        border-radius: 6px;
        font-weight: 500;
        transition: opacity 0.2s;
      }

      input.invalid {
        border-color: var(--danger);
        background-color: rgba(var(--danger-rgb), 0.05);
      }

      .error-message {
        color: var(--danger);
        font-size: 12px;
        margin-top: 4px;
      }

      input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
      }

      input.invalid:focus {
        border-color: var(--danger);
        box-shadow: 0 0 0 2px rgba(var(--danger-rgb), 0.1);
      }

      /* Added responsive adjustments */
      @media (max-width: 768px) {
        .page-container {
          padding: 10px;
        }

        .form-card {
          padding: 16px;
        }

        fieldset {
          padding: 12px;
        }

        .form-row {
          flex-direction: column;
          gap: 8px;
        }

        .form-row .form-group {
          min-width: 100%;
        }

        .form-actions {
          padding: 12px;
        }

        .image-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      }

      /* Added larger screen optimizations */
      @media (min-width: 1024px) {
        fieldset {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          align-items: start;
        }

        fieldset > legend {
          grid-column: 1 / -1;
        }

        fieldset > .form-row,
        fieldset > .form-group {
          margin: 0;
        }
      }

      /* Improved form field aesthetics */
      input, textarea, select {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background-color: var(--card);
        color: var(--text);
        transition: all 0.2s ease;
      }

      input:hover, textarea:hover {
        border-color: var(--primary);
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  contactId?: number;
  imagePreview: string | null = null;
  private imageFile: File | null = null;
  showAdvancedFields = false;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private avatarService: AvatarService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', []],
      emailAddress: ['', [Validators.email]],
      mobilePhone: ['', [Validators.pattern('^[0-9-+()\\s]*$')]],
      company: [''],
      jobTitle: [''],
      birthday: [''],
      nickname: [''],
      businessAddress: [''],
      businessCity: [''],
      businessState: [''],
      businessPhone: [''],
      businessFax: [''],
      webPage: ['', [Validators.pattern('https?://.+')]],
      notes: [''],
      imageUrl: [''],
      title: [''],
      middleName: [''],
      suffix: [''],
      anniversary: [''],
      spouse: [''],
      children: [''],
      email2Address: ['', [Validators.email]],
      email3Address: ['', [Validators.email]],
      primaryPhone: [''],
      homePhone: [''],
      homePhone2: [''],
      homeFax: [''],
      carPhone: [''],
      pager: [''],
      callback: [''],
      isdn: [''],
      radioPhone: [''],
      telex: [''],
      ttyTddPhone: [''],
      department: [''],
      officeLocation: [''],
      managerName: [''],
      assistantName: [''],
      assistantPhone: [''],
      companyMainPhone: [''],
      businessPhone2: [''],
      businessStreet: [''],
      businessStreet2: [''],
      businessStreet3: [''],
      businessPostalCode: [''],
      businessAddressPOBox: [''],
      businessCountry: [''],
      businessCountryRegion: [''],
      homeStreet: [''],
      homeStreet2: [''],
      homeStreet3: [''],
      homeCity: [''],
      homeState: [''],
      homePostalCode: [''],
      homeAddressPOBox: [''],
      homeCountry: [''],
      homeCountryRegion: [''],
      categories: [''],
      hobby: [''],
      location: [''],
      referredBy: [''],
      schools: [''],
      personalWebPage: ['', [Validators.pattern('https?://.+')]],
      imAddress: [''],
      companyYomi: [''],
      givenYomi: [''],
      surnameYomi: [''],
      otherAddress: [''],
      otherAddressPOBox: [''],
      otherCity: [''],
      otherCountry: [''],
      otherCountryRegion: [''],
      otherFax: [''],
      otherPhone: [''],
      otherPostalCode: [''],
      otherState: [''],
      otherStreet: [''],
      otherStreet2: [''],
      otherStreet3: [''],
    });
  }

  toggleAdvancedFields() {
    this.showAdvancedFields = !this.showAdvancedFields;
  }

  async onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      this.imagePreview = await this.readFileAsDataUrl(file);
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imagePreview = null;
    this.contactForm.patchValue({ imageUrl: '' });
  }

  getFormControls() {
    const controls = this.contactForm.controls;
    return Object.keys(controls).map((key) => ({
      key,
      control: controls[key],
    }));
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.contactId = Number(id);
      const contact = await this.storage.getContact(this.contactId);
      if (contact) {
        this.contactForm.patchValue(contact);
        if (contact.imageUrl) {
          this.imagePreview = contact.imageUrl;
        } else {
          this.imagePreview = await this.avatarService.getAvatarUrl(contact.emailAddress || '');
        }
      }
    }
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const contact = {
        ...formValue,
        birthday: formValue.birthday || undefined,
        anniversary: formValue.anniversary || undefined,
        imageUrl: this.imageFile ? this.imagePreview : 
          (formValue.imageUrl || this.avatarService.getAvatarUrl(formValue.emailAddress || '')),
      };

      if (this.isEditMode && this.contactId) {
        contact.id = this.contactId;
        await this.storage.updateContact(contact);
      } else {
        await this.storage.addContact(contact);
      }
      this.router.navigate(['']);
    }
  }

  cancel() {
    this.router.navigate(['']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
