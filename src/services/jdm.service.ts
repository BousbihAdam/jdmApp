import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class JdmService {
  constructor(private http: Http) { }

  getResult(term: String){
    return this.http.get('http://localhost:3000/'+term).map(result => result.json());
  }

}

 