import { Component, OnInit } from '@angular/core';
import { BackupService } from './backup.service';
import { Job } from './domain/job';
import { BackupPlan } from './domain/backup-plan';
import { FileEndpoint } from './domain/file-endpoint';
import { NotificationService, Notification, NotificationType } from '../../core/notification.service';

@Component({
  selector: 'sb-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss']
})
export class BackupComponent implements OnInit {
  jobs: Job[];
  plans: BackupPlan[];
  destinations: FileEndpoint[];

  constructor(protected readonly backupService: BackupService,
              protected readonly nService: NotificationService) { }

  ngOnInit() {
    this.loadPlans();
    this.loadJobs();
    this.loadDestinations();
  }

  private loadJobs() {
    this.backupService
      .loadAll('jobs')
      .subscribe((jobs: any) => {
        this.jobs = jobs.content;
      });
  }

  private loadDestinations() {
    this.backupService
      .loadAll('destinations')
      .subscribe((destinations: any) => {
        this.destinations = destinations.content;
      })
  }

  private loadPlans() {
    this.backupService
      .loadAll('plans')
      .subscribe((plans: any) => {
        this.plans = plans.content;
      });
  }

  startBackup(plan: string, id: string) {
    this.backupService.saveOne({plan: plan}, 'backup', id)
      .subscribe({
        next: (d) => {
          this.nService.add(new Notification(NotificationType.Warning, 'Started Backup'));
          this.loadDestinations()
        },
        error: (e) => {
          this.nService.add(new Notification(NotificationType.Warning, 'Could not start backup.'));
        }
      });
  }
}
