import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {Structure} from '../../model/structure.modal';
import {HttpClient} from '@angular/common/http';
import {StructureService} from "../../service/structure.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-structures',
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.css']
})
export class StructuresComponent implements OnInit {
  structureList: Structure[];
  closeResult: string;
  editForm: FormGroup;
  id: any;
  totalLength:any ;
  page:number=1;
  showpost:any =[] ;
  nomStructure:any ;


  constructor(public structureservice: StructureService,
              private modalService: NgbModal,
              private httpClient: HttpClient,
              private fb: FormBuilder,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getAllStructures();

    this.editForm = this.fb.group({

      nomStructure: [''],
      etat : [''],
      dateCreation: ['']

    });
  }


  getAllStructures() {
    this.structureservice.getAllStructures().subscribe(data => {
        this.structureList = Object.assign([], data)
        //this.resetForm(form);
        this.showpost=data ;
        this.totalLength = data.length ;
        //console.log(this.showpost);
        console.log(this.structureList);
      },
      error => {
        console.log(error);
      });
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit(form: NgForm) {
    //console.log(form.value)


    this.structureservice.addStructure(form.value).subscribe(
      data => {
        this.structureList = Object.assign([], data)
        this.resetForm(form);
        this.getAllStructures();
      },
      error => {
        console.log(error);
      });
      this.modalService.dismissAll();
      this.toastr.success('avec succ??s!','Structure ajout??e', );



  }


  // onSubmit(f:NgForm) {
  //   const url = 'http://localhost:8080/user/save;'
  //   this.httpClient.post(url, f.value)
  //     .subscribe((result) => {
  //       this.ngOnInit(); //reload the table
  //     });
  //   this.modalService.dismissAll(); //dismiss the modal
  // }

  resetForm(form) {
    form.reset();
  }

  openDetails(targetModal, structure: Structure) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    document.getElementById('nom').setAttribute('value', structure.nomStructure);
    document.getElementById('etatt').setAttribute('value', structure.etat);


  }

  openEdit(targetModal, structure: Structure) {
    this.id = structure.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue({
      nomStructure: structure.nomStructure,
      etat: structure.etat,
      date_creation: structure.dateCreation,
    });
  }

  Edit() {

    console.log(this.editForm.value);
    this.structureservice.put(this.id, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
        this.toastr.warning('avec succ??s!','Structure modifi??e', );

      });
  }











  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  search()
{
 if (this.nomStructure=="")
 {
this.ngOnInit();
 }else {
   this.structureList=this.structureList.filter(res=>{
     return res.nomStructure.toLocaleLowerCase().match(this.nomStructure.toLocaleLowerCase())


   })
 }

}

stateToggler(id){
  console.log("clicked "+id);
  this.structureservice.toggleState(id).subscribe(res=>{
    this.getAllStructures();
    console.log(res);
  });
}


}
