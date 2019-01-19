import { Component, Inject } from '@angular/core';
import { JdmService } from '../../services/jdm.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
export interface DialogData {
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'JeuxDeMots';
  data: any[];
  rtid: any[];
  private terme: String;
  elementToDisplay: String ;
  element ="both";
  
  constructor(private jdmService: JdmService,public dialog: MatDialog,
    private route: ActivatedRoute) {}
   myEvent(event) {
    this.elementToDisplay = event.target.id;
    console.log(event.target.id);
  }
  relationEvent(event){
    this.element = event.target.id;
    console.log(event.target.id);
  }  
  onClickSubmit() {  
    console.log(this.terme);
      this.jdmService.getResult(this.terme).subscribe(resp => {
          console.log("lebbeeeees : ");
          this.data = Array.of(resp);
        
          console.log(this.data);  
          this.rtid = Object.keys(resp.relations);
          console.log(this.rtid);
      });
    }
    ngOnInit() {
    
      let url = this.route.snapshot.paramMap.get("word");
      console.log("this is the url");
      console.log(url);
      //let id = +this.route.snapshot.params['id'];
    
      if(url != undefined && url != null){
        this.jdmService.getResult(url).subscribe(resp => {
          console.log("lebbeeeees : ");
          this.data = Array.of(resp);
        
          console.log(this.data);  
          this.rtid = Object.keys(resp.relations);
          console.log(this.rtid);
      });
    }
  }

    //<a href="/relation/{{rtid}}"> 

    openDialog(event): void {
      let relationDescription = event.target.id;
      console.log(event.target.id);

      const dialogRef = this.dialog.open(relationPopUp, {
        height: '400px',
        width: '600px',
        data: {description: relationDescription}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }


}
@Component({
  selector: 'relationPopUp',
  templateUrl: '../relationPopUp.html',
})

export class relationPopUp {
  constructor(
    public dialogRef: MatDialogRef<relationPopUp>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

 
}

 