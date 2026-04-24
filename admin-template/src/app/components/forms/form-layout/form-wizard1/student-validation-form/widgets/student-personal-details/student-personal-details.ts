import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-personal-details',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './student-personal-details.html',
  styleUrl: './student-personal-details.scss',
})
export class StudentPersonalDetails {}
