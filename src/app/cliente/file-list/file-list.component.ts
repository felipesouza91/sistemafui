import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ClienteService } from './../cliente.service';
@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

  constructor(private clientService: ClienteService, private httpClient: HttpClient) { }

  @Input() clientId!: number;
  @Input() showUploadDialog: boolean = false;
  @Input() uploadUrl!: string;
  ngOnInit(): void {
  }


  async generateUploadUrl(event: any) {
    const file = event.currentFiles[0] as File
    console.log(file);
    const response = await this.clientService.generateUploadUrl({ clientId: this.clientId, fileName: file.name, contentType: file.type })
    console.log(response);
    this.uploadUrl = response.uploadUrl;
  }

  async uploadFile(event: any) {
    console.log("Aqui")
    const file: File = event.files[0]
    let formData = new FormData();
    formData.append("myfile", event.files[0]);
    console.log();
    firstValueFrom(this.httpClient.put(this.uploadUrl, file))
      .then(response => response)
  }
}
