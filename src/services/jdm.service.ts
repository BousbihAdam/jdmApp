import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class JdmService {
  constructor(private http: Http) { }
 
  getResult(term: String){
    return this.http.get('https://sheltered-stream-21323.herokuapp.com/'+term).map(result => result.json());
  }

}

 