import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class MyService{
    constructor(private http: HttpClient) { }

    authenticate(username: string, password: string): Promise<boolean> {
        const params = new HttpParams()
            .set('username', username)
            .set('password', password)
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            return(
                this.http.post('http://localhost:3000/authenticate', params.toString(), {headers}
                .toPromise()
                .then(()=> true)
                .catch(() => false)
                )
            )
    }
}