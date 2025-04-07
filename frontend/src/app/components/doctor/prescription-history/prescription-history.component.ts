import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prescription-history',
  templateUrl: './prescription-history.component.html',
  styleUrls: ['./prescription-history.component.css']
})
export class PrescriptionHistoryComponent {
  @Input() disease = '';
  @Input() prescription = '';
  @Input() isOpen = false;
  @Input() close!: () => void;

}
