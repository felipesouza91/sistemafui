import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { ClienteService } from './../cliente.service';

interface FileDTO {
  id: string;
  fileName: string;
  contentType: string;
  fileUrl: string
}

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

  constructor(
    private clientService: ClienteService,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  @ViewChild("fileUpload") fileUpload!: FileUpload;
  @Input() clientId!: number;
  @Input() showUploadDialog: boolean = false;
  @Input() uploadUrl!: string;
  @Input() headers!: HttpHeaders;
  selectedFile!: FileDTO;
  files: FileDTO[] = [];
  ngOnInit(): void {
    if (this.clientId) {
      this.loadFileData()
    }
  }


  async generateUploadUrl(event: any) {
    const file = event.currentFiles[0] as File
    const response = await this.clientService.generateUploadUrl({ clientId: this.clientId, fileName: file.name, contentType: file.type })
    this.uploadUrl = response.uploadUrl;
    this.headers = new HttpHeaders()
    this.headers.append("Content-Type", file.type);
  }

   uploadFile(event: any) {
    this.fileUpload.disabled = true
    this.fileUpload.uploading = true
    this.fileUpload.showUploadButton = false
     const file: File = event.files[0]
     console.log(file)
    let formData = new FormData();
    formData.append("myfile", event.files[0]);

    this.httpClient.put(this.uploadUrl, file, {
       reportProgress: true,
       observe: "events"
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log(event.type)
          this.fileUpload.progress = Math.round((event.loaded / event.total!) * 100)
          this.fileUpload.cd.detectChanges()
        }
      },
      complete: () => {
        this.fileUpload.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Arquivo enviado com sucesso',
        })
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao enviar arquivo',
        })
      },
    })
    this.fileUpload.disabled = false;
    this.fileUpload.uploading = false;
    this.fileUpload.showUploadButton = true
    this.loadFileData()
  }

  setFile(file: FileDTO) {
    this.selectedFile = file;
  }

  remover(file: FileDTO) {
    this.confirmationService.confirm({
      message: `Deseja excluir o arquivo: ${file.fileName}?`,
      accept: () => {
        this.clientService.deleteFile(this.clientId, file.id)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Arquivo excluido com sucesso',
            })
          }).catch((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover arquivo',
            })
        }).finally(() => this.loadFileData())
      },
    });
  }

  private loadFileData() {
    this.clientService.getAllFiles(this.clientId).then(data => this.files = data)
  }
}
